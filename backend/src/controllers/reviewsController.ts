import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { ApiResponse, Review } from '../types';

interface AuthRequest extends Request {
  user?: any;
}

export const getReviewsByTool = async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

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
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { toolId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // Check if user already reviewed this tool
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('tool_id', toolId)
      .eq('user_id', userId)
      .single();

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this tool'
      });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        tool_id: toolId,
        user_id: userId,
        rating,
        comment
      })
      .select()
      .single();

    if (error) throw error;

    // Update tool rating
    await updateToolRating(toolId);

    const response: ApiResponse<any> = {
      success: true,
      data: data,
      message: 'Review created successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { data, error } = await supabase
      .from('reviews')
      .update({ rating, comment })
      .eq('id', reviewId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or unauthorized'
      });
    }

    // Update tool rating
    await updateToolRating(data.tool_id);

    const response: ApiResponse<any> = {
      success: true,
      data: data,
      message: 'Review updated successfully'
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { data, error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or unauthorized'
      });
    }

    // Update tool rating
    await updateToolRating(data.tool_id);

    const response: ApiResponse = {
      success: true,
      message: 'Review deleted successfully'
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

async function updateToolRating(toolId: string) {
  try {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('tool_id', toolId);

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await supabase
        .from('tools')
        .update({
          rating: Math.round(avgRating * 10) / 10,
          review_count: reviews.length
        })
        .eq('id', toolId);
    }
  } catch (error) {
    console.error('Error updating tool rating:', error);
  }
}