export * from './types/index';
export * from './schemas/index';

// Direct exports for better compatibility
export {
  LoginSchema,
  RegisterSchema,
  PasswordResetSchema,
  CreatePatientSchema,
  UpdatePatientSchema,
  CreateAppointmentSchema,
  CreateConsultationSchema,
  PaginationParamsSchema,
  SearchParamsSchema,
} from './schemas/index';

export type {
  Login,
  Register,
  PasswordReset,
  CreatePatient,
  UpdatePatient,
  CreateAppointment,
  CreateConsultation,
  PaginationParams,
  SearchParams,
} from './schemas/index';