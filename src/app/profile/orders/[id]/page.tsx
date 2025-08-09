import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getOrderDetails } from '@/app/actions/orders';
import { getCurrentUser } from '@/app/actions/auth';

type TProps = {
  params: { id: string };
};

export default async function OrderDetailPage({ params }: TProps) {
  const { success: userOk, data: user } = await getCurrentUser();
  if (!userOk || !user) {
    return (
      <Container className="mt-10 mb-16">
        <Text.Paragraph className="text-gray-600">Потрібно увійти, щоб переглянути замовлення</Text.Paragraph>
        <Link href="/login" className="text-primary underline">Увійти</Link>
      </Container>
    );
  }

  const res = await getOrderDetails(user.id, Number(params.id));
  if (!res.success || !res.data) {
    return (
      <Container className="mt-10 mb-16">
        <Text.Paragraph className="text-gray-600">Не вдалося завантажити замовлення</Text.Paragraph>
        <Link href="/profile/orders" className="text-primary underline">← Повернутися до списку</Link>
      </Container>
    );
  }

  const order = res.data;

  return (
    <Container className="mt-10 mb-16 space-y-8">
      <div className="flex items-center justify-between">
        <Text.Header>Замовлення №{order.id}</Text.Header>
        <Link href="/profile/orders" className="text-sm underline text-gray-600 hover:text-primary">
          ← До списку замовлень
        </Link>
      </div>

      {/* Статус і дата */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <Text.Paragraph className="font-semibold">Статус: {order.orderStatus}</Text.Paragraph>
          <Text.Span className="text-gray-500 text-sm">
            Створено: {new Date(order.createdAt).toLocaleString('uk-UA')}
          </Text.Span>
        </div>
        <div>
          <Text.Span className="text-gray-500">Очікувана доставка:</Text.Span>{' '}
          {order.deliveryDetails?.expectedDeliveryDate || '—'}
        </div>
      </div>

      {/* Адреса та доставка */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <Text.Subheader>Доставка</Text.Subheader>
        <div className="text-sm text-gray-700">
          <p><span className="text-gray-500">Тип: </span>{order.deliveryDetails?.deliveryType}</p>
          <p><span className="text-gray-500">Оплата: </span>{order.deliveryDetails?.paymentMethod}</p>
          {order.deliveryDetails?.city && (
            <p><span className="text-gray-500">Місто: </span>{order.deliveryDetails.city}</p>
          )}
          {order.deliveryDetails?.street && (
            <p>
              <span className="text-gray-500">Вулиця: </span>
              {order.deliveryDetails.street} {order.deliveryDetails.houseNumber || ''}
              {order.deliveryDetails.flatNumber ? `, кв. ${order.deliveryDetails.flatNumber}` : ''}
            </p>
          )}
          {order.deliveryDetails?.department && (
            <p><span className="text-gray-500">Відділення: </span>{order.deliveryDetails.department}</p>
          )}
          {order.deliveryDetails?.deliveryPrice != null && (
            <p><span className="text-gray-500">Вартість доставки: </span>{order.deliveryDetails.deliveryPrice}₴</p>
          )}
        </div>
      </div>

      {/* Покупець */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <Text.Subheader>Покупець</Text.Subheader>
        <div className="text-sm text-gray-700">
          <p>
            {order.customerDetails?.lastName} {order.customerDetails?.firstName} {order.customerDetails?.middleName || ''}
          </p>
          <p>{order.customerDetails?.phoneNumber}</p>
          <p>{order.customerDetails?.email}</p>
        </div>
      </div>

      {/* Товари */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <Text.Subheader className="mb-4">Товари</Text.Subheader>
        <ul className="divide-y divide-gray-100">
          {order.orderedItems?.map((item: any) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              {item.mainImg && (
                <Image
                  src={item.mainImg}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-lg border border-gray-100 object-cover"
                />
              )}
              <div className="flex-1">
                <Text.Paragraph className="font-medium">{item.name}</Text.Paragraph>
                <Text.Span className="text-gray-500 text-sm">Кількість: {item.quantity}</Text.Span>
              </div>
              <Text.Paragraph className="font-semibold">{item.price}₴</Text.Paragraph>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
