import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  weight: number;
  priorityScore: number;
  parentTask?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  order: number;
  isCompleted: boolean;
  calculatePriorityScore(): void;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  priorityScore: {
    type: Number,
    default: 0
  },
  parentTask: {
    type: Schema.Types.ObjectId,
    ref: 'Task'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate priority score based on weight and days until due
taskSchema.methods.calculatePriorityScore = function() {
  const now = new Date();
  const daysUntilDue = Math.ceil((this.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Priority score formula: weight * (1 / (daysUntilDue + 1))
  // Adding 1 to daysUntilDue to avoid division by zero
  this.priorityScore = this.weight * (1 / (daysUntilDue + 1));
};

// Calculate priority score before saving
taskSchema.pre('save', function(next) {
  this.calculatePriorityScore();
  next();
});

// Index for efficient querying
taskSchema.index({ user: 1, priorityScore: -1 });
taskSchema.index({ user: 1, dueDate: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema); 