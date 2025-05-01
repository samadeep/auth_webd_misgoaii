import express, { Router, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTopPriorityTasks,
  reorderTasks
} from '../controllers/taskController';

const router: Router = express.Router();

// All routes require authentication
router.use(auth);

// Task routes
router.post('/', createTask as RequestHandler);
router.get('/', getTasks as RequestHandler);
router.get('/top', getTopPriorityTasks as RequestHandler);
router.get('/:id', getTask as RequestHandler);
router.patch('/:id', updateTask as RequestHandler);
router.delete('/:id', deleteTask as RequestHandler);
router.post('/reorder', reorderTasks as RequestHandler);

export default router; 