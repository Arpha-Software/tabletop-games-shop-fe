'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { Pagination } from '@/app/ui/components/Pagination';
import { TOrder } from '@/utils/types';

const ITEMS_PER_PAGE = 10;

export const OrderManagement = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // TODO: Implement order status update
      toast.success('Статус замовлення успішно оновлено!');
    } catch (error) {
      toast.error('Помилка оновлення статусу замовлення.');
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Text.Header className="text-2xl text-gray-800">
          Управління замовленнями
        </Text.Header>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {orders.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Замовлення #{order.id}</h3>
                  <p className="text-gray-600">Статус: {order.status}</p>
                  <p className="text-gray-600">Дата: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Деталі
                  </Button>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className="p-2 border rounded-lg"
                  >
                    <option value="pending">Очікує</option>
                    <option value="processing">Обробляється</option>
                    <option value="shipped">Відправлено</option>
                    <option value="delivered">Доставлено</option>
                    <option value="cancelled">Скасовано</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Товари:</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="text-gray-600">
                        {item.quantity} x {item.price} грн
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Загальна сума:</span>
                    <span className="text-lg font-bold">{order.totalAmount} грн</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(orders.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">Деталі замовлення #{selectedOrder.id}</h2>
              <Button
                variant="secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Закрити
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Інформація про замовника:</h3>
                <p>Ім'я: {selectedOrder.customer.name}</p>
                <p>Email: {selectedOrder.customer.email}</p>
                <p>Телефон: {selectedOrder.customer.phone}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Адреса доставки:</h3>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Товари:</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Кількість: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{item.price * item.quantity} грн</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Загальна сума:</span>
                  <span className="text-xl font-bold">{selectedOrder.totalAmount} грн</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 