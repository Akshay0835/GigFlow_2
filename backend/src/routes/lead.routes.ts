import express from 'express';
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  exportLeadsCsv,
  bulkCreateLeads,
} from '../controllers/lead.controller';
import { protect, restrictTo } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createLeadSchema, updateLeadSchema } from '../schemas/lead.schema';

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/export', exportLeadsCsv);

router.post('/bulk', restrictTo('Admin'), bulkCreateLeads);

router
  .route('/')
  .get(getLeads)
  .post(restrictTo('Admin'), validate(createLeadSchema), createLead);

router
  .route('/:id')
  .patch(restrictTo('Admin'), validate(updateLeadSchema), updateLead)
  .delete(restrictTo('Admin'), deleteLead);

export default router;
