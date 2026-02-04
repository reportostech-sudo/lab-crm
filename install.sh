#!/bin/bash

# Lab App - Fresh Ubuntu Installation Script
# Usage: ./install.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Lab App Installation...${NC}"

# Variables
APP_PORT=4000
DOMAIN="demo.sukrahod.com"
NODE_VERSION="20"

# 1. Update System
echo -e "${YELLOW}Step 1: Updating System...${NC}"
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git build-essential nginx postgresql postgresql-contrib

# 1.5 Setup Database (PostgreSQL)
echo -e "${YELLOW}Step 1.5: Configuring Database...${NC}"
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create user 'postgres' with password 'ostech' if not exists (or alter password)
echo -e "${YELLOW}Creating DB User...${NC}"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'ostech';" || true

# Create database 'lab' if not exists
echo -e "${YELLOW}Creating Database...${NC}"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'lab'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE lab;"

# 2. Install Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Step 2: Installing Node.js $NODE_VERSION...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "${GREEN}Node.js is already installed.${NC}"
fi

# 3. Install Global Tools
echo -e "${YELLOW}Step 3: Installing PM2...${NC}"
sudo npm install -g pm2

# 4. Check/Setup .env
echo -e "${YELLOW}Step 4: Checking Configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file missing!${NC}"
    echo -e "Please create a .env file with your database content."
    read -p "Do you want to create one now? (y/n) " create_env
    if [[ $create_env == "y" ]]; then
        nano .env
    else
        echo "Exiting. Please create .env and run again."
        exit 1
    fi
fi

# Ensure AUTH_TRUST_HOST is set for NextAuth behind proxy
if ! grep -q "AUTH_TRUST_HOST" .env; then
    echo "AUTH_TRUST_HOST=true" >> .env
fi

# Ensure AUTH_URL is set (often needed for custom domains)
if ! grep -q "AUTH_URL" .env; then
    echo "AUTH_URL=https://$DOMAIN" >> .env
fi
fi

# 5. Local App Setup
echo -e "${YELLOW}Step 5: Installing Dependencies & Building...${NC}"
npm install
npx prisma generate
npx prisma migrate deploy
npm run build

# 6. PM2 Setup
echo -e "${YELLOW}Step 6: Starting with PM2...${NC}"
pm2 delete labcrm 2>/dev/null || true
pm2 start npm --name "labcrm" -- start -- -p $APP_PORT
pm2 save
pm2 startup | tail -n 1 | sudo bash

# 7. Nginx Setup
echo -e "${YELLOW}Step 7: Configuring Nginx for $DOMAIN...${NC}"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

sudo bash -c "cat > $NGINX_CONF" <<EOL
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Enable Site
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo -e "${GREEN}✅ Installation Complete!${NC}"
echo -e "Your app should be live at: ${YELLOW}http://$DOMAIN${NC}"
echo -e "Note: Ensure your DNS points to this server's IP."
