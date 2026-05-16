import { Request, Response, NextFunction } from 'express';
import { Parser } from 'json2csv';
import { Lead } from '../models/Lead';
import { AppError } from '../utils/AppError';

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newLead = await Lead.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        lead: newLead,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const bulkCreateLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = req.body.leads;
    if (!leads || !Array.isArray(leads)) {
      return next(new AppError('Please provide an array of leads', 400));
    }
    
    // Use ordered: false so that if one lead fails (e.g. duplicate email), it continues inserting the others
    const newLeads = await Lead.insertMany(leads, { ordered: false });
    
    res.status(201).json({
      status: 'success',
      results: newLeads.length,
      data: {
        leads: newLeads,
      },
    });
  } catch (error: any) {
    // If ordered: false, Mongo throws a MongoBulkWriteError if some inserts failed.
    // The successful inserts are still saved.
    if (error.name === 'MongoBulkWriteError' && error.code === 11000) {
       return res.status(201).json({
          status: 'success',
          message: 'Some leads were skipped because they already exist.',
          results: error.insertedCount,
          data: {
             leads: Object.values(error.insertedDocs)
          }
       });
    }
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Construct search query
    let queryArgs: any = { ...queryObj };
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      queryArgs.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    // Support multiple concurrent filters (e.g., status=New,Contacted)
    if (req.query.status) {
      queryArgs.status = { $in: (req.query.status as string).split(',') };
    }
    if (req.query.source) {
      queryArgs.source = { $in: (req.query.source as string).split(',') };
    }

    let query = Lead.find(queryArgs);

    // 2. Sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3. Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const leads = await query;
    
    // Get total count for pagination metadata
    const total = await Lead.countDocuments(queryArgs);

    res.status(200).json({
      status: 'success',
      metadata: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: {
        leads,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Same filtering as getLeads, without pagination
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryArgs: any = { ...queryObj };
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      queryArgs.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }
    if (req.query.status) {
      queryArgs.status = { $in: (req.query.status as string).split(',') };
    }
    if (req.query.source) {
      queryArgs.source = { $in: (req.query.source as string).split(',') };
    }

    const leads = await Lead.find(queryArgs).sort('-createdAt');

    const fields = ['name', 'email', 'status', 'source', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return next(new AppError('No lead found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        lead,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return next(new AppError('No lead found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
