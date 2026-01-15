import api from '../../api/axios';

export const cardService = {
  getAll: async () => {
    const response = await api.get('/CreditCards'); 
    return response.data; 
  },

  getById: async (id: string) => {
    const response = await api.get(`/CreditCards/${id}`);
    return response.data;
  },

  create: async (card: any) => {
    const response = await api.post('/CreditCards', card);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch(`/CreditCards/${id}/status`);
    return response.data;
  },

  update: async (id: string, card: any) => {
    const response = await api.put(`/CreditCards/${id}`, card);
    return response.data;
  }
};