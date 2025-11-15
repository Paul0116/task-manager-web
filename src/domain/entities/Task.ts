import { z } from 'zod';

export enum TaskCategory {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  SHOPPING = 'SHOPPING',
}

export enum SortBy {
  CREATED_AT = 'CREATED_AT',
  PRIORITY = 'PRIORITY',
  DUE_DATE = 'DUE_DATE',
  CATEGORY = 'CATEGORY',
}

export const TaskCategorySchema = z.nativeEnum(TaskCategory);

export const SortBySchema = z.nativeEnum(SortBy);

const DateTimeSchema = z.string().refine(
  (val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  },
  { message: 'Invalid datetime format' }
);

export const TaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, 'Title is required'),
  priority: z.number().int().min(1).max(5),
  dueDate: DateTimeSchema,
  category: TaskCategorySchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  priority: z.number().int().min(1, 'Priority must be at least 1').max(5, 'Priority must be at most 5'),
  dueDate: DateTimeSchema,
  category: TaskCategorySchema,
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  priority: z.number().int().min(1).max(5).optional(),
  dueDate: DateTimeSchema.optional(),
  category: TaskCategorySchema.optional(),
});

export const TaskQueryParamsSchema = z.object({
  sortBy: SortBySchema.optional(),
  page: z.number().int().min(0).optional(),
  size: z.number().int().min(1).max(100).optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
export type TaskQueryParams = z.infer<typeof TaskQueryParamsSchema>;

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page?: number;
  size?: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
}
