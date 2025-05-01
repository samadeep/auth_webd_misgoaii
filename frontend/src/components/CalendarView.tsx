import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onTaskUpdate: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), date));
  };

  const getPriorityColor = (priorityScore: number) => {
    if (priorityScore > 0.8) return 'error';
    if (priorityScore > 0.5) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {format(today, 'MMMM yyyy')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
        }}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Typography
            key={day}
            variant="subtitle2"
            align="center"
            sx={{ fontWeight: 'bold', p: 1 }}
          >
            {day}
          </Typography>
        ))}
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          return (
            <Paper
              key={day.toISOString()}
              elevation={1}
              sx={{
                p: 1,
                minHeight: 100,
                bgcolor: isSameDay(day, today) ? 'action.selected' : 'background.paper',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isSameDay(day, today) ? 'primary.main' : 'text.primary',
                  fontWeight: isSameDay(day, today) ? 'bold' : 'normal',
                }}
              >
                {format(day, 'd')}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {dayTasks.map((task) => (
                  <Chip
                    key={task._id}
                    label={task.title}
                    size="small"
                    color={getPriorityColor(task.priorityScore)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default CalendarView; 