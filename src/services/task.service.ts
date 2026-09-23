import { taskRepository, projectRepository } from '../repositories';
import { AppError } from '../errors/AppError';
import { TaskDTO } from '../dtos/task.dto';
import { TaskStatus, Task } from '@prisma/client';

export class TaskService {
  
  async createTask(userId: string, projectId: string, data: any) {
    const project = await projectRepository.findById(projectId);
    if(!project) 
        throw new AppError('Project not found', 404);

    const member = project.members.find((m: any) => m.userId === userId);
    if(!member) 
        throw new AppError('Forbidden: You are not a member of this project', 403);

    if(data.assigneeId) {
      const isAssigneeMember = project.members.some((m: any) => m.userId === data.assigneeId);
      if(!isAssigneeMember) 
        throw new AppError('Bad Request: Assignee must be a member of this project', 400);
    }

    const task = await taskRepository.create({
      title: data.title,
      description: data.description,
      status: data.status || 'TODO',
      priority: data.priority || 'MEDIUM',
      project: { connect: { id: projectId } },
      assignee: data.assigneeId ? { connect: { id: data.assigneeId } } : undefined,
    });

    return this.formatTaskDTO(task);
  }

  async getTasks(projectId: string, page: number = 1, limit: number = 10) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit)); 
    const skip = (safePage - 1) * safeLimit;

    const tasks = await taskRepository.findMany(projectId, skip, safeLimit);
    return tasks.map(this.formatTaskDTO);
  }

  async updateTaskStatus(userId: string, taskId: string, status: TaskStatus) {
    const task = await taskRepository.findById(taskId);
    if(!task) 
        throw new AppError('Task not found', 404);

    const member = task.project.members.find((m: any) => m.userId === userId);
    if(!member) 
        throw new AppError('Forbidden: You are not a member of this project', 403);

    if(member.role === 'MEMBER' && task.assigneeId !== userId) 
        throw new AppError('Forbidden: You can only update tasks assigned to you', 403);
    
    const updatedTask = await taskRepository.update(taskId, { status });
    return this.formatTaskDTO(updatedTask);
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await taskRepository.findById(taskId);
    if(!task) 
        throw new AppError('Task not found', 404);

    const member = task.project.members.find((m: any) => m.userId === userId);
    if(!member) 
        throw new AppError('Forbidden: You are not a member of this project', 403);

    if(member.role !== 'OWNER') 
        throw new AppError('Forbidden: Only the project owner can delete tasks', 403);

    await taskRepository.delete(taskId);
    return { message: 'Task deleted successfully' };
  }

  private formatTaskDTO(task: Task): TaskDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId,
      assigneeId: task.assigneeId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}

export const taskService = new TaskService();