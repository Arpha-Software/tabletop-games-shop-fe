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
