import { Response, NextFunction } from 'express';
import { projectMemberService } from '../services/project-member.service';
import { AuthRequest } from '../types/express';

export class ProjectMemberController {
  async addMember(req: AuthRequest<{ projectId: string }>, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await projectMemberService.addMember(req.user!.userId, req.params.projectId, email);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async removeMember(req: AuthRequest<{ projectId: string }>, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      const result = await projectMemberService.removeMember(req.user!.userId, req.params.projectId, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}

export const projectMemberController = new ProjectMemberController();