import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import { Task } from '../types';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import CalendarView from '../components/CalendarView';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [topTasks, setTopTasks] = useState<Task[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      const [allTasks, priorityTasks] = await Promise.all([
        tasksAPI.getTasks(),
        tasksAPI.getTopPriorityTasks(),
      ]);
      setTasks(allTasks);
      setTopTasks(priorityTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);

    try {
      await tasksAPI.reorderTasks({
        taskIds: items.map((task) => task._id),
      });
    } catch (error) {
      toast.error('Failed to reorder tasks');
      fetchTasks(); // Revert changes on error
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" component="h1">
                Welcome, {user?.name}!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsFormOpen(true)}
              >
                Add New Task
              </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="List View" />
                <Tab label="Calendar View" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="tasks">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Top Priority Tasks
                    </Typography>
                    <TaskList tasks={topTasks} onTaskUpdate={fetchTasks} />
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <CalendarView tasks={tasks} onTaskUpdate={fetchTasks} />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onTaskCreated={fetchTasks}
      />
    </Container>
  );
};

export default Dashboard; 