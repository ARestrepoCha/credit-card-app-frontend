import api from '../../api/axios';

export const paymentService = {
  // POST /api/Payments
  createPayment: async (paymentData: { creditCardId: string; amount: number; productDescription: string }) => {
    const response = await api.post('/Payments', paymentData);
    return response.data;
  },

  // GET /api/Payments/history
  getHistory: async (cardId: string, page: number = 1, pageSize: number = 10) => {
    const response = await api.get('/Payments/history', {
      params: { creditCardId: cardId, pageNumber: page, pageSize }
    });
    return response.data;
  }
};