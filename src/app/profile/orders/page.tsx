// src/app/profile/orders/page.tsx
import Link from 'next/link';
import { Container } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getOrdersByUser } from '@/app/actions/orders';
import { getCurrentUser } from '@/app/actions/auth';

const statusColors: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELED: 'bg-red-100 text-red-800 border-red-200',
};

const deliveryTypeLabel: Record<string, string> = {
  PICK_UP: 'Самовивіз',
  NOVA_POSHTA_DEPARTMENT: 'НП — відділення',
  NOVA_POSHTA_POSHTMAT: 'НП — поштомат',
  NOVA_POSHTA_COURIER: 'НП — курʼєр',
};

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('uk-UA') : '—';
const fmtDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('uk-UA') : '—';

type TProps = {
  searchParams?: { page?: string; size?: string };
};

export default async function OrdersPage({ searchParams }: TProps) {
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

  const page = Number(searchParams?.page ?? 0);
  const size = Number(searchParams?.size ?? 10);

  const res = await getOrdersByUser(user.id, { page, size, sort: 'createdAt,desc' });
  const pageData = res?.data ?? {
    content: [],
    totalPages: 0,
    number: 0,
    first: true,
    last: true,
  };
  const items: Array<any> = pageData.content ?? [];

  return (
    <Container className="mt-10 mb-16 space-y-8">
      <div className="flex items-center justify-between">
        <Text.Header>Мої замовлення</Text.Header>
        <Link
          href="/profile"
          className="text-sm underline text-gray-600 hover:text-primary"
        >
          ← До профілю
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Text.Paragraph className="text-gray-600 mb-3">
            Замовлень поки немає
          </Text.Paragraph>
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
          >
            Перейти до каталогу
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((o) => (
              <li
                key={o.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition"
              >
                {/* Верхня частина */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <div>
                    <Text.Paragraph className="font-semibold">
                      Замовлення №{o.id}
                    </Text.Paragraph>
                    <Text.Span className="text-gray-500 text-sm">
                      {fmtDateTime(o.createdAt)}
                    </Text.Span>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${
                      statusColors[o.orderStatus] ||
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    {o.orderStatus}
                  </span>
                </div>

                {/* Інфо */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="text-gray-500">Доставка: </span>
                    {deliveryTypeLabel[o.deliveryType] || o.deliveryType || '—'}
                  </div>
                  <div>
                    <span className="text-gray-500">Адреса: </span>
                    {o.city ? `${o.city}, ` : ''}
                    {o.street ? `${o.street} ${o.houseNumber || ''}`.trim() : ''}
                    {o.flatNumber ? `, кв. ${o.flatNumber}` : ''}
                    {!o.street && o.department
                      ? `Відділення: ${o.department}`
                      : ''}
                  </div>
                  <div>
                    <span className="text-gray-500">Очікувана дата: </span>
                    {fmtDate(o.expectedDeliveryDate)}
                  </div>
                  <div>
                    <span className="text-gray-500">Товарів: </span>
                    {o.orderQuantity ?? '—'}
                  </div>
                </div>

                {/* Низ */}
                <div className="mt-4 flex items-center justify-between">
                  <Text.Paragraph className="font-semibold">
                    Сума:{' '}
                    <span className="text-primary">
                      {o.orderPriceSummary ? `${o.orderPriceSummary}₴` : '—'}
                    </span>
                  </Text.Paragraph>
                  <Link
                    href={`/profile/orders/${o.id}`}
                    className="text-sm underline text-primary hover:opacity-80"
                  >
                    Деталі замовлення →
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* Пагінація */}
          <div className="mt-8 flex items-center justify-between">
            <Link
              href={`/profile/orders?page=${Math.max(0, page - 1)}&size=${size}`}
              className={`px-4 py-2 rounded-xl border ${
                pageData.first
                  ? 'pointer-events-none opacity-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              Попередня
            </Link>
            <span className="text-sm text-gray-600">
              Сторінка {pageData.number + 1} з{' '}
              {Math.max(1, pageData.totalPages || 1)}
            </span>
            <Link
              href={`/profile/orders?page=${page + 1}&size=${size}`}
              className={`px-4 py-2 rounded-xl border ${
                pageData.last
                  ? 'pointer-events-none opacity-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              Наступна
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}
