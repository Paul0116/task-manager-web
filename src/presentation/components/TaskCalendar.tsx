import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Badge,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import type { Task } from '@/domain/entities/Task';
import { useTasksByDueDate } from '../hooks/useTasks';
import { getCategoryColor, getPriorityLabel, getCategoryLabel } from '../utils/helpers';
import { useAppStore } from '../store/appStore';

interface TaskCalendarProps {
  selectedMonth: Date;
}

export const TaskCalendar: React.FC<TaskCalendarProps> = ({ selectedMonth }) => {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const { data, isLoading } = useTasksByDueDate();
  const setSelectedTaskId = useAppStore((state) => state.setSelectedTaskId);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [calendarStart, calendarEnd]);

  const getTasksForDay = (day: Date): Task[] => {
    if (!data?.tasks) return [];
    return data.tasks.filter((task: Task) => isSameDay(new Date(task.dueDate), day));
  };

  const handleShowAllTasks = (day: Date, tasks: Task[]) => {
    setSelectedDate(day);
    setSelectedDayTasks(tasks);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDayTasks([]);
    setSelectedDate(null);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    handleCloseModal();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return <Typography>Loading calendar...</Typography>;
  }

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          gap={1}
          mb={2}
        >
          {weekDays.map((day) => (
            <Box key={day} textAlign="center">
              <Typography variant="subtitle2" fontWeight="bold">
                {day}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          gap={1}
        >
          {days.map((day) => {
            const tasksForDay = getTasksForDay(day);
            const isCurrentMonth = day.getMonth() === selectedMonth.getMonth();
            const isToday = isSameDay(day, new Date());

            return (
              <Paper
                key={day.toISOString()}
                elevation={1}
                sx={{
                  minHeight: 100,
                  p: 1,
                  backgroundColor: isToday ? 'primary.light' : 'background.paper',
                  opacity: isCurrentMonth ? 1 : 0.5,
                  cursor: tasksForDay.length > 0 ? 'pointer' : 'default',
                  '&:hover': {
                    backgroundColor: tasksForDay.length > 0 ? 'action.hover' : undefined,
                  },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={isToday ? 'bold' : 'normal'}
                  color={isToday ? 'primary.contrastText' : 'text.primary'}
                  mb={1}
                >
                  {format(day, 'd')}
                </Typography>

                <Stack spacing={0.5}>
                  {tasksForDay.slice(0, 3).map((task) => (
                    <Badge
                      key={task.id}
                      variant="dot"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: getCategoryColor(task.category),
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                        onClick={() => setSelectedTaskId(task.id)}
                      >
                        {task.title}
                      </Typography>
                    </Badge>
                  ))}
                  {tasksForDay.length > 3 && (
                    <Typography 
                      variant="caption" 
                      color="primary"
                      sx={{ 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowAllTasks(day, tasksForDay);
                      }}
                    >
                      +{tasksForDay.length - 3} more
                    </Typography>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </Box>
      </Paper>

      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Tasks for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {selectedDayTasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                onClick={() => handleTaskClick(task.id)}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight="medium">
                        {task.title}
                      </Typography>
                      <Badge
                        variant="dot"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: getCategoryColor(task.category),
                          },
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Stack direction="row" spacing={1} mt={0.5}>
                      <Chip 
                        label={getCategoryLabel(task.category)} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getCategoryColor(task.category),
                          color: 'white',
                          fontSize: '0.7rem',
                        }}
                      />
                      <Chip 
                        label={`Priority: ${getPriorityLabel(task.priority)}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
