import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import type { Task } from '@/domain/entities/Task';
import { getCategoryColor, getPriorityColor, getPriorityLabel, getCategoryLabel } from '../utils/helpers';
import { useAppStore } from '../store/appStore';
import { useDeleteTask } from '../hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const openTaskForm = useAppStore((state) => state.openTaskForm);
  const deleteTaskMutation = useDeleteTask();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openTaskForm(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(task.id);
    }
  };

  const dueDate = new Date(task.dueDate);
  const createdDate = new Date(task.createdAt);
  const now = new Date();
  const isOverdue = dueDate.getTime() < now.getTime();

  return (
    <Card
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
        borderLeft: `4px solid ${getCategoryColor(task.category)}`,
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {task.title}
          </Typography>
          <Tooltip title={getPriorityLabel(task.priority)}>
            <FlagIcon
              sx={{
                color: getPriorityColor(task.priority),
                ml: 1,
              }}
            />
          </Tooltip>
        </Box>

        <Box display="flex" gap={1} mb={2}>
          <Chip
            label={getCategoryLabel(task.category)}
            size="small"
            sx={{
              backgroundColor: getCategoryColor(task.category),
              color: 'white',
            }}
          />
          <Chip
            label={`Priority ${task.priority}`}
            size="small"
            sx={{
              backgroundColor: getPriorityColor(task.priority),
              color: 'white',
            }}
          />
        </Box>

        <Box mb={1}>
          <Typography variant="body2" color="text.secondary">
            Created: {format(createdDate, 'PPp')}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Due: {format(dueDate, 'PPp')}
          {isOverdue && (
            <Typography component="span" color="error" sx={{ ml: 1, fontWeight: 'bold' }}>
              (Overdue)
            </Typography>
          )}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={handleEdit} color="primary">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
