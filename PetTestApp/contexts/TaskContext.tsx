import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: number;
  title: string;
  time: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  toggleTask: (taskId: number) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  loadTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'tasks';

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // 使用 useCallback 优化函数性能
  const loadTasks = useCallback(async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        // Initialize with default tasks
        const defaultTasks = [
          {
            id: 1,
            title: 'Morning Medicine',
            time: '8:00 AM',
            icon: 'pills',
            iconBg: '#F3E8FF',
            iconColor: '#9061F9',
            completed: false,
          },
          {
            id: 2,
            title: 'Afternoon Walk',
            time: '4:30 PM',
            icon: 'walking',
            iconBg: '#E3F2FD',
            iconColor: '#2196F3',
            completed: false,
          },
          {
            id: 3,
            title: 'Bath Time',
            time: '7:00 PM',
            icon: 'bath',
            iconBg: '#FFF3E0',
            iconColor: '#FF9800',
            completed: false,
          },
        ];
        setTasks(defaultTasks);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, []);

  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = {
        ...task,
        id: Date.now(),
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [tasks]);

  const toggleTask = useCallback(async (taskId: number) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }, [tasks]);

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [tasks]);

  // 初始化加载任务
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // 监听任务变化并保存到本地存储
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    };
    saveTasks();
  }, [tasks]);

  const value = {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    loadTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
} 