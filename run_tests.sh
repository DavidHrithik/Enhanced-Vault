#!/bin/bash

# TestTeamDashboard Test Script

echo "========================================"
echo "Testing Backend (Spring Boot)"
echo "========================================"

if [ -f "./mvnw" ]; then
    cd backend
    chmod +x mvnw
    ./mvnw test
    BACKEND_EXIT_CODE=$?
    cd ..
elif [ -f "/Users/hrithik/Downloads/maven-mvnd-1.0.3-darwin-aarch64/bin/mvnd" ]; then
    echo "Using mvnd from Downloads..."
    cd backend
    # Limit memory to 512MB and use single thread to prevent OOM kill
    export MAVEN_OPTS="-Xmx512m"
    /Users/hrithik/Downloads/maven-mvnd-1.0.3-darwin-aarch64/bin/mvnd test -T 1
    BACKEND_EXIT_CODE=$?
    cd ..
elif command -v mvn &> /dev/null; then
    cd backend
    mvn test
    BACKEND_EXIT_CODE=$?
    cd ..
else
    echo "Error: 'mvn' is not installed. Please install Maven to run backend tests."
    echo "Download: https://maven.apache.org/download.cgi"
    BACKEND_EXIT_CODE=1
fi

echo ""
echo "========================================"
echo "Testing Frontend (React)"
echo "========================================"

if command -v npm &> /dev/null; then
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    # Run tests, pass if no tests are found (since we know there are none yet)
    CI=true npm test -- --passWithNoTests
    FRONTEND_EXIT_CODE=$?
    cd ..
else
    echo "Error: 'npm' is not installed. Please install Node.js."
    FRONTEND_EXIT_CODE=1
fi

echo ""
echo "========================================"
echo "Test Summary"
echo "========================================"

if [ $BACKEND_EXIT_CODE -eq 0 ]; then
    echo "Backend Tests: PASSED"
else
    echo "Backend Tests: FAILED (or skipped)"
fi

if [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo "Frontend Tests: PASSED"
else
    echo "Frontend Tests: FAILED (or skipped)"
fi

# Exit with failure if either failed
if [ $BACKEND_EXIT_CODE -ne 0 ] || [ $FRONTEND_EXIT_CODE -ne 0 ]; then
    exit 1
fi

exit 0
