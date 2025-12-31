#!/bin/bash

# Enhanced Vault - Local Development Startup Script

echo "========================================"
echo "Starting Enhanced Vault Locally"
echo "========================================"

# Check for Maven
MVN_CMD=""

if command -v mvn &> /dev/null; then
    MVN_CMD="mvn"
elif [ -f "./backend/mvn" ]; then
    echo "Using local Maven wrapper from backend/mvn"
    MVN_CMD="./mvn"
fi

if [ -n "$MVN_CMD" ]; then
    echo "Starting Backend..."
    cd backend
    # Verify ENCRYPTION_SECRET is set
    if [ -z "$ENCRYPTION_SECRET" ]; then
        echo "WARNING: ENCRYPTION_SECRET is not set. Using default for dev (if configured) or it might fail."
        export ENCRYPTION_SECRET="MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE="
    fi
    $MVN_CMD spring-boot:run &
    BACKEND_PID=$!
    cd ..
else
    echo "Error: Maven 'mvn' not found and local wrapper not usable. Cannot start backend."
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
