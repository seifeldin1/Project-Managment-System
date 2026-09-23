import { Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import { AuthRequest } from '../types/express';

export class ProjectController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await projectService.createProject(req.user!.userId, req.body);
      res.status(201).json({ success: true, data: project });
    } catch (error) { next(error); }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const projects = await projectService.getProjects(req.user!.userId, page, limit);
      res.status(200).json({ success: true, data: projects });
    } catch (error) { next(error); }
  }

  async getById(req: AuthRequest<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getProjectById(req.user!.userId, req.params.id);
      res.status(200).json({ success: true, data: project });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const project = await projectService.updateProject(req.user!.userId, req.params.id, req.body);
      res.status(200).json({ success: true, data: project });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const result = await projectService.deleteProject(req.user!.userId, req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}

export const projectController = new ProjectController();