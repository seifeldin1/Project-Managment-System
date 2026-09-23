import { prisma } from '../config/prisma';
import { Prisma, Project } from '@prisma/client';

export class ProjectRepository {
  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: { 
        owner: true, 
        members: { include: { user: true } },
        _count: { select: { tasks: true } }
      },
    });
  }

  async findMany(
    userId: string, 
    skip: number, 
    take: number, 
    filters?: Prisma.ProjectWhereInput
  ) {
    return prisma.project.findMany({
      where: {
        members: { some: { userId } },
        ...filters,
      },
      skip,
      take,
      include: { 
        owner: true, 
        members: { include: { user: true } },
        _count: { select: { tasks: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data, include: { members: true } });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }
}