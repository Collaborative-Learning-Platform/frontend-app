// Utility to test /auth/login endpoint using axiosInstance
import axiosInstance from '../api/axiosInstance';

export async function testLogin(username: string, password: string) {
  try {
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return { error: error.response.data, status: error.response.status };
    }
    return { error: error.message };
  }
}
