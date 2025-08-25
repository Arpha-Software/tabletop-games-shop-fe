// src/app/admin/ui/components/UsersTab/UsersTab.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { RubikLoadable } from '../../../../ui/components/Loader';
import { getUsers, type TUserAdmin, type PageResponse } from '@/app/actions/users';

const ROLES = ['ADMIN', 'MANAGER', 'CUSTOMER'];

export const UsersTab = () => {
  const router = useRouter();

  // paging & filters
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');

  // data
  const [users, setUsers] = useState<TUserAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const resp = await getUsers({
          page: currentPage,
          size: pageSize,
          sort: 'id,desc',
          q: search || undefined,
          role: role || undefined,
        });

        if (resp.success) {
          const data: PageResponse<TUserAdmin> = resp.data;
          setUsers(data.content || []);
          setTotalPages(data.totalPages || 0);
        } else {
          toast.error(resp.errors?.[0] || 'Помилка завантаження користувачів');
          setUsers([]);
          setTotalPages(0);
        }
      } catch (e) {
        toast.error('Помилка завантаження користувачів');
        setUsers([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [currentPage, pageSize, search, role]);

  const handleRowClick = (userId: number) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Text.Header>Користувачі</Text.Header>
            <Text.Span className="text-gray-500">Перегляд, пошук, фільтрація</Text.Span>
          </div>

          <div className="flex items-center gap-3">
            {/* Page size */}
            <div className="hidden md:block">
              <select
                value={pageSize}
                onChange={(e) => { setCurrentPage(0); setPageSize(Number(e.target.value)); }}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm"
              >
                {[12, 24, 48].map((n) => (
                  <option key={n} value={n}>{n} / стор.</option>
                ))}
              </select>
            </div>

            {/* Role filter */}
            <div className="hidden md:block">
              <select
                value={role}
                onChange={(e) => { setCurrentPage(0); setRole(e.target.value); }}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm"
              >
                <option value="">Всі ролі</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Пошук (імʼя / email)…"
                value={search}
                onChange={(e) => { setCurrentPage(0); setSearch(e.target.value); }}
                className="pr-10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-50">⌘K</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Імʼя</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Прізвище</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Телефон</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Роль</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50/60 cursor-pointer"
                    onClick={() => handleRowClick(u.id)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{u.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{u.firstName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{u.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{u.phone ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{u.role}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Користувачів не знайдено
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
