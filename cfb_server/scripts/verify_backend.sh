#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

PYTHON_BIN="${PYTHON_BIN:-}"
if [[ -z "${PYTHON_BIN}" ]]; then
  if [[ -x "${PROJECT_ROOT}/.venv/bin/python" ]]; then
    PYTHON_BIN="${PROJECT_ROOT}/.venv/bin/python"
  else
    PYTHON_BIN="python3"
  fi
fi

echo "Using Python: ${PYTHON_BIN}"

cd "${PROJECT_ROOT}"
"${PYTHON_BIN}" manage.py check
"${PYTHON_BIN}" manage.py migrate --noinput
"${PYTHON_BIN}" manage.py collectstatic --no-input
"${PYTHON_BIN}" manage.py test
