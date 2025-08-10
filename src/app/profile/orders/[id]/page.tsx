// src/app/profile/orders/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getOrderDetails } from '@/app/actions/orders';
import { getCurrentUser } from '@/app/actions/auth';

// Friendly labels for enums you actually use
const deliveryTypeLabel: Record<string, string> = {
  PICK_UP: 'Самовивіз',
  NOVA_POSHTA_DEPARTMENT: 'НП — відділення',
  NOVA_POSHTA_POSHTMAT: 'НП — поштомат',
  NOVA_POSHTA_COURIER: 'НП — курʼєр',
};

const paymentMethodLabel: Record<string, string> = {
  CASH: 'Готівка',
  NON_CASH: 'Безготівка',
  ONLINE: 'Онлайн оплата',
};

const statusColors: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELED: 'bg-red-100 text-red-800 border-red-200',
};

// Fallbacks
const fmtDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('uk-UA') : '—';
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('uk-UA') : '—';

type TProps = {
  params: { id: string };
};

export default async function OrderDetailPage({ params }: TProps) {
  const { success: userOk, data: user } = await getCurrentUser();
  if (!userOk || !user) {
    return (
      <Container className="mt-10 mb-16">
        <Text.Paragraph className="text-gray-600">
          Потрібно увійти, щоб переглянути замовлення
        </Text.Paragraph>
        <Link href="/login" className="text-primary underline">
          Увійти
        </Link>
      </Container>
    );
  }

  const res = await getOrderDetails(user.id, Number(params.id));
  if (!res.success || !res.data) {
    return (
      <Container className="mt-10 mb-16">
        <Text.Paragraph className="text-gray-600">
          Не вдалося завантажити замовлення
        </Text.Paragraph>
        <Link href="/profile/orders" className="text-primary underline">
          ← Повернутися до списку
        </Link>
      </Container>
    );
  }

  const order = res.data;
  console.log('ORDERRRRRR', order)
  const d = order.deliveryDetails || {};
  const c = order.customerDetails || {};
  const statusHistory: Array<{ status: string; changedAt: string; note?: string }> =
    Array.isArray(order.statusHistory) ? order.statusHistory : [];

  return (
    <Container className="mt-10 mb-16 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Text.Header>Замовлення №{order.id}</Text.Header>
        <Link
          href="/profile/orders"
          className="text-sm underline text-gray-600 hover:text-primary"
        >
          ← До списку замовлень
        </Link>
      </div>

      {/* Status & key dates */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs rounded-full border ${
              statusColors[order.orderStatus] ||
              'bg-gray-100 text-gray-800 border-gray-200'
            }`}
          >
            {order.orderStatus}
          </span>
          <span className="text-sm text-gray-500">
            Створено: {fmtDateTime(order.createdAt)}
          </span>
        </div>
        {d.expectedDeliveryDate && (
          <div className="text-sm">
            <span className="text-gray-500">Очікувана доставка: </span>
            {fmtDate(d.expectedDeliveryDate)}
          </div>
        )}
      </div>

      {/* Delivery (user-friendly) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <Text.Subheader>Доставка</Text.Subheader>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs rounded-full border bg-secondary-100 border-gray-200">
              {deliveryTypeLabel[d.deliveryType] || d.deliveryType || '—'}
            </span>
            <span className="px-3 py-1 text-xs rounded-full border bg-secondary-100 border-gray-200">
              {paymentMethodLabel[d.paymentMethod] || d.paymentMethod || '—'}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <span className="text-gray-500">Місто: </span>
            {d.city || '—'}
            {d.cityCode ? ` (код: ${d.cityCode})` : ''}
          </p>

          {/* If courier or street present */}
          {(d.deliveryType === 'NOVA_POSHTA_COURIER' || d.street) && (
            <p>
              <span className="text-gray-500">Вулиця: </span>
              {d.street || '—'}
              {d.streetCode ? ` (код: ${d.streetCode})` : ''}
            </p>
          )}

          {(d.deliveryType === 'NOVA_POSHTA_COURIER' || d.houseNumber) && (
            <p>
              <span className="text-gray-500">Будинок: </span>
              {d.houseNumber || '—'}
            </p>
          )}

          {(d.deliveryType === 'NOVA_POSHTA_COURIER' || d.flatNumber) && (
            <p>
              <span className="text-gray-500">Квартира/офіс: </span>
              {d.flatNumber || '—'}
            </p>
          )}

          {/* Department for non-courier */}
          {(d.deliveryType !== 'NOVA_POSHTA_COURIER' || d.department) && (
            <p className="md:col-span-2">
              <span className="text-gray-500">Відділення/поштомат: </span>
              {d.department || '—'}
              {d.departmentCode ? ` (код: ${d.departmentCode})` : ''}
            </p>
          )}
        </div>

        {/* Service info row */}
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700 pt-4 border-t border-gray-100">
          <p>
            <span className="text-gray-500">№ накладної (ТТН): </span>
            {d.docNumber || '—'}
          </p>
          <p>
            <span className="text-gray-500">Вартість доставки: </span>
            {typeof d.deliveryPrice === 'number' ? `${d.deliveryPrice}₴` : '—'}
          </p>
          <p>
            <span className="text-gray-500">Дата доставки: </span>
            {fmtDate(d.expectedDeliveryDate)}
          </p>
        </div>
      </div>

      {/* Customer */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <Text.Subheader>Покупець</Text.Subheader>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <span className="text-gray-500">ПІБ: </span>
            {[c.lastName, c.firstName, c.middleName].filter(Boolean).join(' ') || '—'}
          </p>
          <p>
            <span className="text-gray-500">Телефон: </span>
            {c.phoneNumber || '—'}
          </p>
          <p className="md:col-span-2">
            <span className="text-gray-500">Email: </span>
            {c.email || '—'}
          </p>
        </div>
      </div>

      {/* Status History (timeline) */}
      {statusHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <Text.Subheader className="mb-4">Історія статусів</Text.Subheader>
          <ol className="relative border-s border-gray-200 ps-4">
            {statusHistory.map((h, idx) => (
              <li key={`${h.status}-${h.changedAt}-${idx}`} className="mb-5 ms-2">
                <span className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full bg-primary/70"></span>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${
                      statusColors[h.status] ||
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    {h.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {fmtDateTime(h.changedAt)}
                  </span>
                </div>
                {h.note && (
                  <p className="mt-1 text-sm text-gray-600">{h.note}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <Text.Subheader className="mb-4">Товари</Text.Subheader>
        <ul className="divide-y divide-gray-100">
          {order.orderedItems?.map((item: any) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              {item.mainImg ? (
                <Image
                  src={item.mainImg}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-lg border border-gray-100 object-cover"
                />
              ) : (
                <div className="w-[60px] h-[60px] rounded-lg border border-gray-100 bg-gray-50" />
              )}

              <div className="flex-1 min-w-0">
                <Text.Paragraph className="font-medium truncate">
                  {item.name}
                </Text.Paragraph>
                <Text.Span className="text-gray-500 text-sm">
                  Кількість: {item.quantity}
                </Text.Span>
              </div>

              <div className="text-right">
                <Text.Paragraph className="font-semibold">{item.price}₴</Text.Paragraph>
                <Text.Span className="text-gray-500 text-xs">
                  Разом: {(item.price || 0) * (item.quantity || 0)}₴
                </Text.Span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <Text.Paragraph className="font-semibold">Всього</Text.Paragraph>
          <Text.Paragraph className="font-bold text-primary">{order.orderPriceSummary}₴</Text.Paragraph>
        </div>
      </div>
    </Container>
  );
}
