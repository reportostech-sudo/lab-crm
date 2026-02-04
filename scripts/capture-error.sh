#!/bin/bash
# scripts/capture-error.sh

echo "🔍 CAPTURING ERROR LOGS..."
echo "------------------------------"

# 1. Clear previous logs to reduce noise
pm2 flush lab > /dev/null

# 2. Make the request in background (give it a second to trigger log)
(sleep 1; curl -I http://localhost:4000/login) &

# 3. Watch logs for 5 seconds
timeout 5s pm2 logs lab --raw

echo "------------------------------"
echo "✅ Capture complete."
