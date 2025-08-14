'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { RubikLoadable } from '../../../../ui/components/Loader';

// Mock data structure for users
type TUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
};

export const UsersTab = () => {
  const router = useRouter();
  const [users, setUsers] = useState<TUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { apiCall, loading, error } = useApi();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await apiCall(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/users`);
      if (data) {
        setUsers(data.content || []);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId: number) => {
    router.push(`/admin/users/${userId}`);
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Input
            type="text"
            placeholder="Пошук користувача..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ім'я</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Прізвище</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} onClick={() => handleUserClick(user.id)} style={{ cursor: 'pointer' }} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RubikLoadable>
  );
};
