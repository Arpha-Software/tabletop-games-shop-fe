'use server'

export async function verifyUser(phoneNumber: string) {
  try {
    console.log('Verifying user with phone number:', phoneNumber);
    const response = await fetch('https://api.vercel.app/blog');

    if (!response.ok) {
      return { success: false, errors: ['Failed to fetch'] };
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    return { success: false, errors: [error.message] };
  }
}
