import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  garmentSrc: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  resultUrl?: string;
  createdAt: number;
}

interface TaskState {
  tasks: Record<string, Task>;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  clearCompletedTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: {},
      addTask: (task) => set((state) => ({
        tasks: { ...state.tasks, [task.id]: task }
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: {
          ...state.tasks,
          [id]: { ...state.tasks[id], ...updates },
        },
      })),
      removeTask: (id) => set((state) => {
        const newTasks = { ...state.tasks };
        delete newTasks[id];
        return { tasks: newTasks };
      }),
      clearCompletedTasks: () => set((state) => {
        const activeTasks: Record<string, Task> = {};
        Object.entries(state.tasks).forEach(([id, task]) => {
          if (task.status === 'PENDING' || task.status === 'PROCESSING') {
            activeTasks[id] = task;
          }
        });
        return { tasks: activeTasks };
      }),
    }),
    { name: 'ai-fashion-tasks' }
  )
);

