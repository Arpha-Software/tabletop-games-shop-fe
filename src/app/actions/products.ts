// tabletop-games-shop-fe/src/app/actions/products.ts
'use server';

import { apiClient } from "@/utils/apiClient";
import { TProduct } from "@/utils/types";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { refreshAccessToken } from "./auth";

// UPDATED ProductFilters interface
export interface ProductFilters {
  page?: number;
  sort?: string;

  'price.eq'?: number; 'price.ne'?: number; 'price.gt'?: number; 'price.gte'?: number;
  'price.lt'?: number; 'price.lte'?: number; 'price.in'?: string;

  'name.eq'?: string; 'name.ne'?: string; 'name.contains'?: string; 'name.in'?: string;

  'minPlayerNumber.gte'?: number; 'maxPlayerNumber.lte'?: number; 'minPlayerNumber.eq'?: number;
  'maxPlayerNumber.eq'?: number; 'minPlayerNumber.ne'?: number; 'minPlayerNumber.lt'?: number;
  'minPlayerNumber.gt'?: number; 'minPlayerNumber.in'?: string; 'minPlayerNumber.between'?: string;
  'maxPlayerNumber.lt'?: number; 'maxPlayerNumber.gt'?: number; 'maxPlayerNumber.ne'?: number;
  'maxPlayerNumber.in'?: string; 'maxPlayerNumber.between'?: string;

  'minPlayTime.gte'?: number; 'maxPlayTime.lte'?: number; 'minPlayTime.eq'?: number;
  'minPlayTime.ne'?: number; 'minPlayTime.lt'?: number; 'minPlayTime.gt'?: number;
  'minPlayTime.in'?: string; 'minPlayTime.between'?: string; 'maxPlayTime.eq'?: number;
  'maxPlayTime.ne'?: number; 'maxPlayTime.lt'?: number; 'maxPlayTime.gt'?: number;
  'maxPlayTime.in'?: string; 'maxPlayTime.between'?: string;

  'minAge.gte'?: number; 'minAge.eq'?: number; 'minAge.ne'?: number; 'minAge.lt'?: number;
  'minAge.gt'?: number; 'minAge.in'?: string; 'minAge.between'?: string;

  'bggRating.eq'?: number; 'bggRating.ne'?: number; 'bggRating.gt'?: number; 'bggRating.gte'?: number;
  'bggRating.lt'?: number; 'bggRating.lte'?: number; 'bggRating.in'?: string; 'bggRating.between'?: string;

  'complexity.eq'?: number; 'complexity.ne'?: number; 'complexity.gt'?: number; 'complexity.gte'?: number;
  'complexity.lt'?: number; 'complexity.lte'?: number; 'complexity.in'?: string; 'complexity.between'?: string;

  'components.eq'?: string; 'components.ne'?: string; 'components.contains'?: string; 'components.in'?: string;

  'rulesLink.eq'?: string; 'rulesLink.ne'?: string; 'rulesLink.contains'?: string; 'rulesLink.in'?: string;

  'averageRating.eq'?: number; 'averageRating.ne'?: number; 'averageRating.gt'?: number; 'averageRating.gte'?: number;
  'averageRating.lt'?: number; 'averageRating.lte'?: number; 'averageRating.in'?: string; 'averageRating.between'?: string;

  'reviewCount.eq'?: number; 'reviewCount.ne'?: number; 'reviewCount.gt'?: number; 'reviewCount.gte'?: number;
  'reviewCount.lt'?: number; 'reviewCount.lte'?: number; 'reviewCount.in'?: string; 'reviewCount.between'?: string;

  'mechanics.in'?: string; 'mechanics.all'?: string;

  'dimension.width.eq'?: number; 'dimension.width.ne'?: number; 'dimension.width.gt'?: number;
  'dimension.width.gte'?: number; 'dimension.width.lt'?: number; 'dimension.width.lte'?: number;
  'dimension.width.in'?: string; 'dimension.width.between'?: string;

  'dimension.length.eq'?: number; 'dimension.length.ne'?: number; 'dimension.length.gt'?: number;
  'dimension.length.gte'?: number; 'dimension.length.lt'?: number; 'dimension.length.lte'?: number;
  'dimension.length.in'?: string; 'dimension.length.between'?: string;

  'dimension.height.eq'?: number; 'dimension.height.ne'?: number; 'dimension.height.gt'?: number;
  'dimension.height.gte'?: number; 'dimension.height.lt'?: number; 'dimension.height.lte'?: number;
  'dimension.height.in'?: string; 'dimension.height.between'?: string;

