# HRMS Backend API Contract

Base URL: http://localhost:8082

## 1) Company Registration

### Endpoint
POST /api/auth/register-company

### Request body
```json
{
  "companyName": "PeoplePulse",
  "adminName": "John Doe",
  "email": "admin@peoplepulse.com",
  "phone": "9876543210",
  "password": "Password123",
  "confirmPassword": "Password123",
  "companyLogoUrl": "https://example.com/logo.png"
}
```

### Success response
```json
{
  "success": true,
  "message": "Company Registered Successfully"
}
```

---

## 2) Login

### Endpoint
POST /api/auth/login

### Request body
```json
{
  "email": "admin@peoplepulse.com",
  "password": "Password123"
}
```

### Success response
```json
{
  "userId": 1,
  "companyId": 1,
  "role": "ADMIN",
  "message": "Login Successful"
}
```

> The role value is an enum. Use `ADMIN` or `EMPLOYEE` on the frontend.

---

## 3) Add Employee

### Endpoint
POST /api/employees/{adminId}

### Path parameter
- adminId: number

### Request body
```json
{
  "fullName": "Jane Smith",
  "email": "jane@peoplepulse.com",
  "phone": "9988776655",
  "address": "123 Main Street",
  "department": "Engineering",
  "designation": "Software Engineer",
  "dateOfJoining": "2026-07-04",
  "profilePictureUrl": "https://example.com/jane.png"
}
```

### Success response
```json
{
  "employeeCode": "PPJS20260001",
  "temporaryPassword": "A1b2C3d4E5",
  "message": "Employee Created Successfully"
}
```

---

## Frontend field naming summary

Use these exact names in your frontend forms and models:

### Company registration
- companyName
- adminName
- email
- phone
- password
- confirmPassword
- companyLogoUrl

### Login
- email
- password

### Employee creation
- fullName
- email
- phone
- address
- department
- designation
- dateOfJoining
- profilePictureUrl

### Response fields
- success
- message
- userId
- companyId
- role
- employeeCode
- temporaryPassword

---

## Notes for frontend integration

- The backend is already configured for CORS from http://localhost:4200.
- Send dates as ISO strings such as `2026-07-04`.
- Use camelCase for all request and response property names.
- The backend returns `role` as a string like `ADMIN` or `EMPLOYEE`.
