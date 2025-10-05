import { Tool, Category } from '../types';
import ToolCard from './ToolCard';

interface CategorySectionProps {
  category: Category;
  tools: Tool[];
}

export default function CategorySection({ category, tools }: CategorySectionProps) {
  if (tools.length === 0) return null;

  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, string> = {
      'Writing': '✍️',
      'Image Generation': '🎨',
      'Coding': '💻',
      'Video Editing': '🎬',
      'Audio': '🎵',
      'Productivity': '⚡',
      'Research': '🔍'
    };
    return icons[categoryName] || '🤖';
  };

  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <div className="text-3xl mr-3">{getCategoryIcon(category.name)}</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
          <p className="text-gray-600">{tools.length} tools available</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.slice(0, 6).map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      
      {tools.length > 6 && (
        <div className="text-center mt-6">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View all {tools.length} {category.name.toLowerCase()} tools →
          </button>
        </div>
      )}
    </div>
  );
}