import express from 'express';
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authenticateToken } from '../middleware/auth';
import { ApiResponse, Favorite } from '../types';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// GET /api/favorites - Get user's favorites
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        tool:tools(*, category:categories(*))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const response: ApiResponse<any[]> = {
      success: true,
      data: data || []
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/favorites/:toolId - Toggle favorite
router.post('/:toolId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { toolId } = req.params;
    const userId = req.user?.id;

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('tool_id', toolId)
      .single();

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      if (error) throw error;

      res.json({
        success: true,
        data: { favorited: false },
        message: 'Removed from favorites'
      });
    } else {
      // Add favorite
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          tool_id: toolId
        })
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: { favorited: true, favorite: data },
        message: 'Added to favorites'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/favorites/:toolId - Remove favorite
router.delete('/:toolId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { toolId } = req.params;
    const userId = req.user?.id;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('tool_id', toolId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;