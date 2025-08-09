import { Container } from '@/app/ui/components';
import { CheckoutForm } from './ui/CheckoutForm';
import { Text } from '@/utils/ui/Text';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return (
    <Container className="mt-10 mb-16">
      <Text.Header className="mb-6">Оформлення замовлення</Text.Header>
      <CheckoutForm />
    </Container>
  );
}
