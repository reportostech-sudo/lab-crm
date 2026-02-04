#!/bin/bash
echo "🔍 STARTING DIAGNOSTICS..."
echo "--------------------------------"

echo "1. 🕒 System Info"
uptime
node -v

echo "--------------------------------"
echo "2. 🚀 PM2 Status"
if command -v pm2 &> /dev/null; then
    pm2 status
else
    echo "⚠️ PM2 not found!"
fi

echo "--------------------------------"
echo "3. 🌐 Port 4000 usage"
if command -v lsof &> /dev/null; then
    sudo lsof -i :4000
    if [ $? -ne 0 ]; then echo "✅ Port 4000 is free (or hidden)"; else echo "❌ Port 4000 is BUSY"; fi
else
    echo "lsof not found, skipping"
fi

echo "--------------------------------"
echo "4. 📜 Recent Error Logs (Last 20 lines) 📜"
pm2 logs lab --err --lines 20 --nostream

echo "--------------------------------"
echo "5. 📜 Recent Output Logs (Last 20 lines) 📜"
pm2 logs lab --out --lines 20 --nostream

echo "--------------------------------"
echo "END OF REPORT"
