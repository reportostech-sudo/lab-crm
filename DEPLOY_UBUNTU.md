# Deploying to Ubuntu

This guide explains how to deploy the Lab Application to a fresh Ubuntu VPS (example: DigitalOcean Droplet, AWS EC2).

## Prerequisites
- An Ubuntu Server (20.04 or newer)
- Root access or a user with `sudo` privileges
- Your `.env` file credentials

## Quick Start

1. **Upload your code** to the server (e.g., via `git clone` or `scp`).

2. **Navigate to the project folder**:
   ```bash
   cd lab
   ```

3. **Create your environment file**:
   ```bash
   nano .env
   ```
   Paste your production variables:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/db_name"
   AUTH_SECRET="your_generated_secret_key"
   NEXTAUTH_URL="http://your-server-ip:3000"
   ```

4. **Make the script executable**:
   ```bash
   chmod +x scripts/deploy-ubuntu.sh
   ```

5. **Run the deployment script**:
   ```bash
   ./scripts/deploy-ubuntu.sh
   ```

## What the script does
- Updates system packages (`apt-get update`)
- Installs Docker & Docker Compose if missing
- Checks for your `.env` file
- Builds the Docker image locally
- Starts the application on port `3000`

## Accessing the App
Open your browser and visit: `http://YOUR_SERVER_IP:3000`
