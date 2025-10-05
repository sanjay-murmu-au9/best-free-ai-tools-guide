import express from 'express';
import { getAllCategories, getCategoryById } from '../controllers/categoriesController';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', getAllCategories);

// GET /api/categories/:id - Get category by ID
router.get('/:id', getCategoryById);

export default router;