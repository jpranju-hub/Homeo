import { Router, Request, Response } from 'express';
import { CreatePatientSchema, UpdatePatientSchema } from '@homeo/shared';
import { prisma } from '../index.js';
import { sendSuccess, sendError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * GET /api/patients
 * Get all patients (with pagination)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        skip,
        take: Number(limit),
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
      }),
      prisma.patient.count(),
    ]);

    return sendSuccess(res, {
      data: patients,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get patients error:', error);
    return sendError(res, 'Failed to fetch patients', 500);
  }
});

/**
 * GET /api/patients/:id
 * Get patient by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, firstName: true, lastName: true, phone: true } },
        consultations: { take: 5, orderBy: { scheduledAt: 'desc' } },
        appointments: { take: 5, orderBy: { appointmentDate: 'desc' } },
        medicalRecords: { take: 10 },
      },
    });

    if (!patient) {
      return sendError(res, 'Patient not found', 404);
    }

    return sendSuccess(res, patient);
  } catch (error) {
    logger.error('Get patient error:', error);
    return sendError(res, 'Failed to fetch patient', 500);
  }
});

/**
 * POST /api/patients
 * Create new patient
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const validatedData = CreatePatientSchema.parse(req.body);

    const patient = await prisma.patient.create({
      data: {
        userId: req.user.userId,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        gender: validatedData.gender as any,
        bloodGroup: validatedData.bloodGroup as any,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        postalCode: validatedData.postalCode,
        country: validatedData.country,
        phone: validatedData.phone,
        emergencyContact: validatedData.emergencyContact,
        allergies: validatedData.allergies,
        chronicDiseases: validatedData.chronicDiseases,
        notes: validatedData.notes,
      },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
    });

    logger.info(`Patient created: ${patient.id}`);

    return sendSuccess(res, patient, 'Patient created successfully', 201);
  } catch (error) {
    logger.error('Create patient error:', error);
    if (error instanceof Error) {
      return sendError(res, error.message, 400);
    }
    return sendError(res, 'Failed to create patient', 500);
  }
});

/**
 * PUT /api/patients/:id
 * Update patient
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdatePatientSchema.parse(req.body);

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...validatedData,
        dateOfBirth: validatedData.dateOfBirth
          ? new Date(validatedData.dateOfBirth)
          : undefined,
      },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
    });

    logger.info(`Patient updated: ${patient.id}`);

    return sendSuccess(res, patient, 'Patient updated successfully');
  } catch (error) {
    logger.error('Update patient error:', error);
    if (error instanceof Error) {
      return sendError(res, error.message, 400);
    }
    return sendError(res, 'Failed to update patient', 500);
  }
});

/**
 * DELETE /api/patients/:id
 * Delete patient
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.patient.delete({
      where: { id },
    });

    logger.info(`Patient deleted: ${id}`);

    return sendSuccess(res, null, 'Patient deleted successfully');
  } catch (error) {
    logger.error('Delete patient error:', error);
    return sendError(res, 'Failed to delete patient', 500);
  }
});

export default router;
