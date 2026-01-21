#!/bin/bash

# Lab App - Ubuntu Deployment Script
# Usage: ./deploy-ubuntu.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Deployment Process...${NC}"

# 1. Update System
echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Docker if not verified
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo -e "${GREEN}Docker installed successfully.${NC}"
else
    echo -e "${GREEN}Docker is already installed.${NC}"
fi

# 3. Check for .env file
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create a .env file with the following variables:"
    echo "DATABASE_URL=..."
    echo "AUTH_SECRET=..."
    exit 1
fi

# 4. Build and Run Container
echo -e "${YELLOW}Building and starting Docker container...${NC}"
sudo docker compose down --remove-orphans || true
sudo docker compose up -d --build

echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "App running on: ${YELLOW}http://$(curl -s ifconfig.me):3000${NC}"
