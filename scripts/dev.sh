#!/bin/bash
set -Eeuo pipefail

PORT="${PORT:-5000}"
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-$PORT}"
PNPM_CMD="${PNPM_CMD:-corepack pnpm}"

cd "${COZE_WORKSPACE_PATH}"

kill_port_if_listening() {
  local pids
  pids=$(lsof -ti tcp:"${DEPLOY_RUN_PORT}" -sTCP:LISTEN 2>/dev/null || true)
  if [[ -z "${pids}" ]]; then
    echo "Port ${DEPLOY_RUN_PORT} is free."
    return
  fi

  echo "Port ${DEPLOY_RUN_PORT} in use by PIDs: ${pids} (SIGTERM)"
  echo "${pids}" | xargs kill -TERM 2>/dev/null || true
  sleep 1

  pids=$(lsof -ti tcp:"${DEPLOY_RUN_PORT}" -sTCP:LISTEN 2>/dev/null || true)
  if [[ -n "${pids}" ]]; then
    echo "Port ${DEPLOY_RUN_PORT} still busy, forcing shutdown (SIGKILL): ${pids}"
    echo "${pids}" | xargs kill -KILL 2>/dev/null || true
  fi
}

echo "Clearing port ${DEPLOY_RUN_PORT} before start."
kill_port_if_listening

echo "Starting Next.js dev server on port ${DEPLOY_RUN_PORT}..."
PORT="${DEPLOY_RUN_PORT}" NEXT_DISABLE_TURBOPACK=1 ${PNPM_CMD} next dev -p "${DEPLOY_RUN_PORT}"