  'dimension.weight.eq'?: number; 'dimension.weight.ne'?: number; 'dimension.weight.gt'?: number;
  'dimension.weight.gte'?: number; 'dimension.weight.lt'?: number; 'dimension.weight.lte'?: number;
  'dimension.weight.in'?: string; 'dimension.weight.between'?: string;

  'createdAt.between'?: string; 'createdAt.gte'?: string; 'createdAt.lte'?: string;
  'createdAt.eq'?: string; 'createdAt.ne'?: string; 'createdAt.gt'?: string; 'createdAt.lt'?: string;

  'updatedAt.between'?: string; 'updatedAt.gte'?: string; 'updatedAt.lte'?: string;
  'updatedAt.eq'?: string; 'updatedAt.ne'?: string; 'updatedAt.gt'?: string; 'updatedAt.lt'?: string;

  'language.eq'?: string; 'language.ne'?: string; 'language.contains'?: string; 'language.in'?: string;

  'publisher.eq'?: string; 'publisher.ne'?: string; 'publisher.contains'?: string; 'publisher.in'?: string;

  'author.eq'?: string; 'author.ne'?: string; 'author.contains'?: string; 'author.in'?: string;

  'categories.id.in'?: string; 'categories.name.in'?: string;

  'genres.id.in'?: string; 'genres.name.in'?: string;

  'type.id.eq'?: number; 'type.name.eq'?: string;

  'addons.id.in'?: string; 'addons.name.in'?: string;

  'quantity.eq'?: number; 'quantity.ne'?: number; 'quantity.gt'?: number; 'quantity.gte'?: number;
  'quantity.lt'?: number; 'quantity.lte'?: number; 'quantity.in'?: string; 'quantity.between'?: string;

  'description.eq'?: string; 'description.ne'?: string; 'description.contains'?: string; 'description.in'?: string;

  'id.eq'?: number; 'id.ne'?: number; 'id.gt'?: number; 'id.gte'?: number;
  'id.lt'?: number; 'id.lte'?: number; 'id.in'?: string; 'id.between'?: string;
}

export interface ProductFilterRequestBody {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  minPlayers?: number; // Maps from minPlayerNumberRange
  maxPlayers?: number; // Maps from maxPlayerNumberRange
  minAge?: number;     // Maps from minAgeRange
  categories?: string[]; // Maps from categoryNames
  genres?: string[];     // Maps from genreNames
  mechanics?: string[];  // Maps from mechanics
  author?: string;       // Maps from authorContains
  publisher?: string;    // Maps from publisherContains
  // Add pagination and sorting for the POST request if the API supports it in the body
  page?: number;
  size?: number;
  sort?: string; // e.g., "id,asc"
}

export interface AvailableFilters {
  languages: string[];
  genres: string[];
  categories: string[];
  mechanics: string[];
  publishers: string[];
  authors: string[];
  minPlayers: number;
  maxPlayers: number;
  minAge: number;
  priceRange: { min: number; max: number };
}

// ======= DEBUG =======
const DEBUG_USE_MOCK_FILTERS = true; // <-- вимкни коли все запрацює
const MOCK_FILTERS: AvailableFilters = {
  languages: ['UA', 'EN', 'PL'],
  genres: ['Family', 'Strategy', 'Party'],
  categories: ['Card Game', 'Euro', 'Wargame'],
  mechanics: ['Drafting', 'Deck Building', 'Worker Placement'],
  publishers: ['Z-Man', 'CMON', 'Hobby World'],
  authors: ['Uwe Rosenberg', 'Reiner Knizia', 'Vladaa Chvatil'],
  minPlayers: 1,
  maxPlayers: 8,
  minAge: 6,
  priceRange: { min: 0, max: 20000 },
};
// ======================


async function withAutoRefresh<T>(fn: (authToken?: string) => Promise<T>): Promise<T> {
  const token1 = cookies().get('authToken')?.value;
  try {
    return await fn(token1);
  } catch (err: any) {
    if (err && err.statusCode === 401) {
      const refreshed = await refreshAccessToken();
      if (!refreshed.success) throw err;
      const token2 = cookies().get('authToken')?.value;
      return await fn(token2);
    }
    throw err;
  }
}


