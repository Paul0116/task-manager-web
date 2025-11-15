import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
} from '@mui/material';
import {
  List as ListIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { format, addMonths, subMonths } from 'date-fns';
import { TaskCalendar } from '../components/TaskCalendar';
import { TaskDrawer } from '../components/TaskDrawer';
import { TaskForm } from '../components/TaskForm';

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    setSelectedMonth(new Date());
  };

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/')}>
            <ListIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Typography variant="h4" component="h1">
              Calendar View
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton onClick={handlePreviousMonth} size="large">
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
                {format(selectedMonth, 'MMMM yyyy')}
              </Typography>
              <IconButton onClick={handleNextMonth} size="large">
                <ChevronRightIcon />
              </IconButton>
              <Button variant="outlined" onClick={handleToday}>
                Today
              </Button>
            </Stack>
          </Stack>
        </Box>

        <TaskCalendar selectedMonth={selectedMonth} />
      </Container>

      <TaskForm />
      <TaskDrawer />
    </>
  );
};
