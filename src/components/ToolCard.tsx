import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Tool } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { favoritesService } from '../lib/database';

interface ToolCardProps {
  tool: Tool;
  isFavorite?: boolean;
}

export default function ToolCard({ tool, isFavorite = false }: ToolCardProps) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    
    setLoading(true);
    try {
      const newState = await favoritesService.toggle(tool.id);
      setFavorited(newState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < Math.floor(rating) ? (
          <StarIconSolid className="w-4 h-4 text-yellow-400" />
        ) : (
          <StarIcon className="w-4 h-4 text-gray-300" />
        )}
      </span>
    ));
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'Free': return 'bg-green-100 text-green-800';
      case 'Freemium': return 'bg-blue-100 text-blue-800';
      case 'Paid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/tool/${tool.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 p-4 sm:p-6 cursor-pointer">
        {/* Header with Logo and Favorite */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl shadow-sm border flex items-center justify-center flex-shrink-0 overflow-hidden">
              {tool.logo_url ? (
                <img 
                  src={tool.logo_url} 
                  alt={`${tool.name} logo`}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`${tool.logo_url ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center rounded-xl`}>
                <span className="text-white font-bold text-lg sm:text-xl">{tool.name.charAt(0)}</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPricingColor(tool.pricing)}`}>
                {tool.pricing}
              </span>
            </div>
          </div>
          <button 
            onClick={handleFavoriteToggle}
            disabled={!user || loading}
            className={`p-2 transition-colors flex-shrink-0 rounded-full hover:bg-gray-100 ${
              favorited 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-red-500'
            } disabled:opacity-50`}
          >
            {favorited ? (
              <HeartIconSolid className="w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {tool.category.name}
          </span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(tool.rating)}</div>
            <span className="text-sm text-gray-600 font-medium">{tool.rating}</span>
            <span className="text-sm text-gray-500">({tool.review_count} reviews)</span>
          </div>
          <div className="text-blue-600 group-hover:text-blue-700 text-sm font-medium flex items-center">
            Explore
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}