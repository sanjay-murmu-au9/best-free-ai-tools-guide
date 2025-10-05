import { useState, useEffect } from 'react';
import CategorySection from '../components/CategorySection';
import { api } from '../lib/api';
import { Tool, Category } from '../types';

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toolsData, categoriesData] = await Promise.all([
          api.getTools(),
          api.getCategories()
        ]);
        setTools(toolsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toolsByCategory = categories.map(category => ({
    category,
    tools: tools.filter(tool => tool.category?.id === category.id)
  })).filter(item => item.tools.length > 0);

  const selectedCategoryData = selectedCategory 
    ? toolsByCategory.find(item => item.category.id === selectedCategory)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h1>
          <p className="text-gray-600">Explore AI tools organized by their primary use cases</p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {selectedCategoryData ? (
          <CategorySection
            category={selectedCategoryData.category}
            tools={selectedCategoryData.tools}
          />
        ) : (
          toolsByCategory.map(({ category, tools }) => (
            <CategorySection
              key={category.id}
              category={category}
              tools={tools}
            />
          ))
        )}
      </div>
    </div>
  );
}