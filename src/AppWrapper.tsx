import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ToolDetailPage from './pages/ToolDetail';
import Newsletter from './components/Newsletter';
import { supabase } from './lib/supabase';

// Types
interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  website_url: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  features: string[];
  logo_url?: string;
  rating: number;
  review_count: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
}

// API Service
const API_BASE_URL = 'https://digldzbwgoqnwuhpdjuw.supabase.co/functions/v1';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ2xkemJ3Z29xbnd1aHBkanV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODc1MjYsImV4cCI6MjA3NDY2MzUyNn0.qVYryQjm8fpvnrA8TMl6DrP_NQREx3vaD518LClY6J8';

class ApiService {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  }
}

const apiService = new ApiService();

// Data Hooks
const useTools = (searchQuery: string, selectedCategory: string | null) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory) params.append('category', selectedCategory);
        
        const data = await apiService.get<Tool[]>(`/tools?${params.toString()}`);
        setTools(data);
      } catch (err) {
        console.error('Failed to fetch tools:', err);
        setTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [searchQuery, selectedCategory]);

  return { tools, loading };
};

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.get<Category[]>('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};



// Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      // User will be redirected to Google, then back to your app
      // The user state will be updated automatically by the auth listener
    } catch (error) {
      console.error('Google sign in failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Components
const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">AI Tools Hub</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/categories" className="text-gray-700 hover:text-blue-600">Categories</Link>
            <Link to="/favorites" className="text-gray-700 hover:text-blue-600">Favorites</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user.email}</span>
                <button onClick={signOut} className="text-sm text-gray-600 hover:text-gray-800">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </header>
  );
};

const AuthModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Welcome to AI Tools Hub</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">Sign in to save your favorite tools and leave reviews</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

const SearchBar: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = ({ 
  value, onChange, placeholder = "Search AI tools..." 
}) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        style={{ color: '#111827' }}
        placeholder={placeholder}
      />
    </div>
  );
};

const CategoryFilter: React.FC<{
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}> = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            selectedCategory === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const [favorited, setFavorited] = useState(false);
  const { user } = useAuth();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
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
              <div className={`w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center rounded-xl ${tool.logo_url ? 'hidden' : 'flex'}`}>
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (user) setFavorited(!favorited);
            }}
            className={`p-2 transition-colors flex-shrink-0 rounded-full hover:bg-gray-100 ${
              favorited ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {favorited ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {tool.category.name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(tool.rating)}</div>
            <span className="text-sm text-gray-600 font-medium">{tool.rating}</span>
            <span className="text-sm text-gray-500">({tool.review_count} reviews)</span>
          </div>
          <div className="text-blue-600 group-hover:text-blue-700 text-sm font-medium flex items-center">
            Explore →
          </div>
        </div>
      </div>
    </Link>
  );
};



// Pages
const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories, loading: categoriesLoading } = useCategories();
  const { tools, loading: toolsLoading } = useTools(searchQuery, selectedCategory);

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
          {!categoriesLoading && (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                ? `${tools.length} tools found for "${searchQuery}"`
                : `${tools.length} tools found`
              }
            </p>
          </div>

          {toolsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tools...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>

              {tools.length === 0 && (
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

      <Newsletter />
    </div>
  );
};



const Categories: React.FC = () => {
  const { categories, loading } = useCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h1>
          <p className="text-gray-600">Explore AI tools organized by their primary use cases</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">Explore tools in this category</p>
                <Link
                  to={`/?category=${category.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Explore {category.name} Tools →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Favorites: React.FC = () => {
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Favorite Tools</h1>
          <p className="text-gray-600">0 saved tools</p>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No favorite tools yet</p>
          <p className="text-gray-400">Start exploring and save tools you love!</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const AppWrapper: React.FC = () => {
  return (
    <AuthProvider>
      <Router basename="/best-free-ai-tools-guide" future={{ v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tool/:id" element={<ToolDetailPage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default AppWrapper;