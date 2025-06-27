'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { createGenre, deleteGenre, updateGenre } from '@/app/actions/genres';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { TGenre } from '@/utils/types';
import { useFetchGenres } from '@/hooks/product/useFetchGenres';
import { Pagination } from '@/app/ui/components/Pagination';

const ITEMS_PER_PAGE = 10;

export const GenreManagement = () => {
  const genres = useFetchGenres();
  const [currentPage, setCurrentPage] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGenre, setEditingGenre] = useState<TGenre | null>(null);
  const [genreName, setGenreName] = useState('');

  const handleCreateGenre = async () => {
    if (!genreName.trim()) {
      toast.error('Будь ласка, введіть назву жанру.');
      return;
    }

    try {
      const result = await createGenre({ name: genreName.trim() });
      if (result.success) {
        toast.success('Жанр успішно створено!');
        resetForm();
      } else {
        toast.error(result.errors?.join(', ') || 'Помилка створення жанру. Спробуйте ще раз.');
      }
    } catch (error) {
      toast.error('Непередбачена помилка. Спробуйте ще раз.');
      console.error('Error creating genre:', error);
    }
  };

  const handleEditGenre = async (genre: TGenre) => {
    setEditingGenre(genre);
    setGenreName(genre.name);
    setIsCreating(true);
  };

  const handleUpdateGenre = async () => {
    if (!editingGenre || !genreName.trim()) {
      toast.error('Будь ласка, введіть назву жанру.');
      return;
    }

    try {
      const result = await updateGenre(editingGenre.id, { name: genreName.trim() });
      if (result.success) {
        toast.success('Жанр успішно оновлено!');
        resetForm();
      } else {
        toast.error(result.errors?.join(', ') || 'Помилка оновлення жанру. Спробуйте ще раз.');
      }
    } catch (error) {
      toast.error('Непередбачена помилка. Спробуйте ще раз.');
      console.error('Error updating genre:', error);
    }
  };

  const handleDeleteGenre = async (genreId: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей жанр?')) {
      try {
        const result = await deleteGenre(genreId);
        if (result.success) {
          toast.success('Жанр успішно видалено!');
        } else {
          toast.error('Помилка видалення жанру. Спробуйте ще раз.');
        }
      } catch (error) {
        toast.error('Непередбачена помилка при видаленні жанру.');
        console.error('Error deleting genre:', error);
      }
    }
  };

  const resetForm = () => {
    setGenreName('');
    setEditingGenre(null);
    setIsCreating(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Text.Header className="text-2xl text-gray-800">
          {isCreating ? (editingGenre ? 'Редагувати жанр' : 'Додати новий жанр') : 'Управління жанрами'}
        </Text.Header>
        {!isCreating && (
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            Додати жанр
          </Button>
        )}
      </div>

      {isCreating ? (
        <form
          action={editingGenre ? handleUpdateGenre : handleCreateGenre}
          className="space-y-6"
        >
          <Input
            name="name"
            value={genreName}
            onChange={(e) => setGenreName(e.target.value)}
            placeholder="Назва жанру"
            className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <div className="flex gap-4">
            <Button className="w-full md:w-auto py-3 px-6" variant="primary" type="submit">
              {editingGenre ? 'Зберегти зміни' : 'Створити жанр'}
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
            {genres.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((genre) => (
              <div
                key={genre.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{genre.name}</h3>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleEditGenre(genre)}
                  >
                    Редагувати
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDeleteGenre(genre.id)}
                  >
                    Видалити
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {genres.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(genres.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          )}
        </div>
      )}
    </div>
  );
}; 