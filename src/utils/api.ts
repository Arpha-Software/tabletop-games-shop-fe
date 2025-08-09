'use server';

import { apiClient } from './apiClient';
import { cookies } from 'next/headers';

export const changeUserInfo = async (data: any) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    if (!authToken) {
      return { success: false, errors: ['Authentication token not found'] };
    }

    const requestBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      isSubscribedToNewsLetter: data.isSubscribedToNewsLetter || false,
      subscribedToNewsLetter: data.subscribedToNewsLetter || false,
    };

    const responseData = await apiClient.put(
      `/api/v1/users/${data.id}`,
      requestBody,
      { 'Authorization': `Bearer ${authToken}` }
    );

    return {
      success: true,
      errors: [],
      data: responseData,
    };
  } catch (error: any) {
    console.error('Error updating user info:', error);
    if (error) {
      return {
        success: false,
        errors: error.data?.errors || [error.message],
      };
    }

    return { success: false, errors: [error.message] };
  }
};