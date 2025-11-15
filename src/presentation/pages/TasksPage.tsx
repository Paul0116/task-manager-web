import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Fab,
  AppBar,
  Toolbar,
  IconButton,
  Pagination,
} from '@mui/material';
import { Add as AddIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { useAppStore } from '../store/appStore';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/TaskList';
import { TaskFilters } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { TaskDrawer } from '../components/TaskDrawer';
import type { Task, TaskQueryParams } from '@/domain/entities/Task';

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { filters, setFilters, openTaskForm } = useAppStore();

  const queryParams: TaskQueryParams = {
    sortBy: filters.sortBy,
  };

  const { data, isLoading, error } = useTasks(queryParams);

  const filteredTasks = useMemo(() => {
    if (!data?.tasks) return [];

    return data.tasks.filter((task: Task) => {
      if (filters.createdDateFrom) {
        const createdDate = new Date(task.createdAt);
        const fromDate = new Date(filters.createdDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (createdDate < fromDate) return false;
      }

      if (filters.createdDateTo) {
        const createdDate = new Date(task.createdAt);
        const toDate = new Date(filters.createdDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (createdDate > toDate) return false;
      }

      if (filters.dueDateFrom) {
        const dueDate = new Date(task.dueDate);
        const fromDate = new Date(filters.dueDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (dueDate < fromDate) return false;
      }

      if (filters.dueDateTo) {
        const dueDate = new Date(task.dueDate);
        const toDate = new Date(filters.dueDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (dueDate > toDate) return false;
      }

      return true;
    });
  }, [data?.tasks, filters.createdDateFrom, filters.createdDateTo, filters.dueDateFrom, filters.dueDateTo]);

  const totalPages = Math.ceil(filteredTasks.length / filters.pageSize);
  const paginatedTasks = useMemo(() => {
    const startIndex = filters.page * filters.pageSize;
    const endIndex = startIndex + filters.pageSize;
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, filters.page, filters.pageSize]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setFilters({ page: page - 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/calendar')}>
            <CalendarIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            My Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openTaskForm()}
            size="large"
          >
            New Task
          </Button>
        </Box>

        <TaskFilters />

        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedTasks.length} of {filteredTasks.length} tasks
            {filteredTasks.length !== data?.total && ` (${data?.total} total)`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page {filters.page + 1} of {totalPages || 1}
          </Typography>
        </Box>

        <TaskList tasks={paginatedTasks} isLoading={isLoading} error={error} />

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={filters.page + 1}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' },
          }}
          onClick={() => openTaskForm()}
        >
          <AddIcon />
        </Fab>
      </Container>

      <TaskForm />
      <TaskDrawer />
    </>
  );
};
