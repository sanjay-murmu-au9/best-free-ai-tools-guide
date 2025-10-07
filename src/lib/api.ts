/// <reference types="vite/client" />
const API_BASE_URL = 'http://localhost:5000/api';
const SUPABASE_FUNCTIONS_URL = 'https://digldzbwgoqnwuhpdjuw.supabase.co/functions/v1';

const getHeaders = () => ({
  'Content-Type': 'application/json'
});

const getSupabaseHeaders = () => {
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ2xkemJ3Z29xbnd1aHBkanV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODc1MjYsImV4cCI6MjA3NDY2MzUyNn0.qVYryQjm8fpvnrA8TMl6DrP_NQREx3vaD518LClY6J8';

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${anonKey}`,
    'apikey': anonKey
  };
};

export const api = {
  async getTools(params?: string) {
    const url = params ? `${API_BASE_URL}/tools?${params}` : `${API_BASE_URL}/tools`;
    const response = await fetch(url, { headers: getHeaders() });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async getToolById(id: string) {
    const response = await fetch(`${API_BASE_URL}/tools/${id}`, { headers: getHeaders() });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders() });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async getToolsByCategory(categoryId: string) {
    const response = await fetch(`${API_BASE_URL}/tools/category/${categoryId}`, { headers: getHeaders() });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async subscribeNewsletter(email: string) {
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/newsletter`, {
      method: 'POST',
      headers: getSupabaseHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!response.ok && response.status !== 409) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  }
};