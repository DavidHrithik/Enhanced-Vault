#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Monolithic Build..."

# 1. Build Frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Copy Frontend Build to Backend Static Resources
echo "COPYING Frontend assets to Backend..."
rm -rf backend/src/main/resources/static/*
cp -r frontend/build/* backend/src/main/resources/static/

# 3. Build Backend
echo "☕ Building Backend..."
cd backend
./mvnw clean package -DskipTests

echo "✅ Build Complete!"
echo "👉 You can run the application using: java -jar backend/target/backend-0.0.1-SNAPSHOT.jar"
