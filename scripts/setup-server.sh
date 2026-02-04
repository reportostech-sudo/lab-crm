#!/bin/bash
set -e

DOMAIN="demo.sukrahod.com"
PORT=4000

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Server Setup for $DOMAIN...${NC}"

# 1. Install Node.js (v20)
echo -e "${BLUE}📦 Installing Node.js v20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install Git & Nginx
echo -e "${BLUE}📦 Installing Git & Nginx...${NC}"
sudo apt-get install -y git nginx

# 3. Install PM2
echo -e "${BLUE}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# 4. Configure Nginx
echo -e "${BLUE}🔧 Configuring Nginx...${NC}"

NGINX_CONF="/etc/nginx/sites-available/lab"
sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Site
sudo ln -sf /etc/nginx/sites-available/lab /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo -e "${GREEN}✅ Nginx configured for $DOMAIN on port 80!${NC}"

# 5. Firewall
echo -e "${BLUE}🛡️  Configuring Firewall (UFW)...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
# sudo ufw enable # Ask user to enable manually to avoid lockout

echo -e "${GREEN}🎉 Server Prereqs Installed!${NC}"
echo -e "Next steps:"
echo -e "1. Clone your repo: git clone <your-repo-url> lab"
echo -e "2. Setup DB: sudo ./lab/scripts/setup-postgres.sh"
echo -e "3. Setup .env"
echo -e "4. Install & Build: cd lab && npm install && npx prisma migrate deploy && npm run build"
echo -e "5. Start: pm2 start npm --name 'lab' -- run start"
