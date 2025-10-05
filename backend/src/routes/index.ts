import express from 'express';
import { getTools, getToolById, getCategories, getToolsByCategory } from '../controllers/databaseController';
import { subscribeNewsletter } from '../controllers/newsletterController';

const router = express.Router();

// Main API Routes (using database)
router.get('/tools', getTools);
router.get('/tools/:id', getToolById);
router.get('/categories', getCategories);
router.get('/tools/category/:categoryId', getToolsByCategory);

// Newsletter subscription
router.post('/newsletter', subscribeNewsletter);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Tools Hub API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;