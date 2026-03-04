# Clifoobar
CLI snippet manager with Django backend, React frontend, and selectable authentication mode (`local` or `oauth`).

## Main App Concepts
### Architecture
- Backend: Django + Django REST Framework (`cfb_server/`)
- Frontend: React + Vite (`frontend/`)
- Runtime: single container serving:
  - Django API/admin behind Gunicorn
  - Static frontend through Nginx
  - Memcached for session/cache
- Database: PostgreSQL (separate container in Docker Compose)

### Domain Model
- `Snippet`: code snippet record (name, description, body, language, tags, popularity, personal/public visibility)
- `User`: Django user model (`users.User`)
- `Language`: available language values for snippets
- Tags: managed through `django-taggit`

### Auth Modes
- `AUTH_MODE=local`
  - Username/password login through Django admin login endpoint
  - Suitable for local/dev or small standalone deployments
- `AUTH_MODE=oauth`
  - OIDC login flow (Keycloak-compatible)
  - Frontend uses backend auth config endpoint and redirects to provider
  - Users are created on first successful login if missing

### Key API Areas
- `/api/snippets/`: snippet CRUD + search/filter/pagination/order
- `/api/tags/`, `/api/languages/`: metadata
- `/api/users/current/`: current authenticated user
- `/api/auth/config`, `/api/auth/oauth/login`, `/api/auth/logout`: auth flow control
- `/oidc/*`: OIDC endpoints (enabled only in `oauth` mode)

## Run With Docker Compose
### 1. Prepare Environment
1. Copy `.env.example` to `.env`.
2. Adjust values in `.env` for your environment.

```bash
cp .env.example .env
```

### 2. Start Stack
```bash
docker-compose -f docker-compose-qa.yml up -d --build
```

App URLs:
- `http://localhost:20080`
- `https://localhost:20443`

### Local Auth Mode
Set in `.env`:
```env
AUTH_MODE=local
```

Login uses local Django credentials (defaults from `.env`):
- `SUPERUSER_NAME`
- `SUPERUSER_PASSWORD`

### OAuth Mode (OIDC / Keycloak-compatible)
Set in `.env`:
```env
AUTH_MODE=oauth
OAUTH_ISSUER_URL=https://sso.example.com/realms/Example
OAUTH_CLIENT_ID=cli.example.com
OAUTH_CLIENT_SECRET=
```

Provider/client configuration must allow callback URL(s):
- `http://localhost:20080/oidc/callback/` (local)
- your production URL equivalent, e.g. `https://cli.example.com/oidc/callback/`

## Environment Variables
Use `.env.example` as the source of truth for Compose variables.  
`docker-compose-qa.yml` intentionally reads values from `.env` via `env_file` and does not hardcode deployment secrets.
