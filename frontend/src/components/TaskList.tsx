import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { DragHandle, Delete, Edit } from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { Task } from '../types';
import { tasksAPI } from '../services/api';
import { toast } from 'react-toastify';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdate }) => {
  const handleToggleComplete = async (task: Task) => {
    try {
      await tasksAPI.updateTask(task._id, {
        isCompleted: !task.isCompleted,
      });
      onTaskUpdate();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await tasksAPI.deleteTask(taskId);
      onTaskUpdate();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getPriorityColor = (priorityScore: number) => {
    if (priorityScore > 0.8) return 'error';
    if (priorityScore > 0.5) return 'warning';
    return 'success';
  };

  return (
    <List>
      {tasks.map((task, index) => (
        <Draggable key={task._id} draggableId={task._id} index={index}>
          {(provided) => (
            <ListItem
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              divider
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Checkbox
                edge="start"
                checked={task.isCompleted}
                onChange={() => handleToggleComplete(task)}
              />
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: task.isCompleted ? 'line-through' : 'none',
                      color: task.isCompleted ? 'text.secondary' : 'text.primary',
                    }}
                  >
                    {task.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <Chip
                        size="small"
                        label={`Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`}
                        color={new Date(task.dueDate) < new Date() ? 'error' : 'default'}
                      />
                      <Chip
                        size="small"
                        label={`Priority: ${task.weight}/5`}
                        color={getPriorityColor(task.priorityScore)}
                      />
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDelete(task._id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </Draggable>
      ))}
    </List>
  );
};

export default TaskList; 