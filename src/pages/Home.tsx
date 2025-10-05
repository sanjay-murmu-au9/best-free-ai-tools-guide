import { useState, useMemo, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ToolCard from '../components/ToolCard';
import Newsletter from '../components/Newsletter';
import { mockTools, categories as mockCategories } from '../lib/mockData';
import { Tool, Category } from '../types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using mock data temporarily
    setTools(mockTools);
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || tool.category?.id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Discover the Best AI Tools
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 px-4">
            Find the perfect AI tools for writing, image generation, coding, and more
          </p>
          <div className="max-w-2xl mx-auto px-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for AI tools..."
            />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading tools...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {selectedCategory 
                    ? `${categories.find(c => c.id === selectedCategory)?.name} Tools` 
                    : searchQuery 
                    ? 'Search Results'
                    : 'All AI Tools'
                  }
                </h2>
                <p className="text-gray-600">
                  {searchQuery 
                    ? `${filteredTools.length} tools found for "${searchQuery}"`
                    : `${filteredTools.length} tools found`
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchQuery 
                      ? `No tools found matching "${searchQuery}".`
                      : 'No tools found matching your criteria.'
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}