import { supabase } from './supabase';
import { Tool, Review, Favorite } from '../types';

export const toolsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tool[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Tool;
  },

  async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('category_id', categoryId);
    
    if (error) throw error;
    return data as Tool[];
  }
};

export const reviewsService = {
  async getByTool(toolId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(email)
      `)
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Review[];
  },

  async create(toolId: string, rating: number, comment: string) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        tool_id: toolId,
        rating,
        comment,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const favoritesService = {
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        tool:tools(*, category:categories(*))
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as Favorite[];
  },

  async toggle(toolId: string) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { data: existing } = await supabase
      .from('favorites')
      .select()
      .eq('user_id', user.id)
      .eq('tool_id', toolId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          tool_id: toolId
        });
      if (error) throw error;
      return true;
    }
  }
};