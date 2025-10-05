import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { reviewsService } from '../lib/database';
import { Review } from '../types';

interface ReviewSectionProps {
  toolId: string;
}

export default function ReviewSection({ toolId }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [toolId]);

  const loadReviews = async () => {
    try {
      const data = await reviewsService.getByTool(toolId);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      await reviewsService.create(toolId, rating, comment);
      setComment('');
      setRating(5);
      setShowForm(false);
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type={interactive ? 'button' : undefined}
        onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
        className={interactive ? 'cursor-pointer' : 'cursor-default'}
      >
        {i < rating ? (
          <StarIconSolid className="w-5 h-5 text-yellow-400" />
        ) : (
          <StarIcon className="w-5 h-5 text-gray-300" />
        )}
      </button>
    ));
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reviews ({reviews.length})</h2>
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Write Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-4 border rounded-lg bg-gray-50">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-1">
              {renderStars(rating, true, setRating)}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Share your experience with this tool..."
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{review.user.email}</span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}