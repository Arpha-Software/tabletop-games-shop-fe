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
  description: string;
  price: number;
  quantity: number;
  gameDetails: {
    players: string;
    age: string;
    playTime: string;
    complexity: number;
    bggRating: number;
    components: string;
  };
  classification: {
    language: string;
    genres: string[];
    categories: string[];
    mechanics: string[];
  };
  publicationDetails: {
    author: string;
    publisher: string;
  };
  media: {
    mainImgLink: string;
    photos: string[];
    rulesLink: string;
  };
  averageRating?: number;
  reviewCount?: number;
  addons?: TProduct[];
};

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
  addons?: TProduct[];
}

export type TCart = {
  items: TCartItem[];
  total: number;
}
