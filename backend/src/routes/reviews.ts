import express from 'express';
import { getReviewsByTool, createReview, updateReview, deleteReview } from '../controllers/reviewsController';
import { authenticateToken } from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();

// GET /api/reviews/tool/:toolId - Get reviews for a tool
router.get('/tool/:toolId', getReviewsByTool);

// POST /api/reviews/tool/:toolId - Create a review for a tool
router.post('/tool/:toolId', 
  authenticateToken,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters')
  ],
  createReview
);

// PUT /api/reviews/:reviewId - Update a review
router.put('/:reviewId',
  authenticateToken,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters')
  ],
  updateReview
);

// DELETE /api/reviews/:reviewId - Delete a review
router.delete('/:reviewId', authenticateToken, deleteReview);

export default router;