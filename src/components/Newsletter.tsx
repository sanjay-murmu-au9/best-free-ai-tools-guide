import { useState } from 'react';
import { api } from '../lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await api.subscribeNewsletter(email);
      console.log('Newsletter API response:', data);
      
      if (data.success) {
        setMessage('Successfully subscribed to our newsletter!');
        setEmail('');
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        if (data.error === 'Email already subscribed') {
          setMessage('You are already subscribed!');
        } else {
          setMessage(data.error || 'An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
          Stay Updated with the Latest AI Tools
        </h2>
        <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-4">
          Get weekly updates on new AI tools, reviews, and industry insights
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>
        
        {message && (
          <p className={`mt-4 ${message.includes('error') ? 'text-red-200' : 'text-green-200'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}