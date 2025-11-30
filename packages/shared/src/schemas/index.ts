import { z } from 'zod';

/**
 * Authentication Schemas
 */
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type Login = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['DOCTOR', 'PATIENT']),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type Register = z.infer<typeof RegisterSchema>;

export const PasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type PasswordReset = z.infer<typeof PasswordResetSchema>;

/**
 * Patient Schemas
 */
export const CreatePatientSchema = z.object({
  dateOfBirth: z.string().refine((date: string) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']).optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^\d{5,6}$/, 'Invalid postal code'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
    message: 'Invalid phone number',
  }),
  emergencyContact: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  notes: z.string().optional(),
});

export type CreatePatient = z.infer<typeof CreatePatientSchema>;

export const UpdatePatientSchema = CreatePatientSchema.partial();

export type UpdatePatient = z.infer<typeof UpdatePatientSchema>;

/**
 * Appointment Schemas
 */
export const CreateAppointmentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  appointmentDate: z.string().refine((date: string) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  appointmentTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:mm format',
  }),
  notes: z.string().optional(),
});

export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>;

/**
 * Consultation Schemas
 */
export const CreateConsultationSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  complaints: z.string().min(10, 'Complaints description must be at least 10 characters'),
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateConsultation = z.infer<typeof CreateConsultationSchema>;

/**
 * Pagination Schemas
 */
export const PaginationParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

/**
 * Search Schemas
 */
export const SearchParamsSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;
