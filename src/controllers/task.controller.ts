import { Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest } from '../types/express';

export class TaskController {
  async create(req: AuthRequest<{ projectId: string }>, res: Response, next: NextFunction) {
    try {
      const task = await taskService.createTask(req.user!.userId, req.params.projectId, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) { next(error); }
  }

  async getAll(req: AuthRequest<{ projectId: string }>, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const tasks = await taskService.getTasks(req.params.projectId, page, limit);
      res.status(200).json({ success: true, data: tasks });
    } catch (error) { next(error); }
  }

  async updateStatus(req: AuthRequest<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const task = await taskService.updateTaskStatus(req.user!.userId, req.params.id, status);
      res.status(200).json({ success: true, data: task });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const result = await taskService.deleteTask(req.user!.userId, req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}

export const taskController = new TaskController();