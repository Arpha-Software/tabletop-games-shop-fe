'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import toast from 'react-hot-toast';
import { Loader } from '@/app/ui/components/Loader';

// Mock data structure for users
type TUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
};

const mockUsers: TUser[] = [
  {
    id: 1,
    email: 'admin@example.com',
    firstName: 'Адміністратор',
    lastName: 'Системи',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T14:30:00Z'
  },
  {
    id: 2,
    email: 'ivan.petrenko@example.com',
    firstName: 'Іван',
    lastName: 'Петренко',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-05T10:15:00Z',
    lastLogin: '2024-01-14T16:45:00Z'
  },
  {
    id: 3,
    email: 'maria.kovalenko@example.com',
    firstName: 'Марія',
    lastName: 'Коваленко',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-08T12:20:00Z',
    lastLogin: '2024-01-13T09:30:00Z'
  },
  {
    id: 4,
    email: 'oleksandr.sydorenko@example.com',
    firstName: 'Олександр',
    lastName: 'Сидоренко',
    role: 'user',
    isActive: false,
    createdAt: '2024-01-10T15:45:00Z',
    lastLogin: '2024-01-12T11:20:00Z'
  }
];

const userRoles = [
  { value: 'user', label: 'Користувач' },
  { value: 'admin', label: 'Адміністратор' }
];

export const UsersTab = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<TUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [userData, setUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'user' as TUser['role'],
    isActive: true
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData.email.trim() || !userData.firstName.trim() || !userData.lastName.trim()) {
      toast.error('Всі поля повинні бути заповнені');
      return;
    }

    try {
      // TODO: Implement actual API call to create/update user
      if (editingUser) {
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? { ...user, ...userData } : user
        ));
        toast.success('Користувача оновлено успішно!');
      } else {
        const newUser: TUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...userData,
          createdAt: new Date().toISOString()
        };
        setUsers(prev => [...prev, newUser]);
        toast.success('Користувача створено успішно!');
      }
      
      setShowCreateForm(false);
      setUserData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'user',
        isActive: true
      });
      setEditingUser(null);
    } catch (error) {
      toast.error('Помилка збереження користувача');
    }
  };

  const handleEdit = (user: TUser) => {
    setEditingUser(user);
    setUserData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (userId: number) => {
    if (confirm('Ви впевнені, що хочете видалити цього користувача?')) {
      // TODO: Implement delete user API call
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('Користувача видалено успішно!');
    }
  };

  const handleToggleActive = async (userId: number) => {
    try {
      // TODO: Implement actual API call to toggle user status
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      ));
      toast.success('Статус користувача оновлено успішно!');
    } catch (error) {
      toast.error('Помилка оновлення статусу користувача');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setUserData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'user',
      isActive: true
    });
    setEditingUser(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Text.Header>Управління користувачами</Text.Header>
        <Button 
          variant="primary" 
          onClick={() => {
            setShowCreateForm(true);
            setEditingUser(null);
            setUserData({
              email: '',
              firstName: '',
              lastName: '',
              role: 'user',
              isActive: true
            });
          }}
        >
          Додати користувача
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Пошук користувачів..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {showCreateForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <Text.Header className="text-lg">
              {editingUser ? 'Редагувати користувача' : 'Створити нового користувача'}
            </Text.Header>
            <Button 
              variant="secondary" 
              onClick={handleCancel}
            >
              Скасувати
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="Введіть email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ім'я
                </label>
                <Input
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  placeholder="Введіть ім'я"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Прізвище
                </label>
                <Input
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  placeholder="Введіть прізвище"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Роль
                </label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {userRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={userData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Активний користувач
              </label>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" variant="primary">
                {editingUser ? 'Оновити' : 'Створити'}
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
                  Користувач
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата реєстрації
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Адміністратор' : 'Користувач'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Активний' : 'Неактивний'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="text-xs px-3 py-1"
                        onClick={() => handleEdit(user)}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant="secondary"
                        className={`text-xs px-3 py-1 ${
                          user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                        onClick={() => handleToggleActive(user.id)}
                      >
                        {user.isActive ? 'Деактивувати' : 'Активувати'}
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-xs px-3 py-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(user.id)}
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
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Користувачів не знайдено' : 'Користувачів не знайдено'}
          </div>
        )}
      </div>
    </div>
  );
}; 