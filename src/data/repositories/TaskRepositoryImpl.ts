import type { Task, CreateTaskDto, UpdateTaskDto, TaskQueryParams, TasksResponse } from '@/domain/entities/Task';
import type { TaskRepository } from '@/domain/repositories/TaskRepository';
import { httpClient } from '../api/httpClient';
import { TaskSchema } from '@/domain/entities/Task';


export class TaskRepositoryImpl implements TaskRepository {
  private readonly baseUrl = '/api/tasks';

  async getTasks(params?: TaskQueryParams): Promise<TasksResponse> {
    const queryParams = new URLSearchParams();

    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }

    const url = queryParams.toString() 
      ? `${this.baseUrl}?${queryParams.toString()}` 
      : this.baseUrl;

    const response = await httpClient.get<TasksResponse>(url);
    
    response.tasks = response.tasks.map(task => TaskSchema.parse(task));
    
    return response;
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await httpClient.get<Task>(`${this.baseUrl}/${id}`);
    return TaskSchema.parse(task);
  }

  async createTask(taskDto: CreateTaskDto): Promise<Task> {
    const task = await httpClient.post<Task>(this.baseUrl, taskDto);
    return TaskSchema.parse(task);
  }

  async updateTask(id: string, taskDto: UpdateTaskDto): Promise<Task> {
    const task = await httpClient.put<Task>(`${this.baseUrl}/${id}`, taskDto);
    return TaskSchema.parse(task);
  }

  async deleteTask(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const taskRepository = new TaskRepositoryImpl();
