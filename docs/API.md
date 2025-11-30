# API Documentation

## Base URL
```
http://localhost:3001
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All responses follow a consistent format:

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "timestamp": "2025-11-30T10:30:00Z"
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* optional details */ },
  "timestamp": "2025-11-30T10:30:00Z"
}
```

## Error Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "role": "PATIENT"
}
```

**Response (201)**
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PATIENT"
  },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_refresh_token"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

### Patients

#### List Patients
```
GET /api/patients?page=1&limit=10

Headers:
Authorization: Bearer <access_token>
```

**Query Parameters**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)

#### Get Patient
```
GET /api/patients/:id

Headers:
Authorization: Bearer <access_token>
```

#### Create Patient
```
POST /api/patients
Content-Type: application/json

Headers:
Authorization: Bearer <access_token>

{
  "dateOfBirth": "1990-05-15",
  "gender": "MALE",
  "bloodGroup": "O+",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "phone": "+1234567890",
  "emergencyContact": "Jane Doe",
  "allergies": "Penicillin",
  "chronicDiseases": "Diabetes",
  "notes": "Additional notes"
}
```

#### Update Patient
```
PUT /api/patients/:id
Content-Type: application/json

Headers:
Authorization: Bearer <access_token>

{
  /* partial patient data */
}
```

#### Delete Patient
```
DELETE /api/patients/:id

Headers:
Authorization: Bearer <access_token>
```

### Appointments

#### List Appointments
```
GET /api/appointments?page=1&limit=10&status=CONFIRMED

Headers:
Authorization: Bearer <access_token>
```

**Query Parameters**
- `page` (number)
- `limit` (number)
- `status` (PENDING, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED)

#### Get Appointment
```
GET /api/appointments/:id

Headers:
Authorization: Bearer <access_token>
```

#### Create Appointment
```
POST /api/appointments
Content-Type: application/json

Headers:
Authorization: Bearer <access_token>

{
  "patientId": "uuid",
  "doctorId": "uuid",
  "appointmentDate": "2025-12-15",
  "appointmentTime": "14:30",
  "notes": "Follow-up consultation"
}
```

#### Update Appointment
```
PUT /api/appointments/:id
Content-Type: application/json

Headers:
Authorization: Bearer <access_token>

{
  "status": "CONFIRMED",
  "notes": "Updated notes"
}
```

#### Cancel Appointment
```
DELETE /api/appointments/:id

Headers:
Authorization: Bearer <access_token>
```

### Consultations

#### List Consultations
```
GET /api/consultations?page=1&limit=10&patientId=uuid&status=COMPLETED

Headers:
Authorization: Bearer <access_token>
```

#### Get Consultation
```
GET /api/consultations/:id

Headers:
Authorization: Bearer <access_token>
```

#### Create Consultation
```
POST /api/consultations
Content-Type: application/json

Headers:
Authorization: Bearer <access_token>

{
  "patientId": "uuid",
  "doctorId": "uuid",
  "complaints": "Detailed description of complaints",
  "diagnosis": "Diagnosis details",
  "prescription": "Prescription details",
  "notes": "Additional notes"
}
```

#### Update Consultation
```
PUT /api/consultations/:id
Content-Type: application/json

Headers:
Authorization: Bearer <access_token>

{
  "diagnosis": "Updated diagnosis",
  "notes": "Updated notes",
  "status": "COMPLETED"
}
```

## Rate Limiting
To be implemented: 100 requests per 15 minutes per IP

## Pagination
List endpoints support cursor-based pagination:
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## Validation Errors
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "path": "email",
      "message": "Invalid email address"
    }
  ]
}
```
