import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user.email}</span>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <UserIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}