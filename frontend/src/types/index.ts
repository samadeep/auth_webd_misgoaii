export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  weight: number;
  priorityScore: number;
  parentTask?: string;
  user: string;
  order: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date;
  weight: number;
  parentTask?: string;
  isCompleted?: boolean;
}

export interface TaskReorderData {
  taskIds: string[];
} 