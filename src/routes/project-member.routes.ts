import { Router } from 'express';
import { projectMemberController } from '../controllers/project-member.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /projects/{projectId}/members:
 *   post:
 *     tags: [Project Members]
 *     summary: Add a member to a project (Owner only)
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
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: Member added }
 *       403: { description: Only owner can add members }
 *       409: { description: User already a member }
 */
router.post('/:projectId/members', projectMemberController.addMember);

/**
 * @swagger
 * /projects/{projectId}/members:
 *   delete:
 *     tags: [Project Members]
 *     summary: Remove a member from a project (Owner only)
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
 *             required: [userId]
 *             properties:
 *               userId: { type: string }
 *     responses:
 *       200: { description: Member removed }
 *       403: { description: Only owner can remove members }
 */
router.delete('/:projectId/members', projectMemberController.removeMember);

export default router;