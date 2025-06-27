export type TTitlePosition = 'top' | 'bottom';

export type TLoginScreen = 'login' | 'confirmation' | 'register';

export type TPageable = {
  pageNumber: number,
  pageSize: number,
  sort: any[],
  offset: number,
  paged: boolean,
  unpaged: boolean,
}

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
};

export type TProduct = {
  id: number;
  mainImgLink: string | null;
  imagesLinks?: string[]; // Optional: For product gallery images
  images?: Array<{ url: string }>; // For product images with URLs
  name: string;
  type: string;
  playerNumber: number;
  playTime: number;
  quantity: number;
  rating: number;
  description: string;
  price: number;
  rulesLink: string;
  categories: string[];
  genres: string[];
}

export type TCategory = {
  id: string;
  name: string;
}

export type TGenre = {
  id: string;
  name: string;
}

export interface ImageWithUUID {
  file: File;
  uuid: string;
}

// Add New Type for Cart Item
export type TCartItem = TProduct & {
  quantity: number;
};

export type TOrder = {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  totalAmount: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
};