import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters').max(100),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
});