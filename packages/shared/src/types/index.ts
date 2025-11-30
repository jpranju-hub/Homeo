import { z } from 'zod';

/**
 * API Response Types
 */
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  timestamp: z.date().optional(),
});

export type ApiResponse<T = unknown> = z.infer<typeof ApiResponseSchema> & {
  data?: T;
};

/**
 * Pagination Types
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = z.object({
  data: z.array(z.unknown()),
  pagination: PaginationSchema,
});

export type PaginatedResponse<T = unknown> = {
  data: T[];
  pagination: Pagination;
};

/**
 * User & Authentication Types
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  RECEPTIONIST = 'RECEPTIONIST',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const AuthTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  tokenType: z.string().default('Bearer'),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;

/**
 * Patient Types
 */
export enum BloodGroup {
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export const PatientSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  dateOfBirth: z.date(),
  gender: z.nativeEnum(Gender),
  bloodGroup: z.nativeEnum(BloodGroup).optional(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  phone: z.string(),
  emergencyContact: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Patient = z.infer<typeof PatientSchema>;

/**
 * Consultation Types
 */
export enum ConsultationStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export const ConsultationSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  scheduledAt: z.date(),
  duration: z.number().int().positive(), // in minutes
  status: z.nativeEnum(ConsultationStatus),
  complaints: z.string(),
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Consultation = z.infer<typeof ConsultationSchema>;

/**
 * Prescription Types
 */
export const PrescriptionItemSchema = z.object({
  id: z.string().uuid(),
  medicineName: z.string(),
  potency: z.string(), // e.g., "30C", "200C"
  dosage: z.string(), // e.g., "5 drops", "1 tablet"
  frequency: z.string(), // e.g., "3 times daily"
  duration: z.string(), // e.g., "10 days", "2 weeks"
  notes: z.string().optional(),
});

export type PrescriptionItem = z.infer<typeof PrescriptionItemSchema>;

export const PrescriptionSchema = z.object({
  id: z.string().uuid(),
  consultationId: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  items: z.array(PrescriptionItemSchema),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Prescription = z.infer<typeof PrescriptionSchema>;

/**
 * Medical Record Types
 */
export const MedicalRecordSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  fileUrl: z.string().url(),
  recordType: z.string(), // e.g., "lab_report", "x_ray", "prescription"
  recordedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MedicalRecord = z.infer<typeof MedicalRecordSchema>;

/**
 * Appointment Types
 */
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  appointmentDate: z.date(),
  appointmentTime: z.string(), // HH:mm format
  status: z.nativeEnum(AppointmentStatus),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

/**
 * Billing Types
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  consultationId: z.string().uuid().optional(),
  amount: z.number().positive(),
  description: z.string(),
  paymentStatus: z.nativeEnum(PaymentStatus),
  dueDate: z.date().optional(),
  paidDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
