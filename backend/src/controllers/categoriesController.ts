import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { ApiResponse, Category } from '../types';

export const getAllCategories = async (req: Request, res: Response) => {
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

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    const response: ApiResponse<any> = {
      success: true,
      data: data
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};