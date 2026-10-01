# CareConnect Full Stack

A complete college-project EHR application:

- `frontend/careconnect` — Angular 20 + TypeScript + Tailwind CSS
- `backend/careconnect-backend` — Spring Boot 3.5 + Spring Data JPA + REST
- PostgreSQL — persistent application data
- `docker-compose.yml` — optional PostgreSQL container

## Run order

### 1. Start PostgreSQL

Using Docker:

```bash
docker compose up -d postgres
```

Or create a local PostgreSQL database named `careconnect` and update the credentials in `backend/careconnect-backend/src/main/resources/application.properties`.

### 2. Start backend

Requirements: Java 17+ and Maven 3.9+.

```bash
cd backend/careconnect-backend
mvn spring-boot:run
```

Backend: `http://localhost:8080`

### 3. Start frontend

Requirements: Node.js 20+.

```bash
cd frontend/careconnect
npm install
npm start
```

Frontend: `http://localhost:4200`

## Demo accounts

- Patient: `patient@careconnect.com` / `patient123`
- Doctor: `doctor@careconnect.com` / `doctor123`
- Admin: `admin@careconnect.com` / `admin123`

## How the connection works

Angular sends REST requests to `http://localhost:8080/api`.
Spring Boot accepts those requests and uses JPA repositories to persist data in PostgreSQL.
CORS is configured for Angular on port 4200.
LocalStorage is used only for the browser session; application records are stored in PostgreSQL.

## Main API groups

- `/api/auth`
- `/api/users`
- `/api/appointments`
- `/api/medical-records`
- `/api/prescriptions`
- `/api/test-orders`
- `/api/test-results`

## Notes

This is a college/demo EHR application. Authentication is intentionally simple and is not production-grade security. For a production deployment, passwords should be hashed and Spring Security/JWT or an identity provider should be added.
