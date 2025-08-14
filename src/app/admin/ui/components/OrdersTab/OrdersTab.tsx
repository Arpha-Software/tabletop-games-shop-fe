'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import toast from 'react-hot-toast';
import { RubikLoadable } from '../../../../ui/components/Loader';

// Mock data structure for orders
type TOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
};

const mockOrders: TOrder[] = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customerName: 'Іван Петренко',
    customerEmail: 'ivan@example.com',
    totalAmount: 1500,
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    items: [
      { productName: 'Монополія', quantity: 1, price: 1500 }
    ]
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    customerName: 'Марія Коваленко',
    customerEmail: 'maria@example.com',
    totalAmount: 2300,
    status: 'confirmed',
    createdAt: '2024-01-14T15:45:00Z',
    items: [
      { productName: 'Шахи', quantity: 1, price: 800 },
      { productName: 'Шашки', quantity: 1, price: 1500 }
    ]
  },
  {
    id: 3,
    orderNumber: 'ORD-003',
    customerName: 'Олександр Сидоренко',
    customerEmail: 'oleksandr@example.com',
    totalAmount: 3200,
    status: 'shipped',
    createdAt: '2024-01-13T09:15:00Z',
    items: [
      { productName: 'Ризик', quantity: 1, price: 1200 },
      { productName: 'Каркассон', quantity: 1, price: 2000 }
    ]
  }
];

const orderStatuses = [
  { value: 'pending', label: 'Очікує підтвердження', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Підтверджено', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Відправлено', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Доставлено', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Скасовано', color: 'bg-red-100 text-red-800' }
];

export const OrdersTab = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: TOrder['status']) => {
    try {
      // TODO: Implement actual API call to update order status
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Статус замовлення оновлено успішно!');
    } catch (error) {
      toast.error('Помилка оновлення статусу замовлення');
    }
  };

  const getStatusLabel = (status: TOrder['status']) => {
    return orderStatuses.find(s => s.value === status)?.label || status;
  };

  const getStatusColor = (status: TOrder['status']) => {
    return orderStatuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
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

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Text.Header>Управління замовленнями</Text.Header>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Номер замовлення
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клієнт
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сума
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.totalAmount} ₴
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Деталі
                        </Button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as TOrder['status'])}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {orderStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Замовлення не знайдено
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <Text.Header className="text-lg">Деталі замовлення {selectedOrder.orderNumber}</Text.Header>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Клієнт</label>
                    <p className="text-sm text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Сума</label>
                    <p className="text-sm text-gray-900">{selectedOrder.totalAmount} ₴</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Дата створення</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Товари</label>
                  <div className="border rounded-lg">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">Кількість: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{item.price} ₴</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RubikLoadable>
  );
}; 