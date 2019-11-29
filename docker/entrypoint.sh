#!/bin/bash
set -e

# Set CACHE_URL to use local memory
# This is needed because currently memcached is not started and we need cache inside management commands
export CACHE_URL=locmemcache://

# wait shortly and then run db migrations (retry on error)
sleep 3
while ! python ./manage.py migrate 2>&1; do
  echo "Waiting on DB..."
  sleep 3
done

# create superuser silently
if [ -z ${SUPERUSER_NAME+x} ]; then
  SUPERUSER_NAME='admin'
fi
if [ -z ${SUPERUSER_EMAIL+x} ]; then
  SUPERUSER_EMAIL='admin@example.com'
fi
if [ -z ${SUPERUSER_PASSWORD+x} ]; then
    SUPERUSER_PASSWORD='admin'
fi

echo "Username: ${SUPERUSER_NAME}, E-Mail: ${SUPERUSER_EMAIL}"

python ./manage.py shell --interface python << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='${SUPERUSER_NAME}'):
    u=User.objects.create_superuser('${SUPERUSER_NAME}', '${SUPERUSER_EMAIL}', '${SUPERUSER_PASSWORD}')
    self.stdout.write("\nCreating user {} ({})  with password '{}'.".format('${SUPERUSER_NAME}', '${SUPERUSER_EMAIL}','${SUPERUSER_PASSWORD}'))
END

# import languages
# hide output in case we have
python ./manage.py loaddata -i fixtures/languages.json 2>&1 >/dev/null

# copy static files
python ./manage.py collectstatic --no-input

# Set CACHE_URL to use memcached via sock file
export CACHE_URL=memcache:///tmp/memcached.sock

# Nginx
# if certificates doesn't exist create a self signed certificate
echo " "
echo "Checking that SSL certificate and key files exist..."

[ ! -f /ssl/cert.key ] && \
[ ! -f /ssl/cert.crt ] && \
echo "/ssl/cert.crt and /ssl/cert.key not provided" && \
echo "Creating self signed certificate:" && \
mkdir -p /ssl && \
openssl req -x509 -nodes -days 3650 -subj "/CN=clifoobar" -addext "subjectAltName=DNS:clifoobar" -newkey rsa:4096 -keyout /ssl/cert.key -out /ssl/cert.crt;


echo "Initialisation is done."

# launch whatever is passed by docker
# (i.e. the RUN instruction in the Dockerfile)
exec ${@}