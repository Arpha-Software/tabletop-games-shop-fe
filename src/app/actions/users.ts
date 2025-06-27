export const updateUser = async (userId: string, data: { email?: string; firstName?: string; lastName?: string; role?: 'user' | 'admin' }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, errors: [error.message] };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, errors: [error.message] };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, errors: [error.message] };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, errors: [error.message] };
  }
}; 