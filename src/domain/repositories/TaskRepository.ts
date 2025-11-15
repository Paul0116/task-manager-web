import type { Task, CreateTaskDto, UpdateTaskDto, TaskQueryParams, TasksResponse } from '../entities/Task';

export interface TaskRepository {
  getTasks(params?: TaskQueryParams): Promise<TasksResponse>;
  getTaskById(id: string): Promise<Task>;
  createTask(task: CreateTaskDto): Promise<Task>;
  updateTask(id: string, task: UpdateTaskDto): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
