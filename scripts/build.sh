#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
PNPM_CMD="${PNPM_CMD:-corepack pnpm}"

cd "${COZE_WORKSPACE_PATH}"

echo "Building the Next.js project..."
${PNPM_CMD} next build

echo "Bundling server with tsup..."
${PNPM_CMD} tsup src/server.ts --format cjs --platform node --target node20 --outDir dist --no-splitting --no-minify

echo "Build completed successfully!"
