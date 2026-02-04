#!/bin/bash

echo "🚀 Starting Deployment..."

# 1. Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Database Migration
echo "Running database migrations..."
npx prisma migrate deploy
npx prisma generate

# 4. Build
echo "🏗️  Building application..."
npm run build

# 5. Restart PM2 (Try standard names or all)
echo "🔄 Restarting application..."
pm2 restart all --update-env

echo "✅ Deployment Success!"
