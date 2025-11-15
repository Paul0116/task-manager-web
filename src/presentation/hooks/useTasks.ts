import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import type { CreateTaskDto, Task, TaskQueryParams, TasksResponse, UpdateTaskDto } from '@/domain/entities/Task';
import { SortBy } from '@/domain/entities/Task';
import { taskRepository } from '@/data/repositories/TaskRepositoryImpl';
import { useAppStore } from '../store/appStore';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params?: TaskQueryParams) => [...taskKeys.lists(), params] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export const useTasks = (
  params?: TaskQueryParams,
  options?: Omit<UseQueryOptions<TasksResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TasksResponse, Error>({
    queryKey: taskKeys.list(params),
    queryFn: () => taskRepository.getTasks(params),
    staleTime: 30000,
    ...options,
  });
};

export const useTask = (
  id: string,
  options?: Omit<UseQueryOptions<Task, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Task, Error>({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskRepository.getTaskById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const closeTaskForm = useAppStore((state) => state.closeTaskForm);

  return useMutation<Task, Error, CreateTaskDto>({
    mutationFn: (taskDto) => taskRepository.createTask(taskDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      closeTaskForm();
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const closeTaskForm = useAppStore((state) => state.closeTaskForm);
  const setSelectedTaskId = useAppStore((state) => state.setSelectedTaskId);

  return useMutation<Task, Error, { id: string; data: UpdateTaskDto }>({
    mutationFn: ({ id, data }) => taskRepository.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      closeTaskForm();
      setSelectedTaskId(null);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const setSelectedTaskId = useAppStore((state) => state.setSelectedTaskId);

  return useMutation<void, Error, string>({
    mutationFn: (id) => taskRepository.deleteTask(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      setSelectedTaskId(null);
    },
  });
};

export const useTasksByDueDate = () => {
  const params: TaskQueryParams = {
    sortBy: SortBy.DUE_DATE,
  };

  return useTasks(params);
};
