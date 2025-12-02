import { Router, Request, Response } from 'express';
import { CreateAppointmentSchema } from '@homeo/shared';
import { prisma } from '../index.js';
import { sendSuccess, sendError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * GET /api/appointments
 * Get all appointments
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = status ? { status: String(status).toUpperCase() } : {};

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          patient: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
          doctor: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { appointmentDate: 'asc' },
      }),
      prisma.appointment.count({ where }),
    ]);

    return sendSuccess(res, {
      data: appointments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get appointments error:', error);
    return sendError(res, 'Failed to fetch appointments', 500);
  }
});

/**
 * GET /api/appointments/:id
 * Get appointment by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        consultation: true,
      },
    });

    if (!appointment) {
      return sendError(res, 'Appointment not found', 404);
    }

    return sendSuccess(res, appointment);
  } catch (error) {
    logger.error('Get appointment error:', error);
    return sendError(res, 'Failed to fetch appointment', 500);
  }
});

/**
 * POST /api/appointments
 * Create new appointment
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateAppointmentSchema.parse(req.body);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: validatedData.patientId,
        doctorId: validatedData.doctorId,
        appointmentDate: new Date(validatedData.appointmentDate),
        appointmentTime: validatedData.appointmentTime,
        notes: validatedData.notes,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    logger.info(`Appointment created: ${appointment.id}`);

    return sendSuccess(res, appointment, 'Appointment created successfully', 201);
  } catch (error) {
    logger.error('Create appointment error:', error);
    if (error instanceof Error) {
      return sendError(res, error.message, 400);
    }
    return sendError(res, 'Failed to create appointment', 500);
  }
});

/**
 * PUT /api/appointments/:id
 * Update appointment
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status: String(status).toUpperCase() }),
        ...(notes && { notes }),
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    logger.info(`Appointment updated: ${appointment.id}`);

    return sendSuccess(res, appointment, 'Appointment updated successfully');
  } catch (error) {
    logger.error('Update appointment error:', error);
    return sendError(res, 'Failed to update appointment', 500);
  }
});

/**
 * DELETE /api/appointments/:id
 * Cancel appointment
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    logger.info(`Appointment cancelled: ${id}`);

    return sendSuccess(res, appointment, 'Appointment cancelled successfully');
  } catch (error) {
    logger.error('Cancel appointment error:', error);
    return sendError(res, 'Failed to cancel appointment', 500);
  }
});

export default router;
