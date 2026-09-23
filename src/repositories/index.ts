import { UserRepository } from './user.repository';
import { ProjectRepository } from './project.repository';
import { TaskRepository } from './task.repository';
import { ProjectMemberRepository } from './project-member.repository';

export const userRepository = new UserRepository();
export const projectRepository = new ProjectRepository();
export const taskRepository = new TaskRepository();
export const projectMemberRepository = new ProjectMemberRepository();