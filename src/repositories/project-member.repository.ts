import { prisma } from '../config/prisma';
import { Prisma, ProjectMember } from '@prisma/client';

export class ProjectMemberRepository {
  async findByProjectAndUser(
    projectId: string, 
    userId: string
  ): Promise<ProjectMember | null> {
    return prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      include: { user: true }
    });
  }

  async create(data: Prisma.ProjectMemberCreateInput): Promise<ProjectMember> {
    return prisma.projectMember.create({ data });
  }

  async delete(id: string): Promise<ProjectMember> {
    return prisma.projectMember.delete({ where: { id } });
  }

  async updateRole(
    projectId: string, 
    userId: string, 
    role: 'OWNER' | 'MEMBER'
  ): Promise<ProjectMember> {
    return prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data: { role }
    });
  }
}