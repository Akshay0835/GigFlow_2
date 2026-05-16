import { z } from 'zod';
import { LeadStatus, LeadSource } from '../models/Lead';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource),
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Lead ID'),
  }),
});
