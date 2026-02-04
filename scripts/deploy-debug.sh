#!/bin/bash
# scripts/deploy-debug.sh
set -e

echo "🧹 FLASHING SERVER CACHE..."
rm -rf .next
rm -rf node_modules/.cache

echo "📥 PULLING LATEST CODE..."
git reset --hard origin/main
git pull

echo "🏗️ BUILDING PROJECT (This may take a minute)..."
npm run build

echo "🔄 RESTARTING SERVER..."
pm2 restart lab

echo "✅ DEPLOY COMPLETE. Debug logs are now active."
echo "👉 Now try to login again."
