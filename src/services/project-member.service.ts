import { projectRepository, projectMemberRepository, userRepository } from '../repositories';
import { AppError } from '../errors/AppError';

export class ProjectMemberService {

  private async assertProjectOwner(projectId: string, userId: string) {
    const project = await projectRepository.findById(projectId);
    if(!project) 
        throw new AppError('Project not found', 404);

    const member = project.members.find((m: any) => m.userId === userId);
    if(!member)
        throw new AppError('Forbidden: You are not a member of this project', 403);

    if(member.role === 'OWNER') 
        throw new AppError('Forbidden: Only the project owner can perform this action', 403);

    return project;
  }

  async addMember(requestingUserId: string, projectId: string, targetUserEmail: string) {
    await this.assertProjectOwner(projectId, requestingUserId);

    const targetUser = await userRepository.findByEmail(targetUserEmail);
    if(!targetUser) 
        throw new AppError('User with this email not found', 404);

    const existingMember = await projectMemberRepository.findByProjectAndUser(projectId, targetUser.id);
    if(existingMember) 
        throw new AppError('User is already a member of this project', 409);

    await projectMemberRepository.create({
      project: { connect: { id: projectId } },
      user: { connect: { id: targetUser.id } },
      role: 'MEMBER',
    });

    return { message: 'Member added successfully', userId: targetUser.id };
  }

  async removeMember(requestingUserId: string, projectId: string, targetUserId: string) {
    await this.assertProjectOwner(projectId, requestingUserId);

    const targetMember = await projectMemberRepository.findByProjectAndUser(projectId, targetUserId);
    if(!targetMember) 
        throw new AppError('User is not a member of this project', 404);

    if(targetMember.role === 'OWNER') 
        throw new AppError('Forbidden: Cannot remove the project owner', 403);
    
    await projectMemberRepository.delete(targetMember.id);
    return { message: 'Member removed successfully' };
  }
}

export const projectMemberService = new ProjectMemberService();