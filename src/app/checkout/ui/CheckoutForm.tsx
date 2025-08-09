'use client';

import { useMemo, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text } from '@/utils/ui/Text';
import { cn } from '@/utils/helpers';

import { Button } from '@/app/ui/components/Button';
import { Input } from '@/app/ui/components/Input/Input';

import { createOrder } from '@/app/actions/orders';
import { DELIVERY_TYPES, PAYMENT_METHODS, type DeliveryType, type PaymentMethod } from '@/utils/orderTypes';
import { useCartContext } from '@/context/cart/context';
import { UserContext, useUserContext } from '@/context/user/context';

export const CheckoutForm = () => {
  const router = useRouter();
  const { cart, clearCart } = useCartContext();
  const { user } = useUserContext();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill date (optional): today + 2
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  }, []);

  const orderedItems = useMemo(
    () => (cart?.items || []).map(i => ({ productId: Number(i.product.id), quantity: i.quantity })),
    [cart]
  );

  useEffect(() => {
    // якщо кошик пустий — не мучимо користувача формою
    if (!cart || cart.items.length === 0) router.replace('/catalogue');
  }, [cart, router]);

  if (!cart || cart.items.length === 0) return null;

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        customerDetails: {
          firstName: String(formData.get('firstName') || '').trim(),
          middleName: String(formData.get('middleName') || '').trim() || undefined,
          lastName: String(formData.get('lastName') || '').trim(),
          phoneNumber: String(formData.get('phone') || '').trim(),
          email: String(formData.get('email') || '').trim(),
        },
        deliveryDetails: {
          deliveryType: formData.get('deliveryType') as DeliveryType,
          paymentMethod: formData.get('paymentMethod') as PaymentMethod,
          city: String(formData.get('city') || '') || undefined,
          cityCode: String(formData.get('cityCode') || '') || undefined,
          street: String(formData.get('street') || '') || undefined,
          streetCode: String(formData.get('streetCode') || '') || undefined,
          houseNumber: String(formData.get('houseNumber') || '') || undefined,
          flatNumber: String(formData.get('flatNumber') || '') || undefined,
          department: String(formData.get('department') || '') || undefined,
          departmentCode: String(formData.get('departmentCode') || '') || undefined,
          docNumber: String(formData.get('docNumber') || '') || undefined,
          expectedDeliveryDate: String(formData.get('expectedDeliveryDate') || '') || undefined,
          deliveryPrice: Number(formData.get('deliveryPrice') || 0),
        },
        orderedItems,
      } as const;

      // базова валідація
      if (!payload.customerDetails.firstName || !payload.customerDetails.lastName)
        throw new Error('Імʼя та прізвище обовʼязкові');
      if (!/^\+?\d[\d\s\-()]{7,}$/.test(payload.customerDetails.phoneNumber))
        throw new Error('Невірний номер телефону');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customerDetails.email))
        throw new Error('Невірний email');

      const res = await createOrder(payload);
      if (!res.success || !res.data?.id) throw new Error(res.errors?.[0] || 'Не вдалось створити замовлення');

      clearCart();
      router.replace(`/checkout/success/${res.data.id}`);
    } catch (e: any) {
      setError(e.message || 'Сталася помилка');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: Forms */}
      <div className="lg:col-span-2 space-y-6">
        {/* Contact */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <Text.Subheader className="mb-1">Контактні дані</Text.Subheader>
          <Text.Span className="text-gray-500 text-xs">Ми не передаємо ваші дані третім сторонам</Text.Span>

          <form id="checkout-form" action={onSubmit} className="mt-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Ім’я *">
                <Input name="firstName" placeholder="Ім’я" required defaultValue={user?.firstName || ''} />
              </Field>
              <Field label="По батькові">
                <Input name="middleName" placeholder="По батькові" defaultValue={user?.middleName || ''} />
              </Field>
              <Field label="Прізвище *">
                <Input name="lastName" placeholder="Прізвище" required defaultValue={user?.lastName || ''} />
              </Field>
              <Field label="Телефон *" className="md:col-span-2">
                <Input name="phone" placeholder="+380..." required defaultValue={user?.phoneNumber || ''} />
              </Field>
              <Field label="Email *">
                <Input name="email" placeholder="you@example.com" required defaultValue={user?.email || ''} />
              </Field>
            </div>

            {/* Delivery */}
            <div className="mt-2">
              <Text.Subheader className="mb-4">Доставка та оплата</Text.Subheader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Тип доставки">
                  <select name="deliveryType" className="w-full text-xs px-4 py-3 rounded-lg border-[0.5px] border-[#DCDCDC] bg-secondary-100 focus:outline-none focus:border-secondary">
                    <option value="PICK_UP">Самовивіз</option>
                    <option value="NOVA_POSHTA_DEPARTMENT">НП — відділення</option>
                    <option value="NOVA_POSHTA_POSHTMAT">НП — поштомат</option>
                    <option value="NOVA_POSHTA_COURIER">НП — курʼєр</option>
                  </select>
                </Field>

                <Field label="Оплата">
                  <select name="paymentMethod" className="w-full text-xs px-4 py-3 rounded-lg border-[0.5px] border-[#DCDCDC] bg-secondary-100 focus:outline-none focus:border-secondary">
                    <option value="CASH">Готівка</option>
                    <option value="NON_CASH">Карта/безготівка</option>
                    <option value="ONLINE">Онлайн</option>
                  </select>
                </Field>

                <Field label="Вартість доставки, ₴">
                  <Input name="deliveryPrice" type="number" min={0} step="1" placeholder="0" defaultValue={0} />
                </Field>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <Field label="Місто">
                  <Input name="city" placeholder="Київ" />
                </Field>
                <Field label="Вулиця">
                  <Input name="street" placeholder="Хрещатик" />
                </Field>
                <Field label="Будинок">
                  <Input name="houseNumber" placeholder="10" />
                </Field>
                <Field label="Кв./офіс">
                  <Input name="flatNumber" placeholder="25" />
                </Field>
                <Field label="Відділення/поштомат" className="md:col-span-2">
                  <Input name="department" placeholder="№123" />
                </Field>
                <Field label="Очікувана дата">
                  <Input name="expectedDeliveryDate" type="date" defaultValue={defaultDate} />
                </Field>
                <Field label="Документ (НП)">
                  <Input name="docNumber" placeholder="TTN/EN" />
                </Field>
              </div>
            </div>
          </form>
        </section>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl p-4">
            <Text.Span>{error}</Text.Span>
          </div>
        )}
      </div>

      {/* RIGHT: Summary */}
      <aside className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
        <Text.Subheader className="mb-4">Замовлення</Text.Subheader>

        <div className="space-y-3 mb-4">
          {cart.items.map(i => (
            <div key={i.id} className="flex items-start justify-between gap-3">
              <span className="text-sm truncate">{i.product.name} × {i.quantity}</span>
              <span className="text-sm font-semibold">{i.product.price * i.quantity}₴</span>
            </div>
          ))}
        </div>

        <div className="py-3 border-t border-gray-100 flex justify-between mb-4">
          <Text.Paragraph className="font-semibold">Разом</Text.Paragraph>
          <Text.Paragraph className="font-bold text-primary">{cart.total}₴</Text.Paragraph>
        </div>

        <Button
          form="checkout-form"
          type="submit"
          disabled={submitting}
          className={cn(
            'w-full bg-primary text-white rounded-xl py-4 hover:bg-primary/90 transition',
            submitting && 'opacity-70 cursor-not-allowed'
          )}
        >
          {submitting ? 'Створюємо...' : 'Підтвердити замовлення'}
        </Button>

        <Text.Span className="block text-[11px] text-gray-500 mt-3">
          Натискаючи кнопку, ви погоджуєтесь з умовами використання та політикою конфіденційності.
        </Text.Span>
      </aside>
    </div>
  );
};

/** Small label wrapper for consistent spacing/typography */
function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('flex flex-col gap-1', className)}>
      <span className="text-[11px] text-gray-600">{label}</span>
      {children}
    </label>
  );
}
