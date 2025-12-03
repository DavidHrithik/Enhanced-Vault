# Test Management Tool

A full-stack web application for managing devices, test cases, and test results, featuring a modern UI, robust backend, and extensible architecture.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Setup & Installation](#setup--installation)
6. [Running the Application](#running-the-application)
7. [API Endpoints](#api-endpoints)
8. [Database](#database)
9. [Environment Variables](#environment-variables)
10. [Contributing](#contributing)
11. [License](#license)

---

## Project Overview

The Test Management Tool is designed to help teams efficiently manage devices, test cases, and test execution. It provides centralized control, real-time tracking, and a user-friendly interface for QA, hardware, and software validation teams.

---

## Features

- **Device Management**: Register, view, and manage all devices in your organization.
- **Test Case Management**: Create, edit, and organize test cases and their steps.
- **Test Execution Tracking**: Assign tests to devices, track execution status, and record expected vs. actual results.
- **Excel Export**: Download device and test data as Excel files for reporting.
- **Modern UI/UX**: Responsive React frontend with clear navigation and feedback.
- **API Documentation**: Interactive Swagger UI for backend API exploration.
- **Extensible & Scalable**: Built with React and Java Spring Boot for easy feature additions and scaling.

---

## Architecture

- **Frontend**: React (JavaScript)
  Located in `/frontend`, provides the user interface and communicates with the backend via REST APIs.
- **Backend**: Java Spring Boot
  Located in `/backend`, handles business logic, data persistence, and API endpoints.
- **Database**: MongoDB
  Configured in `backend/src/main/resources/application.properties`.

---

## Prerequisites

- **Java 17+** (Required for Backend)
  - [Download JDK 17](https://www.oracle.com/java/technologies/downloads/#java17)
  - Verify: `java -version`
- **Node.js** (Required for Frontend)
  - [Download Node.js](https://nodejs.org/en/download/) (v16+ recommended)
  - Verify: `node -v`
- **MongoDB** (Required for Database)
  - [Download MongoDB Community](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas/database)
  - Verify: `mongod --version` (if installed locally)
- **Maven** (Required for Backend Build)
  - **Option 1 (Homebrew - Recommended)**:
    ```bash
    brew install maven
    ```
  - **Option 2 (Manual)**:
    1. [Download Apache Maven](https://maven.apache.org/download.cgi) (Binary zip archive).
    2. Extract it to a folder (e.g., `/usr/local/apache-maven`).
    3. Add the `bin` directory to your PATH in `~/.zshrc`:
       ```bash
       export PATH=/path/to/apache-maven/bin:$PATH
       ```
    4. Restart terminal.
  - Verify: `mvn -version`

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd TestTeamDashboard
```

### 2. Configure Environment Variables

- Copy `.env.example` to `.env` in the project root.
- Fill in your real values for both frontend and backend as required.
- **Backend**: Set the `MONGODB_URI` environment variable or create a `application-local.properties` file (gitignored) in `backend/src/main/resources/` with your connection string.

---

## Running the Application

### 1. Backend Setup (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```
- The backend will start on `http://localhost:8080` by default.

### 2. Frontend Setup (React)

```bash
cd ../frontend
npm install
npm start
```
- The frontend will start on `http://localhost:3000` by default.

---

## API Endpoints

- `GET /`: Welcome message
- `POST /test-cases/`: Create a new test case
- `GET /test-cases/`: List all test cases
- Additional endpoints for device and test management are available and documented in Swagger UI.

### API Documentation

- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## Database

- **MongoDB**: The application uses MongoDB for data persistence.
- Configuration: `backend/src/main/resources/application.properties`.

---

## Environment Variables

- All necessary variables are documented in `.env.example`.
- Do NOT commit your real `.env` file with secrets.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

---

## License

This project is licensed under the MIT License.
