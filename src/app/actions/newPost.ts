// src/app/actions/newPost.ts
'use server';

import { apiClient } from "@/utils/apiClient";
import { cookies } from 'next/headers';

type Headers = HeadersInit;

export const searchCities = async (CityName: string) => {
  try {
    const token = cookies().get('authToken')?.value;
    const headers: Headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await apiClient.post<any>(
      '/api/v1/nova-poshta/settlements/search',
      { CityName, Limit: '10', Page: '1' },
      headers
    );
    // normalize → return just the array for UI
    const list = res?.data?.[0]?.Addresses ?? [];
    console.log('LIST', list)
    return list;
  } catch (e) {
    console.error('Search Cities Error:', e);
    return [];
  }
};

export const searchStreets = async (SettlementRef: string, StreetName: string) => {
  try {
    const token = cookies().get('authToken')?.value;
    const headers: Headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await apiClient.post<any>(
      '/api/v1/nova-poshta/settlements/streets/search',
      { SettlementRef, StreetName, Limit: '10' },
      headers
    );
    const list = res?.data?.[0]?.Addresses ?? [];
    return list;
  } catch (e) {
    console.error('Search Streets Error:', e);
    return [];
  }
};

export const searchWarehouses = async (cityRef: string, cityName: string, query: string) => {
  try {
    const authToken = cookies().get('authToken')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const body = {
      CityName: cityName,
      CityRef: cityRef,
      Page: '1',
      Limit: '100',
      FindByString: query || '',
    };

    const res = await apiClient.post<any>(
      '/api/v1/nova-poshta/warehouses/search', // або твій реальний endpoint
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
