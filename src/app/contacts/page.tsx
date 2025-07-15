import { Container } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";

export default function Contacts() {
  return (
    <Container className="mt-10 mb-16">
      <div className="max-w-4xl mx-auto">
        <Text.Header className="text-center mb-12">
          Контакти
        </Text.Header>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <Text.Subheader className="text-xl font-bold mb-4 text-primary">
                Наші контакти
              </Text.Subheader>
              
              <div className="space-y-4">
                <div>
                  <Text.Span className="font-bold text-gray-700">Email:</Text.Span>
                  <Text.Paragraph className="mt-1">example@gmail.com</Text.Paragraph>
                </div>
                
                <div>
                  <Text.Span className="font-bold text-gray-700">Телефон:</Text.Span>
                  <Text.Paragraph className="mt-1">+380935876935</Text.Paragraph>
                </div>
                
                <div>
                  <Text.Span className="font-bold text-gray-700">Адреса:</Text.Span>
                  <Text.Paragraph className="mt-1">
                    м. Київ, вул. Хрещатик, 1<br />
                    01001, Україна
                  </Text.Paragraph>
                </div>
              </div>
            </div>

            <div>
              <Text.Subheader className="text-xl font-bold mb-4 text-primary">
                Графік роботи
              </Text.Subheader>
              
              <div className="space-y-2">
                <Text.Paragraph>Пн-Пт: 9:00 - 18:00</Text.Paragraph>
                <Text.Paragraph>Сб: 10:00 - 16:00</Text.Paragraph>
                <Text.Paragraph>Нд: Вихідний</Text.Paragraph>
              </div>
            </div>

            <div>
              <Text.Subheader className="text-xl font-bold mb-4 text-primary">
                Соціальні мережі
              </Text.Subheader>
              
              <div className="flex gap-4">
                <a href="https://t.me/" className="text-secondary hover:text-primary transition-colors">
                  <Text.Paragraph>Telegram</Text.Paragraph>
                </a>
                <a href="https://instagram.com/" className="text-secondary hover:text-primary transition-colors">
                  <Text.Paragraph>Instagram</Text.Paragraph>
                </a>
                <a href="https://twitter.com/" className="text-secondary hover:text-primary transition-colors">
                  <Text.Paragraph>Twitter</Text.Paragraph>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Text.Subheader className="text-xl font-bold mb-6 text-primary">
              Напишіть нам
            </Text.Subheader>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ім'я
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ваше ім'я"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Тема
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Тема повідомлення"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Повідомлення
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Ваше повідомлення..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-opacity-90 transition-colors"
              >
                Надіслати повідомлення
              </button>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
