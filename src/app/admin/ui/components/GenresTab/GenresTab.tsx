// src/app/admin/ui/components/GenresTab/GenresTab.tsx
'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import toast from 'react-hot-toast';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllGenres, createGenre } from '@/app/actions/genres';
import { TGenre } from '@/utils/types';
import { RubikLoadable } from '@/app/ui/components/Loader';
import { cn } from '@/utils/helpers';

/* ---------- Shared UI (same look as other tabs) ---------- */
const SectionCard = ({ title, subtitle, children, className }:{
  title:string; subtitle?:string; children:React.ReactNode; className?:string;
}) => (
  <section className={cn('bg-white rounded-2xl shadow-card border border-secondary-100 p-6', className)}>
    <div className="mb-5">
      <Text.Header className="text-lg">{title}</Text.Header>
      {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
    {children}
  </section>
);

const Field = ({ label, children }:{label:string; children:React.ReactNode}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

/* ---------- Memoized Form to avoid remount on typing ---------- */
const GenreForm = memo(function GenreForm({
  name,
  setName,
  onSubmit,
  onCancel,
  editing,
}:{
  name: string;
  setName: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editing: boolean;
}) {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, [setName]);

  return (
    <SectionCard title={editing ? 'Редагувати жанр' : 'Створити новий жанр'}>
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Назва жанру">
          <Input
            value={name}
            onChange={onChange}
            placeholder="Введіть назву жанру"
            required
          />
        </Field>

        <div className="flex gap-3 justify-end">
          <Button type="submit">{editing ? 'Оновити' : 'Створити'}</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Скасувати</Button>
        </div>
      </form>
    </SectionCard>
  );
});

/* ---------- Main ---------- */
export const GenresTab = () => {
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<TGenre | null>(null);
  const [genreName, setGenreName] = useState('');

  const fetchGenres = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllGenres();
      if (response.success) {
        setGenres(response.data); // <-- no .content
      } else {
        toast.error(response.errors?.[0] || 'Помилка завантаження жанрів');
      }
    } catch {
      toast.error('Помилка завантаження жанрів');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGenres(); }, [fetchGenres]);

  const resetForm = useCallback(() => {
    setEditingGenre(null);
    setGenreName('');
  }, []);

  const handleCancel = useCallback(() => {
    setShowCreateForm(false);
    resetForm();
  }, [resetForm]);

  const handleEdit = useCallback((genre: TGenre) => {
    setEditingGenre(genre);
    setGenreName(genre.name ?? '');
    setShowCreateForm(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genreName.trim()) {
      toast.error('Назва жанру не може бути порожньою');
      return;
    }

    try {
      const r = await createGenre({ name: genreName.trim() });
      if (!r.success) {
        toast.error(r.errors?.[0] || 'Помилка створення жанру');
        return;
      }
      toast.success(editingGenre ? 'Жанр оновлено успішно!' : 'Жанр створено успішно!');
      setShowCreateForm(false);
      resetForm();

      // refresh list
      setLoading(true);
      try {
        const resp = await getAllGenres();
        if (resp.success) setGenres(resp.data);
      } finally {
        setLoading(false);
      }
    } catch {
      toast.error('Помилка створення жанру');
    }
  }, [genreName, editingGenre, resetForm]);

  const handleDelete = useCallback(async (_id: number) => {
    toast.error('Функція видалення поки не реалізована');
  }, []);

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <div>
            <Text.Header>Управління жанрами</Text.Header>
            <Text.Span className="text-gray-500">Створення та редагування</Text.Span>
          </div>
          <Button onClick={() => { resetForm(); setShowCreateForm(true); }}>
            Додати жанр
          </Button>
        </div>

        {/* Form (memoized) */}
        {showCreateForm && (
          <GenreForm
            name={genreName}
            setName={setGenreName}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editing={!!editingGenre}
          />
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-secondary-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Назва</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Дії</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {genres.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4 text-sm text-gray-900">{g.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{g.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => handleEdit(g)}>
                          Редагувати
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                          onClick={() => handleDelete(g.id)}
                        >
                          Видалити
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {genres.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      Жанри не знайдено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RubikLoadable>
  );
};
