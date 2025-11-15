import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Close as CloseIcon, Flag as FlagIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppStore } from '../store/appStore';
import { useTask } from '../hooks/useTasks';
import { getCategoryColor, getCategoryLabel, getPriorityColor, getPriorityLabel } from '../utils/helpers';

export const TaskDrawer: React.FC = () => {
  const { ui, setSelectedTaskId } = useAppStore();
  const { isDrawerOpen, selectedTaskId } = ui;

  const { data: task, isLoading, error } = useTask(selectedTaskId || '', {
    enabled: !!selectedTaskId,
  });

  const handleClose = () => {
    setSelectedTaskId(null);
  };

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Task Details</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error">
            {error.message || 'Failed to load task details'}
          </Alert>
        )}

        {task && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Title
              </Typography>
              <Typography variant="h6">{task.title}</Typography>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary" display="block" mb={1}>
                Category
              </Typography>
              <Chip
                label={getCategoryLabel(task.category)}
                sx={{
                  backgroundColor: getCategoryColor(task.category),
                  color: 'white',
                }}
              />
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary" display="block" mb={1}>
                Priority
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <FlagIcon sx={{ color: getPriorityColor(task.priority) }} />
                <Chip
                  label={`${task.priority} - ${getPriorityLabel(task.priority)}`}
                  sx={{
                    backgroundColor: getPriorityColor(task.priority),
                    color: 'white',
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">
                Due Date
              </Typography>
              <Typography variant="body1">
                {format(new Date(task.dueDate), 'PPPp')}
              </Typography>
              {new Date(task.dueDate) < new Date() && (
                <Typography color="error" variant="body2" sx={{ mt: 0.5 }}>
                  This task is overdue
                </Typography>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="overline" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body2">
                {format(new Date(task.createdAt), 'PPPp')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body2">
                {format(new Date(task.updatedAt), 'PPPp')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">
                Task ID
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {task.id}
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};
