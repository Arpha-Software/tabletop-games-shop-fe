// src/app/admin/ui/components/CategoriesTab/CategoriesTab.tsx
'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import toast from 'react-hot-toast';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllCategories, createCategory } from '@/app/actions/categories';
import { TCategory } from '@/utils/types';
import { RubikLoadable } from '@/app/ui/components/Loader';
import { cn } from '@/utils/helpers';

/* ---------- Shared UI (same as other tabs) ---------- */
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

/* ---------- Memoized Form to prevent remount-on-typing ---------- */
const CategoryForm = memo(function CategoryForm({
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
    <SectionCard title={editing ? 'Редагувати категорію' : 'Створити нову категорію'}>
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Назва категорії">
          <Input
            value={name}
            onChange={onChange}
            placeholder="Введіть назву категорії"
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
export const CategoriesTab = () => {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      if (response.success) {
        setCategories(response.data); // <-- use normalized array
      } else {
        toast.error(response.errors?.[0] || 'Помилка завантаження категорій');
      }
    } catch {
      toast.error('Помилка завантаження категорій');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const resetForm = useCallback(() => {
    setEditingCategory(null);
    setCategoryName('');
  }, []);

  const handleCancel = useCallback(() => {
    setShowCreateForm(false);
    resetForm();
  }, [resetForm]);

  const handleEdit = useCallback((category: TCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name ?? '');
    setShowCreateForm(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const name = categoryName.trim();
    if (!name) {
      toast.error('Назва категорії не може бути порожньою');
      return;
    }

    try {
      const r = await createCategory({ name });
      if (!r.success) {
        toast.error(r.errors?.[0] || 'Помилка створення категорії');
        return;
      }
      toast.success(editingCategory ? 'Категорію оновлено успішно!' : 'Категорію створено успішно!');
      setShowCreateForm(false);
      resetForm();

      // refresh list
      setLoading(true);
      try {
        const resp = await getAllCategories();
        if (resp.success) setCategories(resp.data);
      } finally {
        setLoading(false);
      }
    } catch {
      toast.error('Помилка створення категорії');
    }
  }, [categoryName, editingCategory, resetForm]);

  const handleDelete = useCallback(async (_id: number) => {
    toast.error('Функція видалення поки не реалізована');
  }, []);

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <div>
            <Text.Header>Управління категоріями</Text.Header>
            <Text.Span className="text-gray-500">Створення та редагування</Text.Span>
          </div>
          <Button onClick={() => { resetForm(); setShowCreateForm(true); }}>
            Додати категорію
          </Button>
        </div>

        {/* Form (memoized) */}
        {showCreateForm && (
          <CategoryForm
            name={categoryName}
            setName={setCategoryName}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editing={!!editingCategory}
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
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4 text-sm text-gray-900">{c.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => handleEdit(c)}>
                          Редагувати
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                          onClick={() => handleDelete(c.id)}
                        >
                          Видалити
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      Категорії не знайдено
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
