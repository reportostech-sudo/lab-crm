#!/bin/bash
# scripts/force-cleanup.sh
set -e

echo "🧹 STARTING AGGRESSIVE CLEANUP for Port 4000..."

# 1. Stop all PM2 instances (prevent auto-restart loop)
echo "🛑 Stopping PM2..."
if command -v pm2 &> /dev/null; then
    pm2 delete all || true
    pm2 kill || true
fi

# 2. Kill all Node.js processes
echo "🔪 Killing all Node processes..."
sudo killall -9 node || true
sudo killall -9 npm || true

# 3. Kill anything on Port 4000 specifically
echo "🎯 Targeting Port 4000..."
# Method A: fuser
sudo fuser -k 4000/tcp || true
# Method B: lsof
if command -v lsof &> /dev/null; then
    sudo lsof -t -i:4000 | xargs -r sudo kill -9 || true
fi
# Method C: netstat/ss logic (optional, usually fuser/lsof is enough)

echo "⏳ Waiting 5 seconds for ports to release..."
sleep 5

# 4. Verify Port is Free
echo "🕵️ Verifying Port 4000 is free..."
if command -v lsof &> /dev/null; then
    if sudo lsof -i :4000; then
        echo "❌ ERROR: Port 4000 is STILL in use. Manual intervention required."
        exit 1
    fi
fi

# 5. Restart
echo "🚀 Starting Fresh..."
pm2 start npm --name "lab" -- run start
pm2 save

echo "✅ DONE. App should be running on Port 4000."
