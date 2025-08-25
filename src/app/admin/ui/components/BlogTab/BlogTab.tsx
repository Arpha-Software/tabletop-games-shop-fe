'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { RubikLoadable } from '../../../../ui/components/Loader';
import {
  getAllBlogPosts,
  createBlogPost,
  deleteBlogPost,
  type TBlogPost,
  type TCreateBlogPost,
  type TImageUpload,
} from '@/app/actions/blog';
import { cn } from '@/utils/helpers';

const blogPostSchema = z.object({
  title: z.string().min(3, { message: 'Заголовок повинен містити щонайменше 3 символи.' }),
  content: z.string().min(10, { message: 'Зміст повинен містити щонайменше 10 символів.' }),
});

/* -------------------------------------------
   Shared UI
------------------------------------------- */
const SectionCard = ({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={cn('bg-white rounded-2xl shadow-card border border-secondary-100 p-6', className)}>
    <div className="mb-5">
      <Text.Header className="text-lg">{title}</Text.Header>
      {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
    {children}
  </section>
);

const Field = ({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required ? <span className="text-primary ml-1">*</span> : null}
    </label>
    {children}
    {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
  </div>
);

/* -------------------------------------------
   Main Component
------------------------------------------- */
export const BlogTab = () => {
  const router = useRouter();

  // paging & search
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  // data
  const [posts, setPosts] = useState<TBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // form
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<TBlogPost | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [formErrors, setFormErrors] = useState<{ title?: string[]; content?: string[] }>({});

  /* ---------- Fetch ---------- */
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const resp = await getAllBlogPosts(currentPage, pageSize, search);
        if (resp.success) {
          setPosts(resp.data || []);
          setTotalPages(resp.totalPages || 0);
        } else {
          toast.error(resp.errors?.[0] || 'Помилка завантаження статей блогу.');
          setPosts([]);
          setTotalPages(0);
        }
      } catch {
        toast.error('Помилка завантаження статей блогу.');
        setPosts([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [currentPage, pageSize, search]);

  /* ---------- Create / Update ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = blogPostSchema.safeParse(formData);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setFormErrors(fe);
      return;
    }
    setFormErrors({});

    try {
      if (editingPost) {
        // Keep explicit for now, implement when API is ready
        toast.error('Оновлення статей поки не реалізовано');
        return;
      }

      // Image upload: keep placeholder (align with your products flow later)
      const images: TImageUpload[] = [];

      const payload: TCreateBlogPost = {
        title: parsed.data.title,
        content: parsed.data.content,
        images,
      };
      const resp = await createBlogPost(payload);

      if (resp.success) {
        toast.success('Статтю створено успішно!');
        setShowForm(false);
        setEditingPost(null);
        setFormData({ title: '', content: '' });
        // refresh to first page to show newest on top (if sorting desc by id/createdAt on backend)
        setCurrentPage(0);
      } else {
        toast.error(resp.errors?.[0] || 'Помилка створення статті.');
      }
    } catch {
      toast.error('Помилка створення статті.');
    }
  };

  const handleEdit = (post: TBlogPost) => {
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content });
    setShowForm(true);
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цю статтю?')) return;
    try {
      const resp = await deleteBlogPost(postId);
      if (resp.success) {
        toast.success('Статтю видалено успішно!');
        // reload current page
        setCurrentPage((p) => p);
      } else {
        toast.error(resp.errors?.[0] || 'Помилка видалення статті.');
      }
    } catch {
      toast.error('Помилка видалення статті.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({ title: '', content: '' });
    setFormErrors({});
  };

  const onView = (id: number) => router.push(`/blog/${id}`);

  const headerSubtitle = useMemo(
    () => (editingPost ? 'Редагування існуючої статті' : 'Створення нової статті'),
    [editingPost]
  );

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Text.Header>Блог</Text.Header>
            <Text.Span className="text-gray-500">Список статей, створення та видалення</Text.Span>
          </div>

          <div className="flex items-center gap-3">
            {/* Page size */}
            <div className="hidden md:block">
              <select
                value={pageSize}
                onChange={(e) => {
                  setCurrentPage(0);
                  setPageSize(Number(e.target.value));
                }}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm"
              >
                {[12, 24, 48].map((n) => (
                  <option key={n} value={n}>
                    {n} / стор.
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Пошук за заголовком…"
                value={search}
                onChange={(e) => {
                  setCurrentPage(0);
                  setSearch(e.target.value);
                }}
                className="pr-10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
                ⌘K
              </span>
            </div>

            <Button
              onClick={() => {
                setShowForm(true);
                setEditingPost(null);
                setFormData({ title: '', content: '' });
                setFormErrors({});
              }}
            >
              Додати статтю
            </Button>
          </div>
        </div>

        {/* Create / Edit */}
        {showForm && (
          <SectionCard title={editingPost ? 'Редагувати статтю' : 'Створити статтю'} subtitle={headerSubtitle}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Заголовок" required>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Введіть заголовок статті"
                  />
                  {formErrors.title && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.title[0]}</p>
                  )}
                </Field>

                {/* Optional quick actions spot (e.g., status, tags) */}
                <div />
              </div>

              <Field label="Зміст" required hint="Можна вставити HTML/Markdown (за підтримки фронту).">
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Введіть зміст статті"
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-secondary-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {formErrors.content && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.content[0]}</p>
                )}
              </Field>

              {/* TODO: add image uploader to produce TImageUpload[] like in products */}
              <div className="flex gap-3 justify-end">
                <Button type="submit" className="px-6">
                  {editingPost ? 'Оновити' : 'Створити'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel} className="px-5">
                  Скасувати
                </Button>
              </div>
            </form>
          </SectionCard>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Заголовок</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Автор</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Створено</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Дії</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4 text-sm text-gray-900">{p.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 shrink-0 rounded-md bg-gray-100 overflow-hidden border border-gray-200">
                          {p.mainImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.mainImageUrl}
                              alt={p.title}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <span className="font-medium">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{p.author || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {p.createdAt ? format(new Date(p.createdAt), 'dd.MM.yyyy') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1"
                          onClick={() => handleEdit(p)}
                        >
                          Редагувати
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                          onClick={() => handleDelete(p.id)}
                        >
                          Видалити
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1 text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600"
                          onClick={() => onView(p.id)}
                        >
                          Переглянути
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Статей не знайдено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Сторінка <span className="font-medium">{currentPage + 1}</span> з{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2"
                >
                  Попередня
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2"
                >
                  Наступна
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </RubikLoadable>
  );
};
