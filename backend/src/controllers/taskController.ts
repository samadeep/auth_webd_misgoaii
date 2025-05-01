import { Request, Response, NextFunction } from 'express';
import { Task, ITask } from '../models/Task';

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, dueDate, weight, parentTask } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      weight,
      parentTask,
      user: req.user?._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find({ user: req.user?._id })
      .sort({ priorityScore: -1 })
      .populate('parentTask');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user?._id
    }).populate('parentTask');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'dueDate', 'weight', 'parentTask', 'isCompleted', 'order'] as const;
    const isValidOperation = updates.every(update => allowedUpdates.includes(update as typeof allowedUpdates[number]));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    updates.forEach(update => {
      const key = update as keyof ITask;
      if (key in task) {
        (task as any)[key] = req.body[key];
      }
    });
    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete all subtasks
    await Task.deleteMany({ parentTask: req.params.id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTopPriorityTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find({
      user: req.user?._id,
      isCompleted: false
    })
      .sort({ priorityScore: -1 })
      .limit(5)
      .populate('parentTask');

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const reorderTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { taskIds } = req.body;

    const updatePromises = taskIds.map((taskId: string, index: number) => {
      return Task.findOneAndUpdate(
        { _id: taskId, user: req.user?._id },
        { order: index },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    next(error);
  }
}; 