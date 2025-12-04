# Deployment Guide

This application is deployed using **Render** for the backend and **Vercel** for the frontend.

## Backend (Render)

The backend is a Spring Boot application containerized with Docker. It is deployed on [Render](https://render.com).

### Configuration
The deployment is defined in `render.yaml`:
- **Service Name**: `test-management-backend`
- **Type**: Web Service
- **Runtime**: Docker
- **Context**: `./backend`
- **Environment Variables**:
    - `MONGODB_URI`: Connection string for MongoDB.
    - `JWT_SECRET`: Secret key for JWT authentication.
    - `CORS_ALLOWED_ORIGINS`: Allowed frontend origins.
    - `PORT`: `8080`

### Deployment
Render automatically deploys the backend when changes are pushed to the `main` branch, based on the `render.yaml` blueprint.

## Frontend (Vercel)

The frontend is a React application deployed on [Vercel](https://vercel.com).

### Configuration
The deployment is defined in `vercel.json`:
- **Source**: `frontend/package.json`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Routes**: Rewrites all requests to `/frontend/index.html` to support client-side routing.

### Deployment
Vercel automatically deploys the frontend when changes are pushed to the `main` branch. Ensure your Vercel project is connected to this repository.
