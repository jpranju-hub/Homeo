import { Router, Request, Response } from 'express';
import { CreateConsultationSchema } from '@homeo/shared';
import { prisma } from '../index.js';
import { sendSuccess, sendError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * GET /api/consultations
 * Get all consultations
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, patientId, doctorId, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          patient: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
          doctor: { select: { id: true, firstName: true, lastName: true } },
          prescriptions: true,
        },
        orderBy: { scheduledAt: 'desc' },
      }),
      prisma.consultation.count({ where }),
    ]);

    return sendSuccess(res, {
      data: consultations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get consultations error:', error);
    return sendError(res, 'Failed to fetch consultations', 500);
  }
});

/**
 * GET /api/consultations/:id
 * Get consultation by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        prescriptions: { include: { items: true } },
        appointment: true,
      },
    });

    if (!consultation) {
      return sendError(res, 'Consultation not found', 404);
    }

    return sendSuccess(res, consultation);
  } catch (error) {
    logger.error('Get consultation error:', error);
    return sendError(res, 'Failed to fetch consultation', 500);
  }
});

/**
 * POST /api/consultations
 * Create new consultation
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateConsultationSchema.parse(req.body);

    const consultation = await prisma.consultation.create({
      data: {
        patientId: validatedData.patientId,
        doctorId: validatedData.doctorId,
        scheduledAt: new Date(),
        duration: 30,
        complaints: validatedData.complaints,
        diagnosis: validatedData.diagnosis,
        prescription: validatedData.prescription,
        notes: validatedData.notes,
      },
      include: {
        patient: true,
        doctor: true,
        prescriptions: true,
      },
    });

    logger.info(`Consultation created: ${consultation.id}`);

    return sendSuccess(res, consultation, 'Consultation created successfully', 201);
  } catch (error) {
    logger.error('Create consultation error:', error);
    if (error instanceof Error) {
      return sendError(res, error.message, 400);
    }
    return sendError(res, 'Failed to create consultation', 500);
  }
});

/**
 * PUT /api/consultations/:id
 * Update consultation
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { diagnosis, notes, status } = req.body;

    const consultation = await prisma.consultation.update({
      where: { id },
      data: {
        ...(diagnosis && { diagnosis }),
        ...(notes && { notes }),
        ...(status && { status }),
      },
      include: {
        patient: true,
        doctor: true,
        prescriptions: true,
      },
    });

    logger.info(`Consultation updated: ${consultation.id}`);

    return sendSuccess(res, consultation, 'Consultation updated successfully');
  } catch (error) {
    logger.error('Update consultation error:', error);
    return sendError(res, 'Failed to update consultation', 500);
  }
});

export default router;
