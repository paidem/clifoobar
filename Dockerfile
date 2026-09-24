ARG BUILDFRONTENDFROM=node:22.23.3-bookworm
ARG SERVERFROM=python:3.12-alpine

####################
# BUILDER FRONTEND #
####################

FROM ${BUILDFRONTENDFROM} AS builder-frontend
ARG DOCKER_TAG
COPY frontend/package.json frontend/package-lock.json /frontend/
WORKDIR /frontend
RUN npm install
COPY frontend /frontend
ENV REACT_APP_VERSION=$DOCKER_TAG
RUN npm run build

##################
# BUILDER WHEELS #
##################

FROM ${SERVERFROM} AS builder-wheels

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk add --no-cache \
    build-base \
    ca-certificates \
    musl-dev \
    postgresql-dev \
    python3-dev \
    libffi-dev

COPY cfb_server/requirements*.txt ./
RUN pip install --upgrade pip && \
    pip wheel --no-cache-dir --wheel-dir /usr/src/app/wheels -r requirements-auth.txt

#########
# FINAL #
#########

FROM ${SERVERFROM}

# install dependencies
RUN apk add --no-cache \
      bash \
      libpq \
      ca-certificates \
      openssl \
      memcached \
      nginx \
	  supervisor

# Inject built wheels and install them
COPY --from=builder-wheels /usr/src/app/wheels /wheels
RUN pip install --upgrade pip && \
    pip install --no-cache /wheels/*

# Inject django app
COPY cfb_server  /app

# Inject built frontend (Vite outputs to /frontend/dist)
COPY --from=builder-frontend /frontend/dist /frontend

# Inject docker specific configuration
COPY --chmod=755 docker/entrypoint.sh /entrypoint.sh
COPY docker/nginx-default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisor-app.ini /etc/supervisor.d/
COPY docker/supervisord.conf /etc/supervisord.conf

# Unprivileged user for gunicorn and memcached (supervisord stays root as PID 1),
# pidfile dirs, and /app/.env so django-environ doesn't warn
RUN addgroup -S app && adduser -S -G app -H -s /sbin/nologin app && \
    mkdir -p /run/nginx /run/gunicorn && \
    touch /app/.env

ENTRYPOINT ["/entrypoint.sh"]

# Change to app dir so entrypoint.sh can run ./manage.py and other things localy to django
WORKDIR /app

CMD ["supervisord", "-n"]
HEALTHCHECK --start-period=60s CMD wget -q --spider http://127.0.0.1/api/ || exit 1
EXPOSE 80
EXPOSE 443
