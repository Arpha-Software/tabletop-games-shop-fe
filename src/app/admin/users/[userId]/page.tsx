'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Button } from '@/app/ui/components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock user and order data
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    firstName: 'Адміністратор',
    lastName: 'Системи',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T14:30:00Z',
  },
  {
    id: 2,
    email: 'ivan.petrenko@example.com',
    firstName: 'Іван',
    lastName: 'Петренко',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-05T10:15:00Z',
    lastLogin: '2024-01-14T16:45:00Z',
  },
  {
    id: 3,
    email: 'maria.kovalenko@example.com',
    firstName: 'Марія',
    lastName: 'Коваленко',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-08T12:20:00Z',
    lastLogin: '2024-01-13T09:30:00Z',
  },
  {
    id: 4,
    email: 'oleksandr.sydorenko@example.com',
    firstName: 'Олександр',
    lastName: 'Сидоренко',
    role: 'user',
    isActive: false,
    createdAt: '2024-01-10T15:45:00Z',
    lastLogin: '2024-01-12T11:20:00Z',
  },
];

const mockOrders = [
  // Example orders for userId 2
  {
    id: 101,
    userId: 2,
    date: '2024-01-10T12:00:00Z',
    items: [
      { name: 'Настільна гра "Монополія"', quantity: 1, price: 1200 },
      { name: 'Карти "UNO"', quantity: 2, price: 300 },
    ],
    total: 1800,
  },
  {
    id: 102,
    userId: 2,
    date: '2024-01-13T15:30:00Z',
    items: [
      { name: 'Настільна гра "Діксіт"', quantity: 1, price: 900 },
    ],
    total: 900,
  },
  {
    id: 104,
    userId: 2,
    date: '2024-01-15T10:00:00Z',
    items: [
      { name: 'Настільна гра "Колонізатори"', quantity: 1, price: 1500 },
    ],
    total: 1500,
  },
  {
    id: 105,
    userId: 2,
    date: '2024-01-18T18:45:00Z',
    items: [
      { name: 'Карти "Мафія"', quantity: 2, price: 400 },
    ],
    total: 800,
  },
  {
    id: 106,
    userId: 2,
    date: '2024-01-20T14:20:00Z',
    items: [
      { name: 'Настільна гра "Еліас"', quantity: 1, price: 700 },
    ],
    total: 700,
  },
  // Example orders for userId 3
  {
    id: 103,
    userId: 3,
    date: '2024-01-09T09:00:00Z',
    items: [
      { name: 'Настільна гра "Каркассон"', quantity: 1, price: 1100 },
    ],
    total: 1100,
  },
  {
    id: 107,
    userId: 3,
    date: '2024-01-12T11:30:00Z',
    items: [
      { name: 'Настільна гра "Аліас"', quantity: 1, price: 700 },
    ],
    total: 700,
  },
  {
    id: 108,
    userId: 3,
    date: '2024-01-14T16:00:00Z',
    items: [
      { name: 'Карти "UNO"', quantity: 3, price: 300 },
    ],
    total: 900,
  },
  {
    id: 109,
    userId: 3,
    date: '2024-01-17T13:15:00Z',
    items: [
      { name: 'Настільна гра "Монополія"', quantity: 1, price: 1200 },
    ],
    total: 1200,
  },
  {
    id: 110,
    userId: 3,
    date: '2024-01-21T09:45:00Z',
    items: [
      { name: 'Настільна гра "Діксіт"', quantity: 2, price: 900 },
    ],
    total: 1800,
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminUserPage({ params }: { params: { userId: string } }) {
  const userId = Number(params.userId);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('authToken');
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const authToken = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/users/${userId}`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Не вдалося завантажити користувача');
        setLoading(false);
      });
  }, [userId]);

  const userOrders = mockOrders.filter((order) => order.userId === userId);
  const orderCount = userOrders.length;
  const firstOrder = userOrders.length ? userOrders.reduce((a, b) => (a.date < b.date ? a : b)) : null;
  const lastOrder = userOrders.length ? userOrders.reduce((a, b) => (a.date > b.date ? a : b)) : null;

  // Prepare data for chart
  const chartData = userOrders.map(order => ({
    date: formatDate(order.date).split(',')[0],
    total: order.total,
  }));

  if (loading) return <div className="p-8">Завантаження...</div>;
  if (error || !user) return <div className="p-8 text-red-500">{error || 'Користувача не знайдено'}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Button onClick={() => window.history.back()} className="mb-4">Назад до користувачів</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-2">{user.firstName} {user.lastName}</h1>
          <div className="mb-2 text-gray-600">Email: <b className="text-black">{user.email}</b></div>
          {user.phone && <div className="mb-2 text-gray-600">Телефон: <b className="text-black">{user.phone}</b></div>}
          <div className="mb-2 text-gray-600">Роль: <b className="text-black">{user.role}</b></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-4">Статистика замовлень</h2>
          <div className="mb-2">Всього замовлень: <b>{orderCount}</b></div>
          <div className="mb-2">Перше замовлення: <b>{firstOrder ? formatDate(firstOrder.date) : '—'}</b></div>
          <div className="mb-2">Останнє замовлення: <b>{lastOrder ? formatDate(lastOrder.date) : '—'}</b></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Динаміка замовлень</h3>
        {chartData.length === 0 ? (
          <div>Немає замовлень для відображення графіку</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Замовлення</h3>
        {userOrders.length === 0 ? (
          <div>Немає замовлень</div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div key={order.id} className="border rounded p-4 bg-gray-50">
                <div className="mb-2">Дата: <b>{formatDate(order.date)}</b></div>
                <div>Склад замовлення:</div>
                <ul className="list-disc ml-6">
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.name} — {item.quantity} шт. × {item.price} грн</li>
                  ))}
                </ul>
                <div className="mt-2">Сума: <b>{order.total} грн</b></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 