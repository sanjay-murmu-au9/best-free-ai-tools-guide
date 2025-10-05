const API_BASE_URL = 'https://digldzbwgoqnwuhpdjuw.supabase.co/functions/v1';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
};

export const api = {
  async getTools() {
    const response = await fetch(`${API_BASE_URL}/tools`, { headers });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async getToolById(id: string) {
    const response = await fetch(`${API_BASE_URL}/tools/${id}`, { headers });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`, { headers });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async getToolsByCategory(categoryId: string) {
    const response = await fetch(`${API_BASE_URL}/tools/category/${categoryId}`, { headers });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async subscribeNewsletter(email: string) {
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    });
    return response.json();
  }
};