import { z } from 'zod';

const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters').max(150),
  description: z.string().max(1000).optional(),
  status: taskStatusEnum.optional().default('TODO'),
  priority: taskPriorityEnum.optional().default('MEDIUM'),
  assigneeId: z.string().optional(), 
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().max(1000).optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  assigneeId: z.string().optional(),
});