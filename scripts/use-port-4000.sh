#!/bin/bash
# scripts/use-port-4000.sh
set -e

echo "🔧 Switching Application BACK to Port 4000..."

# 1. Update package.json (Revert 3001 -> 4000)
if [ -f "package.json" ]; then
    # Replace distinct port flag
    sed -i "s/-p 3001/-p 4000/g" package.json
    echo "✅ Updated package.json"
else
    echo "❌ package.json not found!"
    exit 1
fi

# 2. Update Nginx Config
NGINX_CONF="/etc/nginx/sites-available/lab"
if [ -f "$NGINX_CONF" ]; then
    echo "Updating Nginx..."
    sudo sed -i "s/localhost:3001/localhost:4000/g" "$NGINX_CONF"
    
    if sudo nginx -t; then
        sudo systemctl reload nginx
        echo "✅ Nginx updated and reloaded."
    else
        echo "❌ Nginx config failed. Keeping old config."
        exit 1
    fi
else
    echo "⚠️ Nginx config not found."
fi

# 3. Kill anything on 4000 (Just in case)
sudo fuser -k 4000/tcp || true

# 4. Restart PM2
echo "🔄 Restarting on Port 4000..."
pm2 delete all || true
pm2 start npm --name "lab" -- run start
pm2 save

echo "========================================"
echo "🎉 SUCCESS! App is back on Port 4000"
echo "========================================"
