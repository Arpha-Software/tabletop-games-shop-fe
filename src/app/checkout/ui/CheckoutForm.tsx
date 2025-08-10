// src/app/checkout/ui/CheckoutForm.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text } from '@/utils/ui/Text';
import { cn, roundToTwo } from '@/utils/helpers';
import { Button } from '@/app/ui/components/Button';
import { Input } from '@/app/ui/components/Input/Input';
import { createOrder } from '@/app/actions/orders';
import { type DeliveryType, type PaymentMethod } from '@/utils/orderTypes';
import { useCartContext } from '@/context/cart/context';
import { useUserContext } from '@/context/user/context';
import { DEFAULT_STORE_ADDRESS } from '@/utils/constants';
import { searchCities, searchStreets, searchWarehouses } from '@/app/actions/newPost';
import { useDebounce } from '@/hooks/useDebouce';

export const CheckoutForm = () => {
  const router = useRouter();
  const { cart, clearCart } = useCartContext();
  const { user } = useUserContext();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('PICK_UP');

  // NP state
  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [selectedCityRef, setSelectedCityRef] = useState<string | null>(null);

  const [streetInput, setStreetInput] = useState('');
  const [streetOptions, setStreetOptions] = useState<any[]>([]);

  const [warehouseInput, setWarehouseInput] = useState('');
  const [warehouseOptions, setWarehouseOptions] = useState<any[]>([]);
  const [selectedDepartmentRef, setSelectedDepartmentRef] = useState<string | null>(null); // <-- NEW

  const debouncedCity = useDebounce(cityInput, 400);
  const debouncedStreet = useDebounce(streetInput, 400);
  const debouncedWarehouse = useDebounce(warehouseInput, 400);

  const orderedItems = useMemo(
    () => (cart?.items || []).map(i => ({ productId: Number(i.product.id), quantity: i.quantity })),
    [cart]
  );

  // Reset when type changes
  useEffect(() => {
    if (deliveryType === 'PICK_UP') {
      setCityInput('Львів');
      setSelectedCityRef(null);
      setStreetInput(DEFAULT_STORE_ADDRESS);
      setStreetOptions([]);
      setWarehouseInput('');
      setWarehouseOptions([]);
      setSelectedDepartmentRef(null);
    } else {
      setCityInput('');
      setSelectedCityRef(null);
      setStreetInput('');
      setStreetOptions([]);
      setWarehouseInput('');
      setWarehouseOptions([]);
      setSelectedDepartmentRef(null);
    }
  }, [deliveryType]);

  // Clear department when city changes manually
  useEffect(() => {
    setSelectedDepartmentRef(null);
  }, [selectedCityRef, cityInput]);

  // Cities
  useEffect(() => {
    if (deliveryType === 'PICK_UP') return;
    if (!debouncedCity || debouncedCity.trim().length < 2) {
      setCityOptions([]);
      return;
    }
    searchCities(debouncedCity).then((arr) => setCityOptions(arr));
  }, [debouncedCity, deliveryType]);

  // Streets (courier)
  useEffect(() => {
    if (deliveryType !== 'NOVA_POSHTA_COURIER') return;
    if (!selectedCityRef || !debouncedStreet || debouncedStreet.trim().length < 2) {
      setStreetOptions([]);
      return;
    }
    searchStreets(selectedCityRef, debouncedStreet).then((arr) => setStreetOptions(arr));
  }, [debouncedStreet, deliveryType, selectedCityRef]);

  // Warehouses (dept/poshtmat)
  useEffect(() => {
    if (deliveryType !== 'NOVA_POSHTA_DEPARTMENT' && deliveryType !== 'NOVA_POSHTA_POSHTMAT') return;
    if (!selectedCityRef) return;

    searchWarehouses(selectedCityRef, cityInput, debouncedWarehouse).then(res => {
      if (res.success) {
        setWarehouseOptions(res.data);
      } else {
        setWarehouseOptions([]);
      }
    });
  }, [debouncedWarehouse, deliveryType, selectedCityRef, cityInput]);

  if (!cart || cart.items.length === 0) return null;

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      const selectedDeliveryType = String(formData.get('deliveryType')) as DeliveryType;
      const isCourier = selectedDeliveryType === 'NOVA_POSHTA_COURIER';

      const payload = {
        customerDetails: {
          firstName: String(formData.get('firstName') || '').trim(),
          middleName: String(formData.get('middleName') || '').trim() || undefined,
          lastName: String(formData.get('lastName') || '').trim(),
          phoneNumber: String(formData.get('phone') || '').trim(),
          email: String(formData.get('email') || '').trim(),
        },
        deliveryDetails: {
          deliveryType: selectedDeliveryType,
          paymentMethod: formData.get('paymentMethod') as PaymentMethod,

          city: selectedDeliveryType === 'PICK_UP' ? 'Львів' : (String(formData.get('city') || '') || undefined),
          cityCode: selectedCityRef || undefined,

          // courier fields
          street: isCourier ? (String(formData.get('street') || '') || undefined) : undefined,
          houseNumber: isCourier ? (String(formData.get('houseNumber') || '') || undefined) : undefined,
          flatNumber: isCourier ? (String(formData.get('flatNumber') || '') || undefined) : undefined,

          // NP department/poshtmat
          department: !isCourier ? (String(formData.get('department') || '') || undefined) : undefined,
          departmentCode: !isCourier ? (selectedDepartmentRef || undefined) : undefined, // <-- NEW
        },
        orderedItems,
      } as const;

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
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-baseline justify-between">
            <Text.Subheader className="mb-1">Контактні дані</Text.Subheader>
            <Text.Span className="text-gray-500 text-[11px]">Ми не передаємо ваші дані третім сторонам</Text.Span>
          </div>

          <form id="checkout-form" action={onSubmit} className="mt-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Ім’я *"><Input name="firstName" placeholder="Ім’я" required defaultValue={user?.firstName || ''} /></Field>
              <Field label="По батькові"><Input name="middleName" placeholder="По батькові" defaultValue={user?.middleName || ''} /></Field>
              <Field label="Прізвище *"><Input name="lastName" placeholder="Прізвище" required defaultValue={user?.lastName || ''} /></Field>
              <Field label="Телефон *" className="md:col-span-2"><Input name="phone" placeholder="+380..." required defaultValue={user?.phoneNumber || ''} /></Field>
              <Field label="Email *"><Input name="email" placeholder="you@example.com" required defaultValue={user?.email || ''} /></Field>
            </div>

            <div className="mt-2">
              <Text.Subheader className="mb-3">Доставка та оплата</Text.Subheader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Тип доставки">
                  <select
                    name="deliveryType"
                    className="w-full text-xs px-4 py-3 rounded-lg border-[0.5px] border-[#DCDCDC] bg-secondary-100 focus:outline-none focus:border-secondary"
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
                  >
                    <option value="PICK_UP">Самовивіз</option>
                    <option value="NOVA_POSHTA_DEPARTMENT">НП — відділення</option>
                    <option value="NOVA_POSHTA_POSHTMAT">НП — поштомат</option>
                    <option value="NOVA_POSHTA_COURIER">НП — курʼєр</option>
                  </select>
                </Field>

                <Field label="Оплата">
                  <select
                    name="paymentMethod"
                    className="w-full text-xs px-4 py-3 rounded-lg border-[0.5px] border-[#DCDCDC] bg-secondary-100 focus:outline-none focus:border-secondary"
                    defaultValue="CASH"
                  >
                    <option value="CASH">Готівка</option>
                    <option value="NON_CASH">Карта/безготівка</option>
                    <option value="ONLINE">Онлайн</option>
                  </select>
                </Field>

                <Field label="Місто">
                  <Input
                    name="city"
                    placeholder="Київ"
                    readOnly={deliveryType === 'PICK_UP'}
                    value={deliveryType === 'PICK_UP' ? 'Львів' : cityInput}
                    onChange={(e) => {
                      setCityInput(e.target.value);
                      setSelectedCityRef(null);
                      setSelectedDepartmentRef(null);
                    }}
                  />
                  {deliveryType !== 'PICK_UP' && cityOptions.length > 0 && (
                    <ul className="border rounded bg-white mt-1 max-h-40 overflow-y-auto">
                      {cityOptions.map((c) => (
                        <li
                          key={c.Ref}
                          onClick={() => {
                            setCityInput(c.MainDescription);
                            // Use DeliveryCity when available (NP docs often use it as CityRef for deliveries)
                            setSelectedCityRef(c.DeliveryCity || c.Ref);
                            setSelectedDepartmentRef(null);
                            setCityOptions([]);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          {c.MainDescription}{c.Region ? `, ${c.Region}` : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {deliveryType === 'PICK_UP' && (
                  <Field label="Вулиця" className="md:col-span-2">
                    <Input name="street" value={DEFAULT_STORE_ADDRESS} readOnly />
                  </Field>
                )}

                {deliveryType === 'NOVA_POSHTA_COURIER' && (
                  <>
                    <Field label="Вулиця" className="md:col-span-2">
                      <Input
                        name="street"
                        placeholder="Хрещатик"
                        value={streetInput}
                        onChange={(e) => setStreetInput(e.target.value)}
                      />
                      {streetOptions.length > 0 && (
                        <ul className="border rounded bg-white mt-1 max-h-40 overflow-y-auto">
                          {streetOptions.map((s) => (
                            <li
                              key={s.SettlementStreetRef}
                              onClick={() => {
                                setStreetInput(s.SettlementStreetDescription);
                                setStreetOptions([]);
                              }}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {s.SettlementStreetDescription}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Field>
                    <Field label="Будинок"><Input name="houseNumber" placeholder="10" /></Field>
                    <Field label="Кв./офіс"><Input name="flatNumber" placeholder="25" /></Field>
                  </>
                )}

                {(deliveryType === 'NOVA_POSHTA_DEPARTMENT' || deliveryType === 'NOVA_POSHTA_POSHTMAT') && (
                  <Field label={deliveryType === 'NOVA_POSHTA_POSHTMAT' ? 'Поштомат' : 'Відділення'} className="md:col-span-2">
                    <Input
                      name="department"
                      placeholder="№123 або назва"
                      value={warehouseInput}
                      onChange={(e) => {
                        setWarehouseInput(e.target.value);
                        setSelectedDepartmentRef(null);
                      }}
                    />
                    {warehouseOptions.length > 0 && (
                      <ul className="border rounded bg-white mt-1 max-h-40 overflow-y-auto">
                        {warehouseOptions.map((w: any) => (
                          <li
                            key={w.Ref}
                            onClick={() => {
                              setWarehouseInput(w.ShortAddress || w.Description || `Відділення №${w.Number}`);
                              setSelectedDepartmentRef(w.Ref); // <-- capture department code
                              setWarehouseOptions([]);
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {w.Description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Field>
                )}
              </div>

              <p className="mt-2 text-[11px] text-gray-500">
                {deliveryType === 'NOVA_POSHTA_COURIER'
                  ? 'Вкажіть точну адресу для курʼєрської доставки.'
                  : 'Вкажіть номер відділення або поштомату Нової Пошти.'}
              </p>
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
          <Text.Paragraph className="font-bold text-primary">{roundToTwo(cart.total)}₴</Text.Paragraph>
        </div>

        <Button
          form="checkout-form"
          type="submit"
          disabled={submitting}
          className={cn('w-full bg-primary text-white rounded-xl py-4 hover:bg-primary/90 transition', submitting && 'opacity-70 cursor-not-allowed')}
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

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('flex flex-col gap-1', className)}>
      <span className="text-[11px] text-gray-600">{label}</span>
      {children}
    </label>
  );
}
