#!/bin/bash
# scripts/switch-port.sh
set -e
NEW_PORT=3001

echo "🔧 Switching Application to Port $NEW_PORT..."

# 1. Update package.json (Change 4000 -> 3001)
# We use a safer sed pattern to only catch the port argument
if [ -f "package.json" ]; then
    sed -i "s/-p 4000/-p $NEW_PORT/g" package.json
    echo "✅ Updated package.json"
else
    echo "❌ package.json not found!"
    exit 1
fi

# 2. Update Nginx Config
NGINX_CONF="/etc/nginx/sites-available/lab"
if [ -f "$NGINX_CONF" ]; then
    echo "Runnning sudo commands to update Nginx..."
    sudo sed -i "s/localhost:4000/localhost:$NEW_PORT/g" "$NGINX_CONF"
    
    # Test and Reload
    if sudo nginx -t; then
        sudo systemctl reload nginx
        echo "✅ Nginx updated and reloaded."
    else
        echo "❌ Nginx configuration test failed! Reverting..."
        sudo sed -i "s/localhost:$NEW_PORT/localhost:4000/g" "$NGINX_CONF"
        exit 1
    fi
else
    echo "⚠️  Nginx config not found at $NGINX_CONF. You may need to update your proxy manually."
fi

# 3. Restart PM2 clean
echo "🔄 Restarting Application on new port..."
pm2 delete all || true
pm2 start npm --name "lab" -- run start
pm2 save

echo "========================================"
echo "🎉 SUCCESS! App is now running on Port $NEW_PORT"
echo "========================================"
