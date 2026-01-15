import api from '../../api/axios';

// Definimos interfaces para que TypeScript nos ayude con el autocompletado
export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest extends LoginRequest {
  fullName: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }
};