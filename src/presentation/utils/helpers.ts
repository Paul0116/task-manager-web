import type { TaskCategory } from '@/domain/entities/Task';

export const getCategoryColor = (category: TaskCategory): string => {
  const colors: Record<TaskCategory, string> = {
    WORK: '#1976d2',
    PERSONAL: '#9c27b0',
    HEALTH: '#2e7d32',
    EDUCATION: '#ed6c02',
    SHOPPING: '#0288d1',
  };
  return colors[category] || '#757575';
};

export const getPriorityColor = (priority: number): string => {
  const colors: Record<number, string> = {
    1: '#9e9e9e',
    2: '#4caf50',
    3: '#2196f3',
    4: '#ff9800',
    5: '#f44336',
  };
  return colors[priority] || '#757575';
};

export const getPriorityLabel = (priority: number): string => {
  const labels: Record<number, string> = {
    1: 'Very Low',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Very High',
  };
  return labels[priority] || 'Unknown';
};

export const getCategoryLabel = (category: TaskCategory): string => {
  return category.charAt(0) + category.slice(1).toLowerCase();
};
