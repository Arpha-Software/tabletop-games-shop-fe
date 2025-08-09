import Link from 'next/link';
import { Container } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';

type Props = { params: { id: string } };

export default function OrderSuccessPage({ params }: Props) {
  return (
    <Container className="mt-10 mb-16 text-center">
      <Text.Header className="mb-2">Замовлення створено</Text.Header>
      <Text.Paragraph className="text-gray-600 mb-8">
        Дякуємо! Номер вашого замовлення: <span className="font-semibold">{params.id}</span>
      </Text.Paragraph>
      <Link
        href="/catalogue"
        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
      >
        До каталогу
      </Link>
    </Container>
  );
}
