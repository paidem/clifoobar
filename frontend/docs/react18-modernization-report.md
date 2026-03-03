# React 18 + Frontend Modernization Report

## Dependency Compatibility Matrix

### Safe/minor-or-patch updates
- `axios` (updated)
- `@yaireo/tagify` (updated)
- `semantic-ui-css` (updated)
- `semantic-ui-react` (updated)
- `web-vitals` (updated)

### Breaking-major but low-effort migration
- `react` / `react-dom` 17 -> 18
- `@testing-library/react` / `@testing-library/user-event` / `@testing-library/jest-dom` (new major set, moved to Vitest)

### Breaking-major with code migration
- `react-router-dom` 5 -> 6 (replaced `withRouter`, moved to `Routes` + `element`)
- `react-codemirror2` + `codemirror@5` -> `@uiw/react-codemirror` + CodeMirror 6 language packages
- `react-moment` + `moment-timezone` -> `dayjs`

### Removed packages
- `react-scripts` (CRA tooling removed)
- `react-router` (no longer needed directly)
- `react-codemirror2`
- `codemirror` (v5)
- `react-moment`
- `moment-timezone`
- `react-uuid` (replaced by stable language-code keys)
- `add` (unused)

## Tooling Migration
- Build tool migrated from CRA to Vite (`vite` + `@vitejs/plugin-react`)
- Test runner migrated to `vitest` + `jsdom`
- Dev proxy moved from `src/setupProxy.js` to `vite.config.js`
- Root HTML entry migrated to Vite `index.html`

## Environment Compatibility
- `REACT_APP_VERSION` compatibility is preserved in Vite via `define` mapping in `vite.config.js`
- `VITE_APP_VERSION` is also supported
- `DJANGO_PROXY_HOST` + `DJANGO_PROXY_PORT` are preserved for local API proxy routing

## Runtime/Toolchain Pinning
- Frontend Node target pinned to 22 (`frontend/.nvmrc`)
- Repository Node target pinned to 22 (`.nvmrc`)
- Docker frontend builder upgraded to Node 22 (`Dockerfile`)

## Validation Checklist

### Automated checks
- `npm install`
- `npm run test`
- `npm run build`

### Manual smoke checks
- Login/logout flow
- Snippet list loading
- Search initialization from URL parameter and hash
- Snippet create/edit/delete modal
- Tag add/remove behavior
- Language loading and language dropdown
- Pagination behavior
- Sorting behavior

