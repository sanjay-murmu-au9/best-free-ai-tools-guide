# AI Tools Hub Backend

Complete backend API for the AI Tools Hub application with both database and mock data support.

## Features

- 🔐 Authentication with Supabase Auth
- 📊 CRUD operations for tools, categories, reviews, and favorites
- 🛡️ Security middleware (Helmet, CORS, Rate Limiting)
- 📝 Mock data endpoints for frontend development
- ✅ Input validation with express-validator
- 🗄️ Supabase integration for production data

## API Endpoints

### Mock Data Endpoints (for development)
- `GET /api/mock/tools` - Get all tools from mock data
- `GET /api/mock/tools/:id` - Get tool by ID from mock data
- `GET /api/mock/categories` - Get all categories from mock data
- `GET /api/mock/tools/category/:categoryId` - Get tools by category from mock data

### Database Endpoints (production)
- `GET /api/tools` - Get all tools from database
- `GET /api/tools/:id` - Get tool by ID from database
- `GET /api/categories` - Get all categories from database
- `POST /api/reviews/tool/:toolId` - Create a review (auth required)
- `GET /api/favorites` - Get user's favorites (auth required)

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```bash
   # .env file is already configured with your Supabase credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Test the API:**
   ```bash
   # Health check
   curl http://localhost:5000/api/health
   
   # Get mock tools
   curl http://localhost:5000/api/mock/tools
   
   # Get mock categories
   curl http://localhost:5000/api/mock/categories
   ```

## Frontend Integration

Your frontend can now use either:

**Mock Data (for development):**
```javascript
// Get tools from mock data
fetch('http://localhost:5000/api/mock/tools')

// Get categories from mock data  
fetch('http://localhost:5000/api/mock/categories')
```

**Database (for production):**
```javascript
// Get tools from database
fetch('http://localhost:5000/api/tools')

// Get categories from database
fetch('http://localhost:5000/api/categories')
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Supabase configuration
│   ├── controllers/     # Business logic
│   ├── data/           # Mock data
│   ├── lib/            # Utilities
│   ├── middleware/     # Auth & validation
│   ├── routes/         # API endpoints
│   ├── types/          # TypeScript interfaces
│   └── server.ts       # Main server file
├── .env                # Environment variables
├── package.json
└── README.md
```

## Environment Variables

```bash
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://digldzbwgoqnwuhpdjuw.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=ai-tools-hub-super-secret-jwt-key-2024
FRONTEND_URL=http://localhost:5173
```

Your backend is now completely independent and can serve your frontend with all the data it needs!