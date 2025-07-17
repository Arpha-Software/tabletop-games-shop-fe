import { getAuthToken } from './helpers';

export const changeUserInfo = async (data: any) => {
  try {
    const authToken = getAuthToken();
    console.log('authToken, authToken', authToken)
    
    if (!authToken) {
      return { success: false, errors: ['Authentication token not found'] };
    }

    // Format the request body according to API requirements
    const requestBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null, // Make phone optional
      isSubscribedToNewsLetter: data.isSubscribedToNewsLetter || false,
      subscribedToNewsLetter: data.subscribedToNewsLetter || false,
    };
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/users/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    console.log('resp', response)
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error response:', errorData);
      
      // Handle validation errors
      if (errorData.violations) {
        const errors = errorData.violations.map((violation: any) => violation.message);
        return { success: false, errors };
      }
      
      return { success: false, errors: [errorData.detail || 'Failed to update user'] };
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    return { success: false, errors: [error.message] };
  }
}; 