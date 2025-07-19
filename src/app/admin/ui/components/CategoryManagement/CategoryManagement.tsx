'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { createCategory, deleteCategory, updateCategory } from '@/app/actions/categories';
import { Button, Input, Pagination } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { TCategory } from '@/utils/types';
import { useFetchCategories } from '@/hooks/product/useFetchCategories';

const ITEMS_PER_PAGE = 10;

export const CategoryManagement = () => {
  const categories = useFetchCategories();
  const [currentPage, setCurrentPage] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error('Будь ласка, введіть назву категорії.');
      return;
    }

    try {
      const result = await createCategory({ name: categoryName.trim() });
      if (result.success) {
        toast.success('Категорію успішно створено!');
        resetForm();
      } else {
        toast.error(result.errors?.join(', ') || 'Помилка створення категорії. Спробуйте ще раз.');
      }
    } catch (error) {
      toast.error('Непередбачена помилка. Спробуйте ще раз.');
      console.error('Error creating category:', error);
    }
  };

  const handleEditCategory = async (category: TCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsCreating(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !categoryName.trim()) {
      toast.error('Будь ласка, введіть назву категорії.');
      return;
    }

    try {
      const result = await updateCategory(editingCategory.id, { name: categoryName.trim() });
      if (result.success) {
        toast.success('Категорію успішно оновлено!');
        resetForm();
      } else {
        toast.error(result.errors?.join(', ') || 'Помилка оновлення категорії. Спробуйте ще раз.');
      }
    } catch (error) {
      toast.error('Непередбачена помилка. Спробуйте ще раз.');
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю категорію?')) {
      try {
        const result = await deleteCategory(categoryId);
        if (result.success) {
          toast.success('Категорію успішно видалено!');
        } else {
          toast.error('Помилка видалення категорії. Спробуйте ще раз.');
        }
      } catch (error) {
        toast.error('Непередбачена помилка при видаленні категорії.');
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setCategoryName('');
    setEditingCategory(null);
    setIsCreating(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Text.Header className="text-2xl text-gray-800">
          {isCreating ? (editingCategory ? 'Редагувати категорію' : 'Додати нову категорію') : 'Управління категоріями'}
        </Text.Header>
        {!isCreating && (
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            Додати категорію
          </Button>
        )}
      </div>

      {isCreating ? (
        <form
          action={editingCategory ? handleUpdateCategory : handleCreateCategory}
          className="space-y-6"
        >
          <Input
            name="name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Назва категорії"
            className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <div className="flex gap-4">
            <Button className="w-full md:w-auto py-3 px-6" variant="primary" type="submit">
              {editingCategory ? 'Зберегти зміни' : 'Створити категорію'}
            </Button>
            <Button
              className="w-full md:w-auto py-3 px-6"
              variant="secondary"
              onClick={resetForm}
            >
              Скасувати
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((category) => (
              <div
                key={category.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleEditCategory(category)}
                  >
                    Редагувати
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Видалити
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {categories.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(categories.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          )}
        </div>
      )}
    </div>
  );
}; 