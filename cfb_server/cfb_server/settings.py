import logging
import os

import environ
from django.conf.locale.en import formats as en_formats

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('DJANGO_SECRET_KEY', default='abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DEBUG', default=False)

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=['*'])

default_csrf_trusted_origins = []
if DEBUG:
    default_csrf_trusted_origins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ]
CSRF_TRUSTED_ORIGINS = env.list(
    'DJANGO_CSRF_TRUSTED_ORIGINS',
    default=default_csrf_trusted_origins,
)

# Setup support for proxy headers
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# Community packages
INSTALLED_APPS += [

    # Django REST Framework
    'rest_framework',

    # Tags
    'taggit',
]

# Custom apps
INSTALLED_APPS += [
    'cfb',
]

# Custom user model
INSTALLED_APPS += [
    'users'
]

AUTH_MODE = env('AUTH_MODE', default='local').strip().lower()
if AUTH_MODE not in ['local', 'oauth']:
    raise ValueError("AUTH_MODE must be either 'local' or 'oauth'.")

AUTHENTICATION_BACKENDS = []

AUTH_USER_MODEL = 'users.User'
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Taggit settings
TAGGIT_CASE_INSENSITIVE = True
# Taggit settings

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


CACHES = {
    'default': env.cache('CACHE_URL', default='locmemcache://'),
}

# django-environ maps "memcache://" to deprecated MemcachedCache on older templates.
# Django 5 removed that backend, so force a supported backend.
if CACHES['default'].get('BACKEND') == 'django.core.cache.backends.memcached.MemcachedCache':
    CACHES['default']['BACKEND'] = 'django.core.cache.backends.memcached.PyMemcacheCache'

# Production uses memcached for CACHE_URL (so all instances of Daphne server can access session info)
# Using cache as session engine and locmemcache as cache will result session clearing
# after each restart of application (you will have to login again)
# So in DEV environment you can either spin up your own memcached instance and specify it, e.g.
# CACHE_URL=memcache://192.168.99.100:11211
# or you can use file backend as session engine.
if DEBUG and CACHES['default']['BACKEND'] == 'django.core.cache.backends.locmem.LocMemCache':
    SESSION_ENGINE = "django.contrib.sessions.backends.file"

    # Override default SESSION_FILE_PATH (which default to tempfile.gettempdir())
    # because it WILL contain your passwords and you DON'T want them hanging there, where other people might see
    # so we use 'tmp' folder in Django root folder and add it to .gitignore
    SESSION_FILE_PATH = os.path.join(BASE_DIR, 'tmp')
    if not os.path.exists(SESSION_FILE_PATH):
        os.mkdir(SESSION_FILE_PATH)
else:
    SESSION_ENGINE = "django.contrib.sessions.backends.cache"


ROOT_URLCONF = 'cfb_server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'cfb_server.wsgi.application'


DATABASES = {
    'default': env.db_url('DJANGO_DB_URL', default='sqlite:///db.sqlite3')
}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = env('DJANGO_TIME_ZONE', default="UTC")
USE_I18N = True
USE_TZ = True

# Override time formats
en_formats.DATETIME_FORMAT = "Y-m-d H:i:s"

# Static files
# How static files will be served
STATIC_URL = '/staticfiles/'  # How static files will be served

# Where static files will be placed after collectstatic
# noinspection PyUnresolvedReferences
STATIC_ROOT = 'staticfiles/'

# Additional static folder
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, "static"),
# ]

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'


#
# OAUTH authentication (optional)
#
AUTHENTICATION_BACKENDS.append('django.contrib.auth.backends.ModelBackend')

if AUTH_MODE == 'oauth':
    INSTALLED_APPS.append('mozilla_django_oidc')
    AUTHENTICATION_BACKENDS.insert(0, 'cfb_server.auth_backends.KeycloakOIDCAuthenticationBackend')

    OAUTH_ISSUER_URL = env('OAUTH_ISSUER_URL', default='https://sso.example.com/realms/Example').rstrip('/')
    OIDC_RP_CLIENT_ID = env('OAUTH_CLIENT_ID')
    OIDC_RP_CLIENT_SECRET = env('OAUTH_CLIENT_SECRET', default='')
    OIDC_RP_SCOPES = env('OAUTH_SCOPES', default='openid profile email')
    OIDC_RP_SIGN_ALGO = env('OAUTH_SIGN_ALGO', default='RS256')
    OIDC_VERIFY_SSL = env.bool('OAUTH_VERIFY_SSL', default=True)
    OIDC_OP_AUTHORIZATION_ENDPOINT = f'{OAUTH_ISSUER_URL}/protocol/openid-connect/auth'
    OIDC_OP_TOKEN_ENDPOINT = f'{OAUTH_ISSUER_URL}/protocol/openid-connect/token'
    OIDC_OP_USER_ENDPOINT = f'{OAUTH_ISSUER_URL}/protocol/openid-connect/userinfo'
    OIDC_OP_JWKS_ENDPOINT = f'{OAUTH_ISSUER_URL}/protocol/openid-connect/certs'
    OIDC_OP_LOGOUT_ENDPOINT = f'{OAUTH_ISSUER_URL}/protocol/openid-connect/logout'
    OIDC_OP_LOGOUT_URL_METHOD = 'cfb_server.auth_utils.keycloak_logout_url'
    ALLOW_LOGOUT_GET_METHOD = True
    LOGIN_REDIRECT_URL_FAILURE = '/'
    OIDC_STORE_ID_TOKEN = True

    oidc_logger = logging.getLogger('mozilla_django_oidc')
    oidc_logger.addHandler(logging.StreamHandler())
    oidc_logger.setLevel(logging.DEBUG if DEBUG else logging.INFO)
