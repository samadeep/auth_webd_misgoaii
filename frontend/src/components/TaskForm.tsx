import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TaskFormData } from '../types';
import { tasksAPI } from '../services/api';
import { toast } from 'react-toastify';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  initialData?: TaskFormData;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onTaskCreated,
  initialData,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || new Date(),
    weight: initialData?.weight || 1,
    parentTask: initialData?.parentTask,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tasksAPI.createTask(formData);
      toast.success('Task created successfully');
      onTaskCreated();
      onClose();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleTextChange = (field: keyof TaskFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSelectChange = (field: keyof TaskFormData) => (
    e: SelectChangeEvent<number>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleTextChange('title')}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleTextChange('description')}
              multiline
              rows={3}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, dueDate: date || new Date() }))
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Priority Weight</InputLabel>
              <Select
                value={formData.weight}
                onChange={handleSelectChange('weight')}
                label="Priority Weight"
              >
                {[1, 2, 3, 4, 5].map((weight) => (
                  <MenuItem key={weight} value={weight}>
                    {weight}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; 