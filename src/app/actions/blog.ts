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
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('size', String(size));
    if (search) {
      queryParams.append('search', search); // Assuming the API supports a 'search' query parameter
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/v1/blog/posts${queryString ? `?${queryString}` : ''}`;

    const data = await apiClient.get<{ content: TBlogPost[], totalPages: number, totalElements: number }>(endpoint, headers);

    return {
      success: true,
      errors: [],
      data: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
    };
  } catch (error: any) {
    console.error('Error fetching all blog posts:', error);
    if (error) {
      if (error.statusCode === 401) {
        redirect('/login');
      }
      return {
        success: false,
        errors: error.data?.errors || [error.message],
        data: [],
        totalPages: 0,
        totalElements: 0,
      };
    }
    return {
      success: false,
      errors: [error.message],
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
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const data = await apiClient.get<TBlogPost>(`/api/v1/blog/posts/${id}`, headers);
    console.log('data article', data)
    return {
      success: true,
      errors: [],
      data,
    };
  } catch (error: any) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
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

export const createBlogPost = async (postData: TCreateBlogPost) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = {};
    if (!authToken) {
      return { success: false, errors: ['Authentication token not provided for blog post creation.'] };
    }
    headers['Authorization'] = `Bearer ${authToken}`;

    const responseData = await apiClient.post<TBlogPost>('/api/v1/blog/posts', postData, headers);
    return {
      success: true,
      errors: [],
      data: responseData,
    };
  } catch (error: any) {
    console.error('Error creating blog post:', error);
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

export const createBlogComment = async (commentData: TCreateBlogComment) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = {};
    if (!authToken) {
      return { success: false, errors: ['Authentication token not provided for comment creation.'] };
    }
    headers['Authorization'] = `Bearer ${authToken}`;

    await apiClient.post<void>('/api/v1/blog/comments', commentData, headers);
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error('Error creating blog comment:', error);
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

export const deleteBlogPost = async (id: number) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = {};
    if (!authToken) {
      return { success: false, errors: ['Authentication token not provided for blog post deletion.'] };
    }
    headers['Authorization'] = `Bearer ${authToken}`;

    await apiClient.delete<void>(`/api/v1/blog/posts/${id}`, headers);
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
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

export const deleteBlogComment = async (id: number) => {
  try {
    const authToken = cookies().get('authToken')?.value;
    const headers: HeadersInit = {};
    if (!authToken) {
      return { success: false, errors: ['Authentication token not provided for comment deletion.'] };
    }
    headers['Authorization'] = `Bearer ${authToken}`;

    await apiClient.delete<void>(`/api/v1/blog/comments/${id}`, headers);
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error(`Error deleting blog comment with ID ${id}:`, error);
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
