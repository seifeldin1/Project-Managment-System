import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

export class TaskRepository {
  async findById(id: string) {
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
  ) {
    return prisma.task.findMany({
      where: { projectId, ...filters },
      skip,
      take,
      include: { assignee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.TaskCreateInput) {
    return prisma.task.create({ data, include: { assignee: true } });
  }

  async update(id: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  }
}