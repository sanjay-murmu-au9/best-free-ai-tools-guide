import express from 'express';
import { getAllTools, getToolById, getToolsByCategory } from '../controllers/toolsController';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();

// GET /api/tools - Get all tools with optional filtering
router.get('/', optionalAuth, getAllTools);

// GET /api/tools/:id - Get tool by ID
router.get('/:id', optionalAuth, getToolById);

// GET /api/tools/category/:categoryId - Get tools by category
router.get('/category/:categoryId', optionalAuth, getToolsByCategory);

export default router;