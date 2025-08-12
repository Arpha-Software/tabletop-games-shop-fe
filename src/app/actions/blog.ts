// src/app/actions/blog.ts
'use server';

import { apiClient } from "@/utils/apiClient";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface TComment {
  id: number;
  content: string;
  username: string;
  userId: number;
  createdAt: string;
}

export interface TBlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  mainImageUrl: string;
  otherImageUrls: string[];
  createdAt: string;
  updatedAt: string;
  comments: TComment[];
}

export interface TImageUpload {
  type: string;
  fileSize: number;
  uuid: string;
  isMain: boolean;
}

export interface TCreateBlogPost {
  title: string;
  content: string;
  images: TImageUpload[];
}

export interface TCreateBlogComment {
  postId: number;
  content: string;
}

export const getAllBlogPosts = async (page: number = 0, size: number = 6, search: string = '') => {
  try {
    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('size', String(size));
    if (search) queryParams.append('search', search);

    const endpoint = `/api/v1/blog/posts?${queryParams.toString()}`;

    // 60s ISR for identical (page,size,search) combos; dedupes within render too
    const data = await apiClient.get<{ content: TBlogPost[], totalPages: number, totalElements: number }>(
      endpoint,
      headers,
      undefined,
      { next: { revalidate: 60, tags: ['blog:list'] } }
    );

    return {
      success: true,
      errors: [],
      data: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
    };
  } catch (error: any) {
    console.error('Error fetching all blog posts:', error);
    return {
      success: false,
      errors: error?.data?.errors || [error?.message || 'Unknown error'],
      data: [],
      totalPages: 0,
      totalElements: 0,
    };
  }
};

export const getBlogPostById = async (id: string) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const data = await apiClient.get<TBlogPost>(`/api/v1/blog/posts/${id}`, headers, undefined, {
      next: { revalidate: 120, tags: ['blog:item'] },
    });

    return { success: true, errors: [], data };
  } catch (error: any) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return {
      success: false,
      errors: error?.data?.errors || [error?.message || 'Unknown error'],
      data: null,
    };
  }
};

export const createBlogPost = async (postData: TCreateBlogPost) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    if (!authToken) return { success: false, errors: ['Authentication token not provided for blog post creation.'] };

    const headers: HeadersInit = { Authorization: `Bearer ${authToken}` };
    const responseData = await apiClient.post<TBlogPost>('/api/v1/blog/posts', postData, headers);
    return { success: true, errors: [], data: responseData };
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    if (error?.statusCode === 401) redirect('/login');
    return { success: false, errors: error?.data?.errors || [error?.message || 'Unknown error'] };
  }
};

export const createBlogComment = async (commentData: TCreateBlogComment) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    if (!authToken) return { success: false, errors: ['Authentication token not provided for comment creation.'] };

    const headers: HeadersInit = { Authorization: `Bearer ${authToken}` };
    await apiClient.post<void>('/api/v1/blog/comments', commentData, headers);
    return { success: true, errors: [] };
  } catch (error: any) {
    console.error('Error creating blog comment:', error);
    if (error?.statusCode === 401) redirect('/login');
    return { success: false, errors: error?.data?.errors || [error?.message || 'Unknown error'] };
  }
};

export const deleteBlogPost = async (id: number) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    if (!authToken) return { success: false, errors: ['Authentication token not provided for blog post deletion.'] };

    const headers: HeadersInit = { Authorization: `Bearer ${authToken}` };
    await apiClient.delete<void>(`/api/v1/blog/posts/${id}`, headers);
    return { success: true, errors: [] };
  } catch (error: any) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    if (error?.statusCode === 401) redirect('/login');
    return { success: false, errors: error?.data?.errors || [error?.message || 'Unknown error'] };
  }
};

export const deleteBlogComment = async (id: number) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    if (!authToken) return { success: false, errors: ['Authentication token not provided for comment deletion.'] };

    const headers: HeadersInit = { Authorization: `Bearer ${authToken}` };
    await apiClient.delete<void>(`/api/v1/blog/comments/${id}`, headers);
    return { success: true, errors: [] };
  } catch (error: any) {
    console.error(`Error deleting blog comment with ID ${id}:`, error);
    if (error?.statusCode === 401) redirect('/login');
    return { success: false, errors: error?.data?.errors || [error?.message || 'Unknown error'] };
  }
};
