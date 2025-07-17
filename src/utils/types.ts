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
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  isSubscribedToNewsLetter?: boolean;
  subscribedToNewsLetter?: boolean;
}

export type TProduct = {
  id: number;
  name: string;
  type: {
    id: number;
    name: string;
    dimension: {
      width: number;
      weight: number;
      length: number;
      height: number;
    };
  };
  playerNumber: number;
  playTime: number;
  description: string;
  price: number;
  rulesLink: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  quantity: number;
  mainImgLink: string;
  categories: string[];
  genres: string[];
  productPhotos: string[];
}

export type TCategory = {
  id: number;
  name: string;
}

export type TGenre = {
  id: number;
  name: string;
}

export type TProductType = {
  id: number;
  name: string;
  dimension: {
    width: number;
    weight: number;
    length: number;
    height: number;
  };
}

export type TCartItem = {
  id: number;
  product: TProduct;
  quantity: number;
}

export type TCart = {
  items: TCartItem[];
  total: number;
}
