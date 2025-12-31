#!/bin/bash

# Enhanced Vault - Local Development Startup Script

echo "========================================"
echo "Starting Enhanced Vault Locally"
echo "========================================"

# Check for Maven
if command -v mvn &> /dev/null; then
    echo "Starting Backend..."
    cd backend
    # Verify ENCRYPTION_SECRET is set
    if [ -z "$ENCRYPTION_SECRET" ]; then
        echo "WARNING: ENCRYPTION_SECRET is not set. Using default for dev (if configured) or it might fail."
        export ENCRYPTION_SECRET="dev_secret_key_change_me_in_prod_at_least_32_bytes"
    fi
    mvn spring-boot:run &
    BACKEND_PID=$!
    cd ..
else
    echo "Error: Maven 'mvn' not found. Cannot start backend."
    echo "Please install Maven or ensure it's in your PATH."
fi

# Check for Node/NPM
if command -v npm &> /dev/null; then
    echo "Starting Frontend..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
else
    echo "Error: 'npm' not found. Cannot start frontend."
fi

echo "========================================"
echo "Backend running on PID $BACKEND_PID (if started)"
echo "Frontend running on PID $FRONTEND_PID (if started)"
echo "Press Ctrl+C to stop both."
echo "========================================"

wait
