import Link from 'next/link';
import { Container } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getOrders } from '@/app/actions/orders';

type TProps = {
  searchParams?: { page?: string; size?: string };
};

export default async function OrdersPage({ searchParams }: TProps) {
  const page = Number(searchParams?.page ?? 0);
  const size = Number(searchParams?.size ?? 10);

  const res = await getOrders({ page, size, sort: 'createdAt,desc' });
  const pageData = res?.data ?? {
    content: [],
    totalPages: 0,
    number: 0,
    first: true,
    last: true,
    totalElements: 0,
  };

  const items: Array<any> = pageData.content ?? [];

  return (
    <Container className="mt-10 mb-16">
      <div className="flex items-center justify-between mb-6">
        <Text.Header>Мої замовлення</Text.Header>
        <Link
          href="/profile"
          className="text-sm underline text-gray-600 hover:text-primary"
        >
          ← До профілю
        </Link>
      </div>

      {(!items || items.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Text.Paragraph className="text-gray-600 mb-3">Замовлень поки немає</Text.Paragraph>
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
              <li key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <Text.Paragraph className="font-semibold">Замовлення №{o.id}</Text.Paragraph>
                    <Text.Span className="text-gray-500 text-sm">
                      {new Date(o.createdAt).toLocaleString('uk-UA')}
                    </Text.Span>
                  </div>

                  <span className="px-3 py-1 text-xs rounded-full bg-secondary-100 border border-gray-200">
                    {o.orderStatus}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="text-gray-700">
                    <span className="text-gray-500">Адреса: </span>
                    {o.city ? `${o.city}, ` : ''}
                    {o.street ? `${o.street} ${o.houseNumber || ''}`.trim() : ''}
                    {o.flatNumber ? `, кв. ${o.flatNumber}` : ''}
                    {(!o.street && o.department) ? `Відділення: ${o.department}` : ''}
                  </div>
                  <div className="text-gray-700">
                    <span className="text-gray-500">Очікувана дата: </span>
                    {o.expectedDeliveryDate || '—'}
                  </div>
                  <div className="text-gray-700">
                    <span className="text-gray-500">Створено: </span>
                    {new Date(o.createdAt).toLocaleDateString('uk-UA')}
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={`/profile/orders/${o.id}`} className="text-sm underline text-primary hover:opacity-80">
                    Деталі замовлення
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* Пагінація */}
          <div className="mt-8 flex items-center justify-between">
            <Link
              href={`/profile/orders?page=${Math.max(0, page - 1)}&size=${size}`}
              className={`px-4 py-2 rounded-xl border ${pageData.first ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'}`}
            >
              Попередня
            </Link>
            <span className="text-sm text-gray-600">
              Сторінка {pageData.number + 1} з {Math.max(1, pageData.totalPages || 1)}
            </span>
            <Link
              href={`/profile/orders?page=${page + 1}&size=${size}`}
              className={`px-4 py-2 rounded-xl border ${pageData.last ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'}`}
            >
              Наступна
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}
