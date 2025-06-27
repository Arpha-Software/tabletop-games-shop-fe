export const updateOrderStatus = async (orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
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