# CareConnect Full Stack

Angular 20 frontend + Spring Boot 3.5 backend + PostgreSQL.

## Architecture

Browser (Angular :4200) -> REST API (Spring Boot :8080) -> PostgreSQL (5432)

The application data is persisted in PostgreSQL. LocalStorage is used only for the browser login session.

## 1. PostgreSQL

### Option A: Docker

From the project root:

```bash
docker compose up -d postgres
```

### Option B: Local PostgreSQL

Create the database:

```sql
CREATE DATABASE careconnect;
```

Then edit `backend/careconnect-backend/src/main/resources/application.properties` with your PostgreSQL username/password.

## 2. Spring Boot

Requirements: Java 17+ and Maven 3.9+.

```bash
cd backend/careconnect-backend
mvn spring-boot:run
```

API: http://localhost:8080

The backend creates the database tables automatically and seeds the user accounts on an empty database.

## 3. Angular

Requirements: Node.js 20+.

```bash
cd frontend/careconnect
npm install
npm start
```

Frontend: http://localhost:4200

## Demo accounts

Patient: patient@careconnect.com / patient123
Doctor: doctor@careconnect.com / doctor123
Admin: admin@careconnect.com / admin123

## Connection

Angular calls `http://localhost:8080/api` from `StorageService` and `AuthService`.
Spring Boot CORS allows `http://localhost:4200`.
PostgreSQL is the persistent data store.

If login says the backend is unavailable, start Spring Boot first and confirm http://localhost:8080/api/users responds.
