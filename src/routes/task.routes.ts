import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema } from '../validators/task.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /tasks/projects/{projectId}:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task in a project
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, minLength: 3 }
 *               description: { type: string }
 *               status: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *               assigneeId: { type: string }
 *     responses:
 *       201: { description: Task created }
 */
router.post('/projects/:projectId', validate(createTaskSchema), taskController.create);

/**
 * @swagger
 * /tasks/projects/{projectId}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks in a project
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: List of tasks }
 */
router.get('/projects/:projectId', taskController.getAll);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update task status
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
 *     responses:
 *       200: { description: Task updated }
 *       403: { description: Can only update assigned tasks }
 */
router.patch('/:id/status', taskController.updateStatus);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task (Owner only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task deleted }
 *       403: { description: Only owner can delete }
 */
router.delete('/tasks/:id', taskController.delete);

export default router;