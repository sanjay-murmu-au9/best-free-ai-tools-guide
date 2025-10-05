import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { ApiResponse } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const getTools = async (req: Request, res: Response) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('tools')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      const searchTerm = search as string;
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data, error } = await query;

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

export const getToolById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Tool not found'
        });
      }
      throw error;
    }

    const response: ApiResponse<any> = {
      success: true,
      data
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

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

export const getToolsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { limit = 20 } = req.query;

    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('category_id', categoryId)
      .order('rating', { ascending: false })
      .limit(Number(limit));

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