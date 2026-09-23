import { TaskStatus, TaskPriority } from '@prisma/client';

export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}