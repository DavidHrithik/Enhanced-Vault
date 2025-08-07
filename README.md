<<<<<<< HEAD
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
- **Database**:  
  Default is SQLite (can be configured for other databases).

---

## Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)
- Java 17+
- Maven

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd windsurf-project-enhanced
```

### 2. Configure Environment Variables

- Copy `.env.example` to `.env` in the project root.
- Fill in your real values for both frontend and backend as required.

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

- Default: SQLite  
- To use another database, modify the relevant configuration in your backend (e.g., `application.properties` for Spring Boot).
- Database models are defined in the backend source code.

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

---

## Features

- Download all accounts as an Excel file from the T.A.D.A. (Accounts) page using the "Download Excel" button.
- Modern UI/UX with Marvel-style acronyms (T.A.D.A. and D.A.S.H.) and animated landing page.
- Create and manage test cases
- Define test steps for each test case
- Track test execution status
- Store expected and actual results
- API documentation with Swagger UI

---

## About

**Google Drive Dataset Viewer & Test Management Tool** is a full-stack application for managing test accounts, datasets, and test results with modern UI, Google Drive integration, and Excel export capabilities.

---

```bash
uvicorn main:app --reload
```

3. Access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

- `GET /`: Welcome message
- `POST /test-cases/`: Create a new test case
- `GET /test-cases/`: List all test cases

## Database

The application uses SQLite by default, but can be configured to use other databases by modifying the `SQLALCHEMY_DATABASE_URL` in `database.py`.
=======
# Test-dashboard
>>>>>>> 2f22943617967741a357f22fa55a882ced60ed11
