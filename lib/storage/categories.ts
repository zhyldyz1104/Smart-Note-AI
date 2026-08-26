export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const Categories: Category[] = [
  { id: 'general', name: 'General', color: '#a855f7', icon: '📝' },
  { id: 'study', name: 'Study', color: '#ec4899', icon: '📚' },
  { id: 'work', name: 'Work', color: '#9333ea', icon: '💼' },
  { id: 'ideas', name: 'Ideas', color: '#f472b6', icon: '💡' },
  { id: 'personal', name: 'Personal', color: '#c084fc', icon: '🌸' },
  { id: 'research', name: 'Research', color: '#7e22ce', icon: '🔬' },
];

export function getCategoryById(id: string): Category | undefined {
  return Categories.find((c) => c.id === id);
}