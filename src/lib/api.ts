const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json'
});

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
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return response.json();
  }
};