import { projectRepository } from '../repositories';
import { AppError } from '../errors/AppError';
import { ProjectDTO } from '../dtos/project.dto';

export class ProjectService {
  
  private async findProjectWithMembers(projectId: string) {
    const project = await projectRepository.findById(projectId);
    if(!project) 
        throw new AppError('Project not found', 404);
    return project;
  }

  private getMemberRecord(project: any, userId: string) {
    return project.members.find((m: any) => m.userId === userId);
  }

  async createProject(userId: string, data: { name: string; description?: string }) {
    const project = await projectRepository.create({
      name: data.name,
      description: data.description,
      owner: { connect: { id: userId } },
      members: {
        create: {
          user: { connect: { id: userId } },
          role: 'OWNER',
        },
      },
    });

    return this.formatProjectDTO(project);
  }

  async getProjects(userId: string, page: number = 1, limit: number = 10) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit)); 
    const skip = (safePage - 1) * safeLimit;
    
    const projects = await projectRepository.findMany(userId, skip, safeLimit);
    return projects.map(this.formatProjectDTO);
  }

  async getProjectById(userId: string, projectId: string) {
    const project = await this.findProjectWithMembers(projectId);

    if(!this.getMemberRecord(project, userId)) 
        throw new AppError('Forbidden: You are not a member of this project', 403);

    return this.formatProjectDTO(project);
  }

  async updateProject(userId: string, projectId: string, data: { name?: string; description?: string }) {
    const project = await this.findProjectWithMembers(projectId);
    const member = this.getMemberRecord(project, userId);

    if(!member) 
        throw new AppError('Forbidden: You are not a member of this project', 403);
    if(member.role !== 'OWNER') 
        throw new AppError('Forbidden: Only the project owner can update this project', 403);
    
    const updatedProject = await projectRepository.update(projectId, data);
    return this.formatProjectDTO(updatedProject);
  }

  async deleteProject(userId: string, projectId: string) {
    const project = await this.findProjectWithMembers(projectId);
    const member = this.getMemberRecord(project, userId);

    if(!member) 
        throw new AppError('Forbidden: You are not a member of this project', 403);
    
    if(member.role !== 'OWNER') 
        throw new AppError('Forbidden: Only the project owner can delete this project', 403);
    
    await projectRepository.delete(projectId);
    return { message: 'Project deleted successfully' };
  }

  private formatProjectDTO(project: any): ProjectDTO {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      ownerId: project.ownerId,
      tasksCount: project._count?.tasks || 0,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}

export const projectService = new ProjectService();