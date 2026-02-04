#!/bin/bash
# scripts/fix-env.sh

echo "🔧 Fixing Environment Configuration..."

ENV_FILE=".env"

# 1. Add AUTH_TRUST_HOST if missing
if grep -q "AUTH_TRUST_HOST" "$ENV_FILE"; then
    echo "✅ AUTH_TRUST_HOST already set."
else
    echo "AUTH_TRUST_HOST=true" >> "$ENV_FILE"
    echo "➕ Added AUTH_TRUST_HOST=true to .env"
fi

# 2. Restart to apply changes
pm2 restart lab

echo "✅ Environment patched and server restarted."
