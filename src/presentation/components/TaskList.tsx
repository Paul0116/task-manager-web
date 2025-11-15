import React from 'react';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import type { Task } from '@/domain/entities/Task';
import { TaskCard } from './TaskCard';
import { useAppStore } from '../store/appStore';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: Error | null;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, error }) => {
  const setSelectedTaskId = useAppStore((state) => state.setSelectedTaskId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error.message || 'Failed to load tasks'}
      </Alert>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Box py={8} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Create a new task to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task.id}>
          <TaskCard task={task} onClick={() => setSelectedTaskId(task.id)} />
        </Grid>
      ))}
    </Grid>
  );
};
