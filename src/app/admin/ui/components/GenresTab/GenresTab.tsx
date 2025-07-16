'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllGenres, createGenre } from '@/app/actions/genres';
import { TGenre } from '@/utils/types';
import toast from 'react-hot-toast';
import { Loader } from '@/app/ui/components/Loader';

export const GenresTab = () => {
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<TGenre | null>(null);
  const [genreName, setGenreName] = useState('');

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await getAllGenres();
      
      if (response.success) {
        setGenres(response.data.content);
      } else {
        toast.error('Помилка завантаження жанрів');
      }
    } catch (error) {
      toast.error('Помилка завантаження жанрів');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!genreName.trim()) {
      toast.error('Назва жанру не може бути порожньою');
      return;
    }

    try {
      const response = await createGenre({ name: genreName.trim() });
      
      if (response.success) {
        toast.success(editingGenre ? 'Жанр оновлено успішно!' : 'Жанр створено успішно!');
        setShowCreateForm(false);
        setGenreName('');
        setEditingGenre(null);
        fetchGenres();
      } else {
        toast.error(response.errors[0] || 'Помилка створення жанру');
      }
    } catch (error) {
      toast.error('Помилка створення жанру');
    }
  };

  const handleEdit = (genre: TGenre) => {
    setEditingGenre(genre);
    setGenreName(genre.name);
    setShowCreateForm(true);
  };

  const handleDelete = async (genreId: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей жанр?')) {
      // TODO: Implement delete genre API call
      toast.error('Функція видалення поки не реалізована');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setGenreName('');
    setEditingGenre(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Text.Header>Управління жанрами</Text.Header>
        <Button 
          variant="primary" 
          onClick={() => {
            setShowCreateForm(true);
            setEditingGenre(null);
            setGenreName('');
          }}
        >
          Додати жанр
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <Text.Header className="text-lg">
              {editingGenre ? 'Редагувати жанр' : 'Створити новий жанр'}
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
                Назва жанру
              </label>
              <Input
                value={genreName}
                onChange={(e) => setGenreName(e.target.value)}
                placeholder="Введіть назву жанру"
                required
              />
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" variant="primary">
                {editingGenre ? 'Оновити' : 'Створити'}
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
              {genres.map((genre) => (
                <tr key={genre.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {genre.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {genre.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="text-xs px-3 py-1"
                        onClick={() => handleEdit(genre)}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-xs px-3 py-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(genre.id)}
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
        
        {genres.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Жанри не знайдено
          </div>
        )}
      </div>
    </div>
  );
}; 