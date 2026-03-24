import { useEffect, useRef } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { toast } from 'sonner';

/**
 * Hook to poll for AI task status updates.
 */
export function useTaskPolling() {
  const { tasks, updateTask } = useTaskStore();
  const pollingIntervals = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    // Start polling for PENDING or PROCESSING tasks
    const activeTasks = Object.values(tasks).filter(
      (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
    );

    activeTasks.forEach((task) => {
      if (pollingIntervals.current[task.id]) return;

      console.log(`📡 [Polling] Started for task: ${task.id}`);

      const interval = setInterval(() => {
        // Use functional updater pattern to always read the latest state
        const currentTask = useTaskStore.getState().tasks[task.id];
        if (!currentTask) {
          clearInterval(interval);
          delete pollingIntervals.current[task.id];
          return;
        }

        const nextProgress = Math.min((currentTask.progress || 0) + 10, 100);
        const isDone = nextProgress >= 100;

        updateTask(task.id, {
          progress: nextProgress,
          status: isDone ? 'COMPLETED' : 'PROCESSING',
          resultUrl: isDone ? '/images/result-model.jpg' : undefined,
        });

        if (isDone) {
          console.log(`✅ [Polling] Task ${task.id} completed.`);
          toast.success('AI 生成作品已完成！');
          clearInterval(interval);
          delete pollingIntervals.current[task.id];
        }
      }, 3000);

      pollingIntervals.current[task.id] = interval;
    });

    // Cleanup: clear intervals for tasks that are no longer active
    return () => {
      Object.keys(pollingIntervals.current).forEach((id) => {
        const t = tasks[id];
        if (!t || t.status === 'COMPLETED' || t.status === 'FAILED') {
          clearInterval(pollingIntervals.current[id]);
          delete pollingIntervals.current[id];
        }
      });
    };
  }, [tasks, updateTask]);

  // Global cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(pollingIntervals.current).forEach(clearInterval);
      pollingIntervals.current = {};
    };
  }, []);
}

