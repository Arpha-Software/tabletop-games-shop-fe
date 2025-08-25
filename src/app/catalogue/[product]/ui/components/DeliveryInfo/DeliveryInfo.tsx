import { Text } from '@/utils/ui/Text';

const deliveryInfo = {
  methods: [
    { name: 'Нова Пошта', details: 'Доставка у відділення або кур’єром. Термін: 1–2 дні.' },
    { name: 'Укрпошта', details: 'Доставка у відділення. Термін: 2–4 дні.' },
  ],
  payment: [
    'Онлайн карткою (Visa/MasterCard)',
    'Готівкою при отриманні',
    'Apple Pay / Google Pay',
  ],
  note: 'Вартість доставки розраховується згідно тарифів перевізника. Замовлення понад 2000₴ — доставка безкоштовна!',
};

export const DeliveryInfo = () => {
  return (
    <section className="py-6">
      <div className="space-y-5">
        {/* Intro */}
        <div className="space-y-1">
          <Text.Header className="text-xl">Доставка та оплата</Text.Header>
          <p className="text-gray-600 text-sm">
            Обирайте зручний спосіб доставки та оплати. Деталі замовлення підтверджуються під час оформлення.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">🚚</span>
              <Text.Subheader className="text-lg">Способи доставки</Text.Subheader>
            </div>
            <ul className="space-y-3">
              {deliveryInfo.methods.map((m, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-sm text-gray-600">{m.details}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">💳</span>
              <Text.Subheader className="text-lg">Оплата</Text.Subheader>
            </div>
            <ul className="space-y-3">
              {deliveryInfo.payment.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm text-gray-700">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Note */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <p className="text-primary font-medium">{deliveryInfo.note}</p>
        </div>
      </div>
    </section>
  );
};
