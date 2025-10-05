import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { favoritesService } from '../lib/database';
import ToolCard from '../components/ToolCard';
import { Favorite } from '../types';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      if (user) {
        const data = await favoritesService.getUserFavorites(user.id);
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view favorites</h1>
          <p className="text-gray-600">You need to be signed in to save and view your favorite tools.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Favorite Tools</h1>
          <p className="text-gray-600">
            {favorites.length} saved tools
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No favorite tools yet</p>
            <p className="text-gray-400">Start exploring and save tools you love!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(favorite => (
              <ToolCard key={favorite.id} tool={favorite.tool!} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}