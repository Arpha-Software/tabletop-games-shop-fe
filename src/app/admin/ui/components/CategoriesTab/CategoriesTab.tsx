'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllCategories, createCategory } from '@/app/actions/categories';
import { TCategory } from '@/utils/types';
import toast from 'react-hot-toast';
import { RubikLoadable } from '@/app/ui/components/Loader';

export const CategoriesTab = () => {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      
      if (response.success) {
        setCategories(response.data.content);
      } else {
        toast.error('Помилка завантаження категорій');
      }
    } catch (error) {
      toast.error('Помилка завантаження категорій');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error('Назва категорії не може бути порожньою');
      return;
    }

    try {
      const response = await createCategory({ name: categoryName.trim() });
      
      if (response.success) {
        toast.success(editingCategory ? 'Категорію оновлено успішно!' : 'Категорію створено успішно!');
        setShowCreateForm(false);
        setCategoryName('');
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(response.errors[0] || 'Помилка створення категорії');
      }
    } catch (error) {
      toast.error('Помилка створення категорії');
    }
  };

  const handleEdit = (category: TCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowCreateForm(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (confirm('Ви впевнені, що хочете видалити цю категорію?')) {
      // TODO: Implement delete category API call
      toast.error('Функція видалення поки не реалізована');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setCategoryName('');
    setEditingCategory(null);
  };

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Text.Header>Управління категоріями</Text.Header>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowCreateForm(true);
              setEditingCategory(null);
              setCategoryName('');
            }}
          >
            Додати категорію
          </Button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <Text.Header className="text-lg">
                {editingCategory ? 'Редагувати категорію' : 'Створити нову категорію'}
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
                  Назва категорії
                </label>
                <Input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Введіть назву категорії"
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <Button type="submit" variant="primary">
                  {editingCategory ? 'Оновити' : 'Створити'}
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
                    Назва
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1"
                          onClick={() => handleEdit(category)}
                        >
                          Редагувати
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1 text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(category.id)}
                        >
                          Видалити
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Категорії не знайдено
            </div>
          )}
        </div>
      </div>
    </RubikLoadable>
  );
}; 