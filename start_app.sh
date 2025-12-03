#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "========================================"
echo "   Test Team Dashboard - Auto Start"
echo "========================================"

# 1. Check Prerequisites
if ! command_exists java; then
    echo "Error: Java is not installed."
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is not installed."
    exit 1
fi

# 2. Setup MongoDB URI
if [ -z "$MONGODB_URI" ]; then
    echo "Warning: MONGODB_URI is not set."
    read -p "Enter your MongoDB URI (or press Enter to use default 'mongodb://localhost:27017/testmanagement'): " USER_URI
    if [ -z "$USER_URI" ]; then
        export MONGODB_URI="mongodb://localhost:27017/testmanagement"
    else
        export MONGODB_URI="$USER_URI"
    fi
fi
echo "Using MongoDB URI: $MONGODB_URI"

# 3. Start Backend
echo "Starting Backend..."
cd backend
if [ -f "./mvnw" ]; then
    chmod +x mvnw
    ./mvnw spring-boot:run &
    BACKEND_PID=$!
elif command_exists mvn; then
    mvn spring-boot:run &
    BACKEND_PID=$!
elif [ -f "../maven-mvnd-1.0.2-windows-amd64/maven-mvnd-1.0.2-windows-amd64/mvn/bin/mvn" ]; then
    echo "Using bundled Maven..."
    chmod +x ../maven-mvnd-1.0.2-windows-amd64/maven-mvnd-1.0.2-windows-amd64/mvn/bin/mvn
    ../maven-mvnd-1.0.2-windows-amd64/maven-mvnd-1.0.2-windows-amd64/mvn/bin/mvn spring-boot:run &
    BACKEND_PID=$!
else
    echo "Error: Maven (mvn) or Maven Wrapper (mvnw) not found."
    exit 1
fi
cd ..

echo "Backend started with PID $BACKEND_PID. Waiting for it to initialize..."
sleep 10

# 4. Start Frontend
echo "Starting Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "========================================"
echo "   Application Started!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo "========================================"
echo "Press Ctrl+C to stop everything."

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

wait
