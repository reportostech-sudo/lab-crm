#!/bin/bash
# scripts/fix-server.sh

# Stop on error
set -e

echo "=========================================="
echo "🔧 STARTING AUTOMATED SERVER FIX"
echo "=========================================="

echo "1. 📥 Pulling latest code..."
git pull

echo "2. 📦 Installing dependencies..."
npm install

echo "3. 🔄 Generating Prisma Client..."
npx prisma generate

echo "4. 🗄️  Applying Database Migrations..."
npx prisma migrate deploy

echo "5. 🏗️  Building Application (This may take a minute)..."
npm run build

echo "6. 🚀 Restarting Application..."
pm2 restart lab || pm2 start npm --name "lab" -- run start
pm2 save

echo "7. 🧪 Running Database Diagnostic..."
node scripts/debug-db.js

echo "=========================================="
echo "✅ SUCCESS! Your server is updated."
echo "   Please clear your browser cache and refresh."
echo "=========================================="
