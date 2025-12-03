#!/bin/bash

# Check for MONGODB_URI
if [ -z "$MONGODB_URI" ]; then
    echo "Warning: MONGODB_URI is not set. Using default."
    export MONGODB_URI="mongodb+srv://Admin:Admin@cluster0.svux9y9.mongodb.net/testmanagement?appName=Cluster0"
fi

# Check for Maven
if [ -f "./mvnw" ]; then
    chmod +x mvnw
    ./mvnw spring-boot:run
elif command_exists mvn; then
    mvn spring-boot:run
elif [ -f "../maven-mvnd-1.0.2-windows-amd64/maven-mvnd-1.0.2-windows-amd64/mvn/bin/mvn" ]; then
    echo "Using bundled Maven..."
    chmod +x ../maven-mvnd-1.0.2-windows-amd64/maven-mvnd-1.0.2-windows-amd64/mvn/bin/mvn
    ../maven-mvnd-1.0.2-windows-amd64/maven-mvnd-1.0.2-windows-amd64/mvn/bin/mvn spring-boot:run
else
    echo "Error: Maven not found. Please install Maven or use the start_app.sh script."
    exit 1
fi
