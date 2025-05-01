import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config/config';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
}); 