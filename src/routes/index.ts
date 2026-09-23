import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
import projectMemberRoutes from './project-member.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes); 
router.use('/tasks', taskRoutes); 
router.use('/projects', projectMemberRoutes); 

export default router;