import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting (disabled for development)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    }
  });
  app.use('/api/', limiter);
}

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI Tools Hub API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tools: '/api/tools',
      categories: '/api/categories',
      reviews: '/api/reviews',
      favorites: '/api/favorites'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Tools Hub API running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

export default app;