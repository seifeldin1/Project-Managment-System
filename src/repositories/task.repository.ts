import { prisma } from '../config/prisma';
import { Prisma, Task } from '@prisma/client';

export class TaskRepository {
  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: { 
        assignee: true,
        project: { 
          include: { members: true }
        } 
      },
    });
  }

  async findMany(
    projectId: string, 
    skip: number, 
    take: number, 
    filters?: Prisma.TaskWhereInput
  ): Promise<Task[]> {
    return prisma.task.findMany({
      where: { projectId, ...filters },
      skip,
      take,
      include: { assignee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return prisma.task.create({ data, include: { assignee: true } });
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  }
}