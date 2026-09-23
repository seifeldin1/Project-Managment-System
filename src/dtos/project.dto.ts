export interface ProjectDTO {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  tasksCount?: number;
  createdAt: Date;
  updatedAt: Date;
}