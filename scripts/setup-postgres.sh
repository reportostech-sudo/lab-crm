#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting PostgreSQL Setup for Ubuntu...${NC}"

# Check if script is run as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# 1. Install PostgreSQL
echo -e "${BLUE}📦 Installing PostgreSQL...${NC}"
apt-get update
apt-get install -y postgresql postgresql-contrib

# 2. Start and Enable Service
echo -e "${BLUE}🔄 Starting PostgreSQL service...${NC}"
systemctl start postgresql
systemctl enable postgresql

# 3. Configure Database
echo -e "${GREEN}✅ PostgreSQL installed!${NC}"
echo -e "${BLUE}🔧 Configuring Database User and Name...${NC}"

read -p "Enter Database Name (e.g. lab_db): " DB_NAME
read -p "Enter Database User (e.g. lab_user): " DB_USER
read -s -p "Enter Database Password: " DB_PASS
echo ""

# Create User and Database safely
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" || echo "User might already exist, skipping."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || echo "Database might already exist, skipping."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo -e "${GREEN}✅ Database and User created!${NC}"

# 4. Generate .env connection string
echo -e "${BLUE}📝 Generating connection string...${NC}"

CONNECTION_STRING="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"

echo -e "\n${GREEN}Here is your DATABASE_URL for your .env file:${NC}"
echo -e "${BLUE}DATABASE_URL=\"$CONNECTION_STRING\"${NC}"

# Optional: write to .env if it exists
if [ -f ".env" ]; then
    read -p "Do you want to append this to your .env file? (y/n): " UPDATE_ENV
    if [[ "$UPDATE_ENV" == "y" || "$UPDATE_ENV" == "Y" ]]; then
        # Remove existing DATABASE_URL if present
        sed -i '/DATABASE_URL/d' .env
        echo "DATABASE_URL=\"$CONNECTION_STRING\"" >> .env
        echo -e "${GREEN}✅ .env file updated!${NC}"
    fi
fi

echo -e "${GREEN}🎉 PostgreSQL setup complete!${NC}"
echo -e "You can now run: ${BLUE}npx prisma migrate deploy${NC}"
