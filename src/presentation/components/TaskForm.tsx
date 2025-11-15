import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CreateTaskSchema, TaskCategory, type CreateTaskDto } from '@/domain/entities/Task';
import { useAppStore } from '../store/appStore';
import { useCreateTask, useUpdateTask, useTask } from '../hooks/useTasks';

const categories = Object.values(TaskCategory);
const priorities = [1, 2, 3, 4, 5];

const getLocalISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export const TaskForm: React.FC = () => {
  const { ui, closeTaskForm } = useAppStore();
  const { isTaskFormOpen, editingTaskId } = ui;

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  
  const { data: existingTask, isLoading: isLoadingTask } = useTask(editingTaskId || '', {
    enabled: !!editingTaskId,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskDto>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: '',
      priority: 3,
      dueDate: getLocalISOString(new Date()),
      category: TaskCategory.PERSONAL,
    },
  });

  useEffect(() => {
    if (existingTask) {
      reset({
        title: existingTask.title,
        priority: existingTask.priority,
        dueDate: existingTask.dueDate,
        category: existingTask.category,
      });
    } else if (!editingTaskId) {
      reset({
        title: '',
        priority: 3,
        dueDate: getLocalISOString(new Date()),
        category: TaskCategory.PERSONAL,
      });
    }
  }, [existingTask, editingTaskId, reset]);

  const onSubmit = async (data: CreateTaskDto) => {
    try {
      if (editingTaskId) {
        await updateTaskMutation.mutateAsync({ id: editingTaskId, data });
      } else {
        await createTaskMutation.mutateAsync(data);
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleClose = () => {
    reset();
    closeTaskForm();
  };

  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;
  const error = createTaskMutation.error || updateTaskMutation.error;

  return (
    <Dialog open={isTaskFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingTaskId ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {isLoadingTask ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {error && (
                <Alert severity="error">
                  {error.message || 'An error occurred while saving the task'}
                </Alert>
              )}

              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    required
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category"
                    fullWidth
                    required
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Priority"
                    fullWidth
                    required
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority} - {getPriorityLabel(priority)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="Due Date"
                      value={new Date(field.value)}
                      onChange={(date) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          const hours = String(date.getHours()).padStart(2, '0');
                          const minutes = String(date.getMinutes()).padStart(2, '0');
                          const seconds = String(date.getSeconds()).padStart(2, '0');
                          const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
                          
                          const localISOString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
                          field.onChange(localISOString);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.dueDate,
                          helperText: errors.dueDate?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading || isLoadingTask}
          >
            {isLoading ? <CircularProgress size={24} /> : editingTaskId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

function getPriorityLabel(priority: number): string {
  const labels: Record<number, string> = {
    1: 'Very Low',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Very High',
  };
  return labels[priority] || 'Unknown';
}
