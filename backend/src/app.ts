import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Types
interface Tool {
  id: string;
  name: string;
  description: string;
  category_id: string;
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

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}



// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Express App Setup
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Controllers
const getAllTools = async (req: express.Request, res: express.Response) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    
    let query = supabase
      .from('tools')
      .select(`
        *,
        categories!inner(id, name, slug)
      `);

    if (category) {
      query = query.eq('categories.slug', category);
    }

    if (search) {
      const searchTerm = search as string;
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data: tools, error } = await query
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;

    const response: ApiResponse<any[]> = {
      success: true,
      data: tools?.map(tool => ({
        ...tool,
        category: tool.categories
      })) || []
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getToolById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    const { data: tool, error } = await supabase
      .from('tools')
      .select(`
        *,
        categories!inner(id, name, slug)
      `)
      .eq('id', id)
      .single();

    if (error || !tool) {
      return res.status(404).json({ success: false, error: 'Tool not found' });
    }

    const response: ApiResponse<any> = {
      success: true,
      data: {
        ...tool,
        category: tool.categories
      }
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllCategories = async (req: express.Request, res: express.Response) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');

    if (error) throw error;

    const response: ApiResponse<any[]> = {
      success: true,
      data: categories || []
    };
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getToolsByCategory = async (req: express.Request, res: express.Response) => {
  try {
    const { categoryId } = req.params;
    const { limit = 20 } = req.query;

    const { data: tools, error } = await supabase
      .from('tools')
      .select(`
        *,
        categories!inner(id, name, slug)
      `)
      .eq('category_id', categoryId)
      .order('rating', { ascending: false })
      .limit(Number(limit));

    if (error) throw error;

    const response: ApiResponse<any[]> = {
      success: true,
      data: tools?.map(tool => ({
        ...tool,
        category: tool.categories
      })) || []
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI Tools Hub API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tools: '/api/tools',
      categories: '/api/categories'
    }
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Tools Hub API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/tools', getAllTools);
app.get('/api/tools/:id', getToolById);
app.get('/api/categories', getAllCategories);
app.get('/api/tools/category/:categoryId', getToolsByCategory);

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
    }
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({ email })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ success: false, error: 'Email already subscribed' });
      }
      throw error;
    }
    res.json({ success: true, message: 'Successfully subscribed to newsletter', data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Tools Hub API running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

export default app;