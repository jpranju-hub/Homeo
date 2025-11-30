# Database Schema

## Overview
The Homeo application uses PostgreSQL with Prisma ORM for data management. This document describes all tables and their relationships.

## Database Diagram

```
User (1) ──── (1) Patient
User (1) ──── (1) Doctor
User (1) ──── (N) Appointment (as Doctor)
User (1) ──── (N) Consultation (as Doctor)
User (1) ──── (N) Prescription (as Doctor)

Patient (1) ──── (N) Appointment
Patient (1) ──── (N) Consultation
Patient (1) ──── (N) MedicalRecord
Patient (1) ──── (N) Prescription
Patient (1) ──── (N) Invoice

Doctor (1) ──── (N) DoctorAvailability

Appointment (0,1) ──── (1) Consultation (optional)

Consultation (1) ──── (N) Prescription

Prescription (1) ──── (N) PrescriptionItem
```

## Tables

### User
Stores user account information across all roles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique user identifier |
| email | String | UNIQUE, NOT NULL | User email address |
| password | String | NOT NULL | Hashed password |
| firstName | String | NOT NULL | First name |
| lastName | String | NOT NULL | Last name |
| phone | String | NULLABLE | Phone number |
| avatar | String (URL) | NULLABLE | Avatar image URL |
| role | UserRole | NOT NULL | ADMIN, DOCTOR, PATIENT, RECEPTIONIST |
| status | UserStatus | DEFAULT ACTIVE | ACTIVE, INACTIVE, SUSPENDED |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

### Patient
Extended profile for patient users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique patient identifier |
| userId | String | UNIQUE, FK → User | Reference to user account |
| dateOfBirth | DateTime | NOT NULL | Patient's birth date |
| gender | Gender | NOT NULL | MALE, FEMALE, OTHER |
| bloodGroup | BloodGroup | NULLABLE | O+, O-, A+, A-, B+, B-, AB+, AB- |
| address | String | NOT NULL | Street address |
| city | String | NOT NULL | City |
| state | String | NOT NULL | State/Province |
| postalCode | String | NOT NULL | Postal code |
| country | String | NOT NULL | Country |
| phone | String | NOT NULL | Contact phone |
| emergencyContact | String | NULLABLE | Emergency contact name |
| allergies | String | NULLABLE | Known allergies |
| chronicDiseases | String | NULLABLE | Chronic diseases |
| notes | String | NULLABLE | Additional notes |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

### Doctor
Extended profile for doctor users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique doctor identifier |
| userId | String | UNIQUE, FK → User | Reference to user account |
| specialization | String | NOT NULL | Area of specialization |
| licenseNumber | String | UNIQUE, NOT NULL | Medical license number |
| yearsExperience | Int | NOT NULL | Years of experience |
| qualifications | String | NOT NULL | Educational qualifications |
| clinicAddress | String | NULLABLE | Clinic address |
| consultationFee | Float | DEFAULT 0 | Consultation fee |
| bio | String | NULLABLE | Professional biography |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

### DoctorAvailability
Doctor's weekly availability schedule.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique identifier |
| doctorId | String | FK → Doctor, NOT NULL | Reference to doctor |
| dayOfWeek | Int | NOT NULL | 0=Sunday, 6=Saturday |
| startTime | String | NOT NULL | HH:mm format |
| endTime | String | NOT NULL | HH:mm format |
| isAvailable | Boolean | DEFAULT true | Availability status |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Unique Constraint**: (doctorId, dayOfWeek)

### Appointment
Scheduled appointments between patients and doctors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique appointment ID |
| patientId | String | FK → Patient, NOT NULL | Patient reference |
| doctorId | String | FK → User, NOT NULL | Doctor reference |
| appointmentDate | DateTime | NOT NULL | Date of appointment |
| appointmentTime | String | NOT NULL | HH:mm format |
| status | AppointmentStatus | DEFAULT PENDING | Appointment status |
| notes | String | NULLABLE | Appointment notes |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Indexes**: appointmentDate

