'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllBlogPosts, createBlogPost, deleteBlogPost, TBlogPost, TCreateBlogPost, TImageUpload } from '@/app/actions/blog';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { format } from 'date-fns';
import { RubikLoadable } from '../../../../ui/components/Loader';

const blogPostSchema = z.object({
  title: z.string().min(3, { message: "Заголовок повинен містити щонайменше 3 символи." }),
  content: z.string().min(10, { message: "Зміст повинен містити щонайменше 10 символів." }),
});

export const BlogTab = () => {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<TBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<TBlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [formErrors, setFormErrors] = useState<{ title?: string[], content?: string[] }>({});

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      // Fetch all blog posts for the admin view
      const response = await getAllBlogPosts(0, 100); 
      
      if (response.success) {
        setBlogPosts(response.data);
      } else {
        toast.error('Помилка завантаження статей блогу.');
      }
    } catch (error) {
      toast.error('Помилка завантаження статей блогу.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = blogPostSchema.safeParse(formData);
    if (!result.success) {
      const newErrors = result.error.flatten().fieldErrors;
      setFormErrors(newErrors);
      return;
    }
    setFormErrors({});

    try {
      if (editingPost) {
        // TODO: Implement updateBlogPost API call once available
        toast.error('Оновлення статей поки не реалізовано');
      } else {
        // Mock image data since file upload is a complex client-side process
        const mockImages: TImageUpload[] = [
          // This part needs a real implementation for image upload to work
          // For now, it's a placeholder.
        ];

        const postData: TCreateBlogPost = {
          ...result.data,
          images: mockImages,
        };

        const response = await createBlogPost(postData);
        
        if (response.success) {
          toast.success('Статтю створено успішно!');
          setShowForm(false);
          setEditingPost(null);
          setFormData({ title: '', content: '' });
          fetchBlogPosts();
        } else {
          toast.error(response.errors[0] || 'Помилка створення статті.');
        }
      }
    } catch (error) {
      toast.error('Помилка створення статті.');
    }
  };

  const handleEdit = (post: TBlogPost) => {
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content });
    setShowForm(true);
  };

  const handleDelete = async (postId: number) => {
    if (confirm('Ви впевнені, що хочете видалити цю статтю?')) {
      try {
        const response = await deleteBlogPost(postId);
        if (response.success) {
          toast.success('Статтю видалено успішно!');
          fetchBlogPosts();
        } else {
          toast.error(response.errors[0] || 'Помилка видалення статті.');
        }
      } catch (error) {
        toast.error('Помилка видалення статті.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({ title: '', content: '' });
    setFormErrors({});
  };
  
  const handleViewPost = (id: number) => {
    router.push(`/blog/${id}`);
  };

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Text.Header>Управління блогом</Text.Header>
          <Button
            variant="primary" 
            onClick={() => {
              setShowForm(true);
              setEditingPost(null);
              setFormData({ title: '', content: '' });
            }}
          >
            Додати статтю
          </Button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <Text.Header className="text-lg">
                {editingPost ? 'Редагувати статтю' : 'Створити нову статтю'}
              </Text.Header>
              <Button 
                variant="secondary" 
                onClick={handleCancel}
              >
                Скасувати
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заголовок
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введіть заголовок статті"
                />
                {formErrors.title && (
                  <Text.Paragraph className="text-red-500 text-sm mt-1">{formErrors.title[0]}</Text.Paragraph>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зміст
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Введіть зміст статті"
                  rows={10}
                  className="w-full p-3 border border-secondary-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {formErrors.content && (
                  <Text.Paragraph className="text-red-500 text-sm mt-1">{formErrors.content[0]}</Text.Paragraph>
                )}
              </div>
              
              {/* TODO: Add image upload functionality here. This will involve handling file inputs and uploading images to a storage service to get a UUID. */}
              <div className="flex gap-4">
                <Button type="submit" variant="primary">
                  {editingPost ? 'Оновити' : 'Створити'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleCancel}
                >
                  Скасувати
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заголовок
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Автор
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата створення
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(post.createdAt), 'dd.MM.yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1"
                          onClick={() => handleEdit(post)}
                        >
                          Редагувати
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1 text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(post.id)}
                        >
                          Видалити
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1 text-blue-600 hover:text-blue-800"
                          onClick={() => handleViewPost(post.id)}
                        >
                          Переглянути
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {blogPosts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Статей не знайдено
            </div>
          )}
        </div>
      </div>
    </RubikLoadable>
  );
};
