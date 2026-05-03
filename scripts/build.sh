#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
PNPM_CMD="${PNPM_CMD:-corepack pnpm}"
CLEAN_NEXT_BEFORE_BUILD="${CLEAN_NEXT_BEFORE_BUILD:-0}"

cd "${COZE_WORKSPACE_PATH}"

if [[ "${CLEAN_NEXT_BEFORE_BUILD}" == "1" ]]; then
  echo "Cleaning .next before build..."
  rm -rf .next
fi

run_next_build() {
  ${PNPM_CMD} next build
}

echo "Building the Next.js project..."
if ! run_next_build; then
  echo "Initial next build failed. Cleaning .next and retrying once..."
  rm -rf .next
  run_next_build
fi

echo "Bundling server with tsup..."
${PNPM_CMD} tsup src/server.ts --format cjs --platform node --target node20 --outDir dist --no-splitting --no-minify

echo "Build completed successfully!"