### Consultation
Medical consultation records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique consultation ID |
| appointmentId | String | UNIQUE, FK → Appointment | Linked appointment (optional) |
| patientId | String | FK → Patient, NOT NULL | Patient reference |
| doctorId | String | FK → User, NOT NULL | Doctor reference |
| scheduledAt | DateTime | NOT NULL | Consultation date/time |
| duration | Int | NOT NULL | Duration in minutes |
| status | ConsultationStatus | DEFAULT SCHEDULED | Consultation status |
| complaints | String | NOT NULL | Patient complaints |
| diagnosis | String | NULLABLE | Doctor's diagnosis |
| prescription | String | NULLABLE | Prescribed treatment |
| notes | String | NULLABLE | Additional notes |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Indexes**: patientId, doctorId, status

### Prescription
Prescription records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique prescription ID |
| consultationId | String | FK → Consultation | Linked consultation (optional) |
| patientId | String | FK → Patient, NOT NULL | Patient reference |
| doctorId | String | FK → User, NOT NULL | Doctor reference |
| notes | String | NULLABLE | Special instructions |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Indexes**: patientId, doctorId, consultationId

### PrescriptionItem
Individual medicine entries in a prescription.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique item ID |
| prescriptionId | String | FK → Prescription, NOT NULL | Prescription reference |
| medicineName | String | NOT NULL | Medicine name |
| potency | String | NOT NULL | e.g., "30C", "200C" |
| dosage | String | NOT NULL | e.g., "5 drops", "1 tablet" |
| frequency | String | NOT NULL | e.g., "3 times daily" |
| duration | String | NOT NULL | e.g., "10 days" |
| notes | String | NULLABLE | Special instructions |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Indexes**: prescriptionId

### MedicalRecord
Medical documents and file references.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique record ID |
| patientId | String | FK → Patient, NOT NULL | Patient reference |
| title | String | NOT NULL | Record title |
| description | String | NULLABLE | Description |
| fileUrl | String | NOT NULL | File URL/path |
| recordType | String | NOT NULL | lab_report, x_ray, prescription, etc. |
| recordedAt | DateTime | NOT NULL | When record was created |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Indexes**: patientId, recordType

### Invoice
Billing and payment records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique invoice ID |
| patientId | String | FK → Patient, NOT NULL | Patient reference |
| consultationId | String | NULLABLE | Linked consultation |
| amount | Float | NOT NULL | Invoice amount |
| description | String | NOT NULL | Description of charges |
| paymentStatus | PaymentStatus | DEFAULT PENDING | Payment status |
| dueDate | DateTime | NULLABLE | Payment due date |
| paidDate | DateTime | NULLABLE | When payment received |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Indexes**: patientId, paymentStatus

### AuditLog
Security and compliance audit trail.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PRIMARY KEY | Unique log ID |
| userId | String | NULLABLE | User who performed action |
| action | String | NOT NULL | Action performed |
| entity | String | NOT NULL | Entity type (e.g., "Patient") |
| entityId | String | NOT NULL | Entity ID |
| changes | Json | NULLABLE | JSON of changes |
| ipAddress | String | NULLABLE | IP address |
| userAgent | String | NULLABLE | User agent string |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |

**Indexes**: userId, entity, createdAt

## Enums

### UserRole
```
ADMIN, DOCTOR, PATIENT, RECEPTIONIST
```

### UserStatus
```
ACTIVE, INACTIVE, SUSPENDED
```

### Gender
```
MALE, FEMALE, OTHER
```

### BloodGroup
```
O_POSITIVE, O_NEGATIVE, A_POSITIVE, A_NEGATIVE,
B_POSITIVE, B_NEGATIVE, AB_POSITIVE, AB_NEGATIVE
```

### AppointmentStatus
```
PENDING, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED
```

### ConsultationStatus
```
SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
```

### PaymentStatus
```
PENDING, COMPLETED, FAILED, REFUNDED
```

## Migration Strategy

### Creating New Migrations
```bash
npm run db:migrate
```

### Database Seeding
Create `apps/backend/prisma/seed.ts` for initial data.

### Backup & Recovery
Always backup before major migrations:
```bash
pg_dump homeo_dev > backup_$(date +%s).sql
```

## Performance Considerations

- Proper indexing on foreign keys
- Pagination for list queries (max 100 items)
- Query optimization recommendations documented
- Connection pooling configured in Prisma

## Data Privacy

- Personal health information (PHI) is segregated
- Audit logging for HIPAA compliance
- Soft delete capability can be added
- Data retention policies to be implemented
