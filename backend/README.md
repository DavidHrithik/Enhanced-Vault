# Test Management Tool Backend (Spring Boot)

This is the backend for the Test Management Tool. It uses Spring Boot, MongoDB, and supports file upload.

## Setup
1. Ensure you have Java 17+ and Maven installed.
2. Update `src/main/resources/application.properties` with your MongoDB URI.
3. Run with: `mvn spring-boot:run`

## Features
- REST API for Test Accounts and Test Datasets
- File upload to `/uploads/`
- CORS enabled for localhost:3000
- UUID as IDs

## Structure
- model/
- repository/
- service/
- controller/