export const getAvailableFilters = async () => {
  try {
    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const raw = await apiClient.get<any>('/api/v1/products/filters', headers);

    // Деякі клієнти повертають {data: ...}, інші — одразу payload
    const p = raw?.data ?? raw ?? {};

    const normalized: AvailableFilters = {
      languages: Array.isArray(p.languages) ? p.languages : [],
      genres: Array.isArray(p.genres) ? p.genres : [],
      categories: Array.isArray(p.categories) ? p.categories : [],
      mechanics: Array.isArray(p.mechanics) ? p.mechanics : [],
      publishers: Array.isArray(p.publishers) ? p.publishers : [],
      authors: Array.isArray(p.authors) ? p.authors : [],
      minPlayers: Number.isFinite(p.minPlayers) ? p.minPlayers : 0,
      maxPlayers: Number.isFinite(p.maxPlayers) ? p.maxPlayers : 0,
      minAge: Number.isFinite(p.minAge) ? p.minAge : 0,
      priceRange: {
        min: Number.isFinite(p?.priceRange?.min) ? p.priceRange.min : 0,
        max: Number.isFinite(p?.priceRange?.max) ? p.priceRange.max : 20000,
      },
    };

    // Якщо все порожнє — підкинемо мок, щоб UI показався
    const looksEmpty =
      !normalized.languages.length &&
      !normalized.genres.length &&
      !normalized.categories.length &&
      !normalized.mechanics.length &&
      !normalized.publishers.length &&
      !normalized.authors.length &&
      normalized.minPlayers === 0 &&
      normalized.maxPlayers === 0 &&
      normalized.minAge === 0;

    const data = (DEBUG_USE_MOCK_FILTERS && looksEmpty) ? MOCK_FILTERS : normalized;

    // корисний лог під час дебагу
    console.log('availableFilters (server normalized):', data);

    return { success: true, errors: [], data };
  } catch (error: any) {
    console.error('Error fetching available filters:', error);
    if (error) {
      if (error.statusCode === 401) redirect('/login');
      return { success: false, errors: error.data?.errors || [error.message], data: null };
    }
    return { success: false, errors: [error.message], data: null };
  }
};

export const createProduct = async (productData: any) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const headers: HeadersInit = {};
    if (!authToken) {
      return { success: false, errors: ['Authentication token not provided for product creation.'] };
    }

    const responseData = await apiClient.post<TProduct>('/api/v1/products', productData, { 'Authorization': `Bearer ${authToken}` });
    return {
      success: true,
      errors: [],
      data: responseData,
    };
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error) {
      if (error.statusCode === 401) {
        redirect('/login');
      }
      return {
        success: false,
        errors: error.data?.errors || [error.message],
      };
    }
    return {
      success: false,
      errors: [error.message],
    };
  }
};

export const getAllProducts = async (filters: ProductFilterRequestBody & { page?: number; size?: number; sort?: string; }) => {
  try {
    const { page, size, sort, ...filterBody } = filters;
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', String(page));
    if (size !== undefined) queryParams.append('size', String(size));
    if (sort !== undefined) queryParams.append('sort', sort);
    const endpoint = `/api/v1/products/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const cleanFilterBody: { [k: string]: any } = {};
    for (const k in filterBody) {
      const v = (filterBody as any)[k];
      if (v !== undefined && v !== null) cleanFilterBody[k] = v;
    }

    const data = await withAutoRefresh(async (authToken) => {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      return apiClient.post<{ content: TProduct[]; totalPages: number }>(endpoint, cleanFilterBody, headers);
    });

    return { success: true, errors: [], data };
  } catch (error: any) {
    console.error('Error fetching all products (filter):', error);
    if (error) {
      return { success: false, errors: error.data?.errors || [error.message], data: { content: [], totalPages: 0 } };
    }
    return { success: false, errors: [error.message], data: { content: [], totalPages: 0 } };
  }
};

export const getProductsRecommendations = async (page: number) => {
  try {
    const data = await withAutoRefresh(async (authToken) => {
      const headers: HeadersInit = {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      return apiClient.get<{ content: TProduct[]; totalPages: number }>(`/api/v1/products/recommendations?page=${page}`, headers);
    });
    return { success: true, errors: [], data };
  } catch (error: any) {
    console.error('Error fetching product recommendations:', error);
    if (error) {
      return { success: false, errors: error.data?.errors || [error.message], data: { content: [], totalPages: 0 } };
    }
    return { success: false, errors: [error.message], data: { content: [], totalPages: 0 } };
  }
};

export const getProductById = async (id: string) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const data = await apiClient.get<TProduct>(`/api/v1/products/${id}`, headers);
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error(`Error fetching product with ID ${id}:`, error);
    if (error) {
      if (error.statusCode === 401) {
        redirect('/login');
      }
      return {
        success: false,
        errors: error.data?.errors || [error.message],
        data: null,
      };
    }
    return {
      success: false,
      errors: [error.message],
      data: null,
    };
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      return { success: false, errors: ['Authentication token not provided for product deletion.'] };
    }

    await apiClient.delete<void>(`/api/v1/products/${id}`, headers);
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    if (error) {
      if (error.statusCode === 401) {
        redirect('/login');
      }
      return {
        success: false,
        errors: error.data?.errors || [error.message],
      };
    }
    return {
      success: false,
      errors: [error.message],
    };
  }
};
