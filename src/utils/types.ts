export type TTitlePosition = 'top' | 'bottom';

export type TLoginScreen = 'login' | 'confirmation' | 'register';

export type TUser = {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
}

export type TProduct = {
  id: number;
  name: string;
  type: string;
  playerNumber: number;
  playTime: number;
  description: string;
  price: number;
  rulesLink: string;
  categories: string[];
  genres: string[];
}
