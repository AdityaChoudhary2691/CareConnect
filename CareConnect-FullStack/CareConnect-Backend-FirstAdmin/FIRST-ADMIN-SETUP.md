# First Admin Setup

This backend no longer creates predefined demo users or sample records.

1. Start PostgreSQL and the Spring Boot backend.
2. Create the first admin by POSTing JSON to `/api/auth/setup-admin`.
3. After one admin exists, `/api/auth/setup-admin` returns 409 and cannot create another first admin.
4. `/api/auth/register` always creates a patient.

Example request:
```json
{
  "name": "CareConnect Admin",
  "email": "admin@example.com",
  "username": "admin",
  "password": "your-password",
  "phone": "9876543210"
}
```

The frontend should call `http://localhost:8082/api/auth/setup-admin` if the backend runs on port 8082.
