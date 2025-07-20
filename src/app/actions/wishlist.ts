import { getAuthToken } from "@/utils/helpers";

export const getWishlist = async () => {
  const authToken = getAuthToken();

  if (!authToken) {
    return { success: false, errors: ['Authentication token not found.'] };
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/wishlists/my-wishlist`, {
    headers: {
      "Authorization": `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    return { success: false, errors: ['Failed to fetch wishlist'] };
  }

  const data = await response.json();
  return { success: true, data };
};

export const addProductToWishlist = async (productId: number) => {
  const authToken = getAuthToken();

  if (!authToken) {
    return { success: false, errors: ['Authentication token not found.'] };
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/wishlists/my-wishlist/products/${productId}`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    return { success: false, errors: ['Failed to add product to wishlist'] };
  }

  const data = await response.json();
  return { success: true, data };
};

export const removeProductFromWishlist = async (productId: number) => {
  const authToken = getAuthToken();
  if (!authToken) {
    return { success: false, errors: ['Authentication token not found.'] };
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/wishlists/my-wishlist/products/${productId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    return { success: false, errors: ['Failed to remove product from wishlist'] };
  }

  return { success: true };
};

export const getSharedWishlist = async (shareableLink: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/wishlists/share/${shareableLink}`);

  if (!response.ok) {
    return { success: false, errors: ['Failed to fetch shared wishlist'] };
  }

  const data = await response.json();
  return { success: true, data };
};
