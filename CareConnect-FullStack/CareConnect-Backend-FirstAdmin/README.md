# CareConnect Spring Boot Backend

## Stack
- Java 17
- Spring Boot 3.5.6
- Spring Web
- Spring Data JPA
- PostgreSQL

## Database
Create:
```sql
CREATE DATABASE careconnect;
```
Then edit `src/main/resources/application.properties` with your PostgreSQL username/password.

## Run
```bash
mvn spring-boot:run
```
Backend: http://localhost:8080

The seed creates:
- patient@careconnect.com / patient123
- doctor@careconnect.com / doctor123
- admin@careconnect.com / admin123

## Main endpoints
POST /api/auth/login
POST /api/auth/register
GET/PUT /api/users
GET/POST/PUT/DELETE /api/appointments
GET/POST /api/medical-records
GET/POST /api/prescriptions
GET/POST/PUT /api/test-orders
GET/POST /api/test-results

CORS is enabled for Angular at http://localhost:4200.

## Important
This starter uses plain-text passwords because the supplied Angular demo already uses plain-text demo credentials. For a real deployment, replace this with BCrypt and JWT/session authentication.
