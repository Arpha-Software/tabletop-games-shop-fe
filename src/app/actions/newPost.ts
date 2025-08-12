'use server';

import { apiClient } from "@/utils/apiClient";
import { cookies } from 'next/headers';

type Headers = HeadersInit;

const MIN_CHARS = 2;

export const searchCities = async (CityName: string) => {
  try {
    const q = (CityName || '').trim();
    if (q.length < MIN_CHARS) return [];

    const token = cookies().get('authToken')?.value;
    const headers: Headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await apiClient.post<any>(
      '/api/v1/nova-poshta/settlements/search',
      { CityName: q, Limit: '10', Page: '1' },
      headers
    );
    const list = res?.data?.[0]?.Addresses ?? [];
    return list;
  } catch (e) {
    console.error('Search Cities Error:', e);
    return [];
  }
};

export const searchStreets = async (SettlementRef: string, StreetName: string) => {
  try {
    const q = (StreetName || '').trim();
    if (!SettlementRef || q.length < MIN_CHARS) return [];

    const token = cookies().get('authToken')?.value;
    const headers: Headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    console.log('body: ', { SettlementRef, StreetName: q, Limit: '10' })
    const res = await apiClient.post<any>(
      '/api/v1/nova-poshta/settlements/streets/search',
      { SettlementRef, StreetName: q, Limit: '10' },
      headers
    );
    console.log('response: ', res)
    const list = res?.data?.[0]?.Addresses ?? [];
    return list;
  } catch (e) {
    console.error('Search Streets Error:', e);
    return [];
  }
};

export const searchWarehouses = async (cityRef: string, cityName: string, query: string) => {
  try {
    const q = (query || '').trim();
    if (!cityRef || q.length < MIN_CHARS) {
      return { success: true, errors: [], data: [] as any[] };
    }

    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const body = {
      CityName: (cityName || '').trim(),
      CityRef: cityRef,
      Page: '1',
      Limit: '100',
      FindByString: q,
    };

    const res = await apiClient.post<any>(
      '/api/v1/nova-poshta/warehouses/search',
      body,
      headers
    );

    return {
      success: true,
      errors: [],
      data: res.data || [],
    };
  } catch (error: any) {
    console.error('Warehouse Search Error:', error);
    return {
      success: false,
      errors: error.data?.errors || [error.message],
      data: [],
    };
  }
};
