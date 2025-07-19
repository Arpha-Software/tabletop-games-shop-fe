import { Text } from '@/utils/ui/Text';

const deliveryInfo = {
  methods: [
    { name: 'Нова Пошта', details: 'Доставка у відділення або кур’єром. Термін: 1-2 дні.' },
    { name: 'Укрпошта', details: 'Доставка у відділення. Термін: 2-4 дні.' },
  ],
  payment: [
    'Онлайн карткою (Visa/MasterCard)',
    'Готівкою при отриманні',
    'Apple Pay/Google Pay',
  ],
  note: 'Вартість доставки розраховується згідно тарифів перевізника. Замовлення понад 2000₴ — доставка безкоштовна!',
};

export const DeliveryInfo = () => {
  return (
    <div className="py-6">
      <Text.Header className="mb-4 text-xl">Доставка та оплата</Text.Header>
      <div className="mb-4">
        <Text.Subheader className="mb-2 text-lg">Способи доставки</Text.Subheader>
        <ul className="list-disc ml-6 text-base text-gray-700">
          {deliveryInfo.methods.map((m, i) => (
            <li key={i}><span className="font-bold">{m.name}:</span> {m.details}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <Text.Subheader className="mb-2 text-lg">Оплата</Text.Subheader>
        <ul className="list-disc ml-6 text-base text-gray-700">
          {deliveryInfo.payment.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
      <Text.Paragraph className="text-primary font-medium mt-2">{deliveryInfo.note}</Text.Paragraph>
    </div>
  );
};
