import { Container } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";

export default function Delivery() {
  return (
    <Container className="mt-10 mb-16">
      <div className="max-w-4xl mx-auto">
        <Text.Header className="text-center mb-12">
          Доставка
        </Text.Header>

        <div className="space-y-12">
          {/* Delivery Methods */}
          <div>
            <Text.Subheader className="text-2xl font-bold mb-6 text-primary">
              Способи доставки
            </Text.Subheader>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-card">
                <Text.Subheader className="text-xl font-bold mb-3 text-secondary">
                  Нова Пошта
                </Text.Subheader>
                <Text.Paragraph className="mb-3">
                  Доставка до відділення або поштомату в будь-якому місті України
                </Text.Paragraph>
                <div className="space-y-1">
                  <Text.Span className="text-sm text-gray-600">Термін: 1-2 дні</Text.Span>
                  <Text.Span className="text-sm text-gray-600 block">Вартість: від 70 грн</Text.Span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-card">
                <Text.Subheader className="text-xl font-bold mb-3 text-secondary">
                  Укрпошта
                </Text.Subheader>
                <Text.Paragraph className="mb-3">
                  Доставка до відділення пошти або адресна доставка
                </Text.Paragraph>
                <div className="space-y-1">
                  <Text.Span className="text-sm text-gray-600">Термін: 2-4 дні</Text.Span>
                  <Text.Span className="text-sm text-gray-600 block">Вартість: від 50 грн</Text.Span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-card">
                <Text.Subheader className="text-xl font-bold mb-3 text-secondary">
                  Кур'єрська доставка
                </Text.Subheader>
                <Text.Paragraph className="mb-3">
                  Доставка кур'єром до дверей у місті Київ
                </Text.Paragraph>
                <div className="space-y-1">
                  <Text.Span className="text-sm text-gray-600">Термін: 1 день</Text.Span>
                  <Text.Span className="text-sm text-gray-600 block">Вартість: від 100 грн</Text.Span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-card">
                <Text.Subheader className="text-xl font-bold mb-3 text-secondary">
                  Самовивіз
                </Text.Subheader>
                <Text.Paragraph className="mb-3">
                  Забір замовлення з нашого магазину
                </Text.Paragraph>
                <div className="space-y-1">
                  <Text.Span className="text-sm text-gray-600">Термін: В день замовлення</Text.Span>
                  <Text.Span className="text-sm text-gray-600 block">Вартість: Безкоштовно</Text.Span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Terms */}
          <div>
            <Text.Subheader className="text-2xl font-bold mb-6 text-primary">
              Умови доставки
            </Text.Subheader>
            
            <div className="bg-white p-6 rounded-lg shadow-card space-y-4">
              <div>
                <Text.Span className="font-bold text-gray-700">Мінімальна сума замовлення:</Text.Span>
                <Text.Paragraph className="mt-1">500 грн для безкоштовної доставки</Text.Paragraph>
              </div>
              
              <div>
                <Text.Span className="font-bold text-gray-700">Оплата:</Text.Span>
                <Text.Paragraph className="mt-1">
                  • Накладений платіж (оплата при отриманні)<br />
                  • Банківська карта онлайн<br />
                  • Готівка при самовивозі
                </Text.Paragraph>
              </div>
              
              <div>
                <Text.Span className="font-bold text-gray-700">Відстеження замовлення:</Text.Span>
                <Text.Paragraph className="mt-1">
                  Після оформлення замовлення ви отримаєте SMS з номером для відстеження
                </Text.Paragraph>
              </div>
            </div>
          </div>

          {/* Delivery Areas */}
          <div>
            <Text.Subheader className="text-2xl font-bold mb-6 text-primary">
              Зони доставки
            </Text.Subheader>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-card">
                <Text.Subheader className="text-lg font-bold mb-2 text-secondary">
                  Київ
                </Text.Subheader>
                <Text.Paragraph className="text-sm">
                  Доставка по всій території міста, включаючи всі райони
                </Text.Paragraph>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-card">
                <Text.Subheader className="text-lg font-bold mb-2 text-secondary">
                  Київська область
                </Text.Subheader>
                <Text.Paragraph className="text-sm">
                  Доставка до всіх районних центрів та великих населених пунктів
                </Text.Paragraph>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-card">
                <Text.Subheader className="text-lg font-bold mb-2 text-secondary">
                  Вся Україна
                </Text.Subheader>
                <Text.Paragraph className="text-sm">
                  Доставка до будь-якого міста України через Нову Пошту та Укрпошту
                </Text.Paragraph>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <Text.Subheader className="text-2xl font-bold mb-6 text-primary">
              Часті питання
            </Text.Subheader>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-card">
                <Text.Span className="font-bold text-gray-700">Чи можна змінити адресу доставки?</Text.Span>
                <Text.Paragraph className="mt-1">
                  Так, можна змінити адресу доставки до моменту відправки замовлення. Зв'яжіться з нами за телефоном або email.
                </Text.Paragraph>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-card">
                <Text.Span className="font-bold text-gray-700">Що робити, якщо товар не підійшов?</Text.Span>
                <Text.Paragraph className="mt-1">
                  Ви можете повернути товар протягом 14 днів з моменту отримання, якщо він не використовувався та зберігає товарний вигляд.
                </Text.Paragraph>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-card">
                <Text.Span className="font-bold text-gray-700">Чи можна забрати замовлення в інший час?</Text.Span>
                <Text.Paragraph className="mt-1">
                  Так, при самовивозі можна забрати замовлення в будь-який час роботи магазину. Графік роботи: Пн-Пт 9:00-18:00, Сб 10:00-16:00.
                </Text.Paragraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
