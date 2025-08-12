// src/app/checkout/ui/CheckoutForm.tsx
'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
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
import { SelectMenu, type SelectOption } from '@/app/ui/components/Select/SelectMenu';

const MIN_CHARS = 2;

export const CheckoutForm = () => {
  const router = useRouter();
  const { cart, clearCart } = useCartContext();
  const { user } = useUserContext();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('PICK_UP');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  // NP state
  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [selectedCityRef, setSelectedCityRef] = useState<string | null>(null);

  const [streetInput, setStreetInput] = useState('');
  const [streetOptions, setStreetOptions] = useState<any[]>([]);
  const [streetLoading, setStreetLoading] = useState(false);

  const [warehouseInput, setWarehouseInput] = useState('');
  const [warehouseOptions, setWarehouseOptions] = useState<any[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [selectedDepartmentRef, setSelectedDepartmentRef] = useState<string | null>(null);
  const [warehouseInitialLoaded, setWarehouseInitialLoaded] = useState(false); // ⬅️ NEW

  const debouncedCity = useDebounce(cityInput, 350);
  const debouncedStreet = useDebounce(streetInput, 350);
  const debouncedWarehouse = useDebounce(warehouseInput, 350);

  const orderedItems = useMemo(
    () => (cart?.items || []).map(i => ({ productId: Number(i.product.id), quantity: i.quantity })),
    [cart]
  );

  // Dropdown control: focus/open flags (for async fields)
  const [cityFocused, setCityFocused] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [streetFocused, setStreetFocused] = useState(false);
  const [streetOpen, setStreetOpen] = useState(false);
  const [warehouseFocused, setWarehouseFocused] = useState(false);
  const [warehouseOpen, setWarehouseOpen] = useState(false);

  // Stale-guard request counters
  const cityReqId = useRef(0);
  const streetReqId = useRef(0);
  const warehouseReqId = useRef(0);

  // Input refs + "suppress next effect" flags
  const cityInputRef = useRef<HTMLInputElement>(null);
  const suppressCityOnce = useRef(false);

  const streetInputRef = useRef<HTMLInputElement>(null);
  const suppressStreetOnce = useRef(false);

  const warehouseInputRef = useRef<HTMLInputElement>(null);
  const suppressWarehouseOnce = useRef(false);

  const closeCity = useCallback(() => { setCityOpen(false); cityReqId.current++; setCityLoading(false); }, []);
  const closeStreet = useCallback(() => { setStreetOpen(false); streetReqId.current++; setStreetLoading(false); }, []);
  const closeWarehouse = useCallback(() => { setWarehouseOpen(false); warehouseReqId.current++; setWarehouseLoading(false); }, []);

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
      setWarehouseInitialLoaded(false); // ⬅️ reset initial list flag
    } else {
      setCityInput('');
      setSelectedCityRef(null);
      setStreetInput('');
      setStreetOptions([]);
      setWarehouseInput('');
      setWarehouseOptions([]);
      setSelectedDepartmentRef(null);
      setWarehouseInitialLoaded(false); // ⬅️ reset initial list flag
    }
    closeCity(); closeStreet(); closeWarehouse();
    setCityFocused(false); setStreetFocused(false); setWarehouseFocused(false);
  }, [deliveryType, closeCity, closeStreet, closeWarehouse]);

  // Clear department when city changes manually or ref changes
  useEffect(() => {
    setSelectedDepartmentRef(null);
    setWarehouseInitialLoaded(false); // ⬅️ city changed ⇒ initial list must refresh next time
    setWarehouseOptions([]);          // clear stale list for a different city
  }, [selectedCityRef, cityInput]);

  // ---- Cities (gate by focus + min chars; ignore stale; suppress once after select)
  useEffect(() => {
    if (deliveryType === 'PICK_UP') { setCityLoading(false); return; }

    if (suppressCityOnce.current) {
      suppressCityOnce.current = false;
      setCityLoading(false);
      setCityOpen(false);
      return;
    }

    if (!cityFocused) { setCityOptions([]); setCityOpen(false); setCityLoading(false); return; }
    const q = (debouncedCity || '').trim();
    if (q.length < MIN_CHARS) { setCityOptions([]); setCityOpen(false); setCityLoading(false); return; }

    setCityLoading(true);
    const req = ++cityReqId.current;
    searchCities(q).then(arr => {
      if (req !== cityReqId.current) return;
      setCityOptions(arr);
      setCityOpen(arr.length > 0);
      setCityLoading(false);
    }).catch(() => {
      if (req !== cityReqId.current) return;
      setCityOptions([]);
      setCityOpen(false);
      setCityLoading(false);
    });
  }, [debouncedCity, deliveryType, cityFocused]);

  // ---- Streets (courier only)
  useEffect(() => {
    if (deliveryType !== 'NOVA_POSHTA_COURIER') { setStreetLoading(false); return; }

    if (suppressStreetOnce.current) {
      suppressStreetOnce.current = false;
      setStreetLoading(false);
      setStreetOpen(false);
      return;
    }

    if (!streetFocused) { setStreetOptions([]); setStreetOpen(false); setStreetLoading(false); return; }
    if (!selectedCityRef) { setStreetOptions([]); setStreetOpen(false); setStreetLoading(false); return; }
    const q = (debouncedStreet || '').trim();
    if (q.length < MIN_CHARS) { setStreetOptions([]); setStreetOpen(false); setStreetLoading(false); return; }

    setStreetLoading(true);
    const req = ++streetReqId.current;
    searchStreets(selectedCityRef, q).then(arr => {
      if (req !== streetReqId.current) return;
      setStreetOptions(arr);
      setStreetOpen(arr.length > 0);
      setStreetLoading(false);
    }).catch(() => {
      if (req !== streetReqId.current) return;
      setStreetOptions([]);
      setStreetOpen(false);
      setStreetLoading(false);
    });
  }, [debouncedStreet, deliveryType, selectedCityRef, streetFocused]);

  // ---- Warehouses (department) — initial full list on first focus, then debounced search as usual
  useEffect(() => {
    const isWH = deliveryType === 'NOVA_POSHTA_DEPARTMENT';
    if (!isWH) { setWarehouseLoading(false); return; }

    if (suppressWarehouseOnce.current) {
      suppressWarehouseOnce.current = false;
      setWarehouseLoading(false);
      setWarehouseOpen(false);
      return;
    }

    // When typing: only trigger network if >= MIN_CHARS.
    // If query is empty BUT we already loaded initial full list, keep showing it.
    if (!warehouseFocused) { setWarehouseOpen(false); setWarehouseLoading(false); return; }
    if (!selectedCityRef) { setWarehouseLoading(false); return; }

    const q = (debouncedWarehouse || '').trim();
    if (q.length === 0 && warehouseInitialLoaded) {
      // Keep previously loaded initial list visible
      setWarehouseOpen(warehouseOptions.length > 0);
      setWarehouseLoading(false);
      return;
    }
    if (q.length < MIN_CHARS) {
      // Not enough chars and no initial list — keep closed & empty
      setWarehouseOpen(false);
      setWarehouseOptions([]);
      setWarehouseLoading(false);
      return;
    }

    setWarehouseLoading(true);
    const req = ++warehouseReqId.current;
    searchWarehouses(selectedCityRef, cityInput, q).then(res => {
      if (req !== warehouseReqId.current) return;
      const arr = res.success ? res.data : [];
      setWarehouseOptions(arr);
      setWarehouseOpen(arr.length > 0);
      setWarehouseLoading(false);
    }).catch(() => {
      if (req !== warehouseReqId.current) return;
      setWarehouseOptions([]);
      setWarehouseOpen(false);
      setWarehouseLoading(false);
    });
  }, [debouncedWarehouse, deliveryType, selectedCityRef, cityInput, warehouseFocused, warehouseInitialLoaded, warehouseOptions.length]);

  if (!cart || cart.items.length === 0) return null;

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      const selectedDeliveryType = String(formData.get('deliveryType')) as DeliveryType;

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
          street: selectedDeliveryType === 'NOVA_POSHTA_COURIER' ? (String(formData.get('street') || '') || undefined) : undefined,
          houseNumber: selectedDeliveryType === 'NOVA_POSHTA_COURIER' ? (String(formData.get('houseNumber') || '') || undefined) : undefined,
          flatNumber: selectedDeliveryType === 'NOVA_POSHTA_COURIER' ? (String(formData.get('flatNumber') || '') || undefined) : undefined,

          // NP department
          department: selectedDeliveryType !== 'NOVA_POSHTA_COURIER' ? (String(formData.get('department') || '') || undefined) : undefined,
          departmentCode: selectedDeliveryType !== 'NOVA_POSHTA_COURIER' ? (selectedDepartmentRef || undefined) : undefined,
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

  // options for SelectMenu
  const deliveryOptions: SelectOption[] = [
    { value: 'PICK_UP', label: 'Самовивіз' },
    { value: 'NOVA_POSHTA_DEPARTMENT', label: 'НП — відділення' },
    { value: 'NOVA_POSHTA_COURIER', label: 'НП — курʼєр' },
  ];
  const paymentOptions: SelectOption[] = [
    { value: 'CASH', label: 'Готівка' },
    { value: 'NON_CASH', label: 'Карта/безготівка' },
    { value: 'ONLINE', label: 'Онлайн' },
  ];

  // shared dropdown UI for async fields
  const Dropdown = ({ open, loading, children }: { open: boolean; loading?: boolean; children: React.ReactNode }) => {
    if (!open && !loading) return null;
    return (
      <div className="absolute left-0 right-0 top-full mt-1 z-50">
        <div className="rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
          {loading ? (
            <div className="py-3 px-3 text-xs text-gray-500">Пошук…</div>
          ) : (
            <ul role="listbox" className="max-h-64 overflow-y-auto">{children}</ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        {/* Card: Contacts */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <header className="mb-4">
            <Text.Header className="text-lg">Контактні дані</Text.Header>
            <Text.Span className="text-gray-500 text-[11px]">Ми не передаємо ваші дані третім сторонам</Text.Span>
          </header>

          <form id="checkout-form" action={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Ім’я *"><Input name="firstName" placeholder="Ім’я" required defaultValue={user?.firstName || ''} /></Field>
              <Field label="По батькові"><Input name="middleName" placeholder="По батькові" defaultValue={user?.middleName || ''} /></Field>
              <Field label="Прізвище *"><Input name="lastName" placeholder="Прізвище" required defaultValue={user?.lastName || ''} /></Field>
              <Field label="Телефон *" className="md:col-span-2"><Input name="phone" placeholder="Номер телефону" required defaultValue={user?.phoneNumber || ''} /></Field>
              <Field label="Email *"><Input name="email" placeholder="you@example.com" required defaultValue={user?.email || ''} /></Field>
            </div>

            {/* Card: Delivery & Payment */}
            <div className="mt-2 grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between">
                <Text.Header className="text-lg">Доставка та оплата</Text.Header>
                <Text.Span className="text-gray-500 text-[11px]">Обовʼязкові поля позначені *</Text.Span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Тип доставки">
                  <SelectMenu
                    name="deliveryType"
                    value={deliveryType}
                    onChange={(v) => setDeliveryType(v as DeliveryType)}
                    options={deliveryOptions}
                  />
                </Field>

                <Field label="Оплата">
                  <SelectMenu
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    options={paymentOptions}
                  />
                </Field>

                {/* CITY */}
                <Field label="Місто">
                  <div className="relative">
                    <Input
                      ref={cityInputRef}
                      name="city"
                      placeholder="Київ"
                      autoComplete="off"
                      readOnly={deliveryType === 'PICK_UP'}
                      value={deliveryType === 'PICK_UP' ? 'Львів' : cityInput}
                      onFocus={() => setCityFocused(true)}
                      onBlur={() => setTimeout(() => { setCityFocused(false); setCityOpen(false); }, 120)}
                      onChange={(e) => {
                        setCityInput(e.target.value);
                        setSelectedCityRef(null);
                        setSelectedDepartmentRef(null);
                      }}
                      onKeyDown={(e) => { if (e.key === 'Escape') closeCity(); }}
                    />
                    {deliveryType !== 'PICK_UP' && (
                      <Dropdown open={cityOpen} loading={cityLoading}>
                        {cityOptions.map((c) => (
                          <li
                            key={c.Ref}
                            role="option"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              // suppress re-trigger
                              suppressCityOnce.current = true;
                              setCityInput(c.MainDescription);
                              setSelectedCityRef(c.DeliveryCity || c.Ref);
                              setSelectedDepartmentRef(null);
                              setCityOptions([]);
                              closeCity();
                              setCityFocused(false);
                              cityInputRef.current?.blur();
                            }}
                            className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                          >
                            {c.MainDescription}{c.Region ? `, ${c.Region}` : ''}
                          </li>
                        ))}
                      </Dropdown>
                    )}
                  </div>
                </Field>
              </div>

              {/* Address rows */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {deliveryType === 'PICK_UP' && (
                  <Field label="Вулиця" className="md:col-span-2">
                    <Input name="street" value={DEFAULT_STORE_ADDRESS} readOnly />
                  </Field>
                )}

                {deliveryType === 'NOVA_POSHTA_COURIER' && (
                  <>
                    <Field label="Вулиця" className="md:col-span-2">
                      <div className="relative">
                        <Input
                          ref={streetInputRef}
                          name="street"
                          placeholder="Хрещатик"
                          value={streetInput}
                          autoComplete="off"
                          onFocus={() => setStreetFocused(true)}
                          onBlur={() => setTimeout(() => { setStreetFocused(false); setStreetOpen(false); }, 120)}
                          onChange={(e) => setStreetInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Escape') closeStreet(); }}
                        />
                        <Dropdown open={streetOpen} loading={streetLoading}>
                          {streetOptions.map((s) => (
                            <li
                              key={s.SettlementStreetRef}
                              role="option"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                suppressStreetOnce.current = true;
                                setStreetInput(s.SettlementStreetDescription);
                                setStreetOptions([]);
                                closeStreet();
                                setStreetFocused(false);
                                streetInputRef.current?.blur();
                              }}
                              className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                            >
                              {s.SettlementStreetDescription}
                            </li>
                          ))}
                        </Dropdown>
                      </div>
                    </Field>
                    <Field label="Будинок"><Input name="houseNumber" placeholder="10" autoComplete="off" /></Field>
                    <Field label="Кв./офіс"><Input name="flatNumber" placeholder="25" autoComplete="off" /></Field>
                  </>
                )}

                {deliveryType === 'NOVA_POSHTA_DEPARTMENT' && (
                  <Field label="Відділення" className="md:col-span-2">
                    <div className="relative">
                      <Input
                        ref={warehouseInputRef}
                        name="department"
                        placeholder="№123 або назва"
                        value={warehouseInput}
                        autoComplete="off"
                        onFocus={async () => {
                          setWarehouseFocused(true);

                          // ⬇️ First focus: load full list if we have a city and haven't loaded yet
                          if (!warehouseInitialLoaded && selectedCityRef) {
                            try {
                              setWarehouseLoading(true);
                              const req = ++warehouseReqId.current;
                              const res = await searchWarehouses(selectedCityRef, cityInput, '');
                              if (req !== warehouseReqId.current) return;
                              const arr = res.success ? res.data : [];
                              setWarehouseOptions(arr);
                              setWarehouseOpen(arr.length > 0);
                              setWarehouseLoading(false);
                              setWarehouseInitialLoaded(true);
                            } catch {
                              setWarehouseOptions([]);
                              setWarehouseOpen(false);
                              setWarehouseLoading(false);
                            }
                          } else {
                            // already loaded once → just open if we have items
                            setWarehouseOpen(warehouseOptions.length > 0);
                          }
                        }}
                        onBlur={() => setTimeout(() => { setWarehouseFocused(false); setWarehouseOpen(false); }, 120)}
                        onChange={(e) => {
                          setWarehouseInput(e.target.value);
                          setSelectedDepartmentRef(null);
                        }}
                        onKeyDown={(e) => { if (e.key === 'Escape') closeWarehouse(); }}
                      />
                      <Dropdown open={warehouseOpen} loading={warehouseLoading}>
                        {warehouseOptions.map((w: any) => (
                          <li
                            key={w.Ref}
                            role="option"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              suppressWarehouseOnce.current = true;
                              setWarehouseInput(w.ShortAddress || w.Description || `Відділення №${w.Number}`);
                              setSelectedDepartmentRef(w.Ref);
                              setWarehouseOptions([]);
                              closeWarehouse();
                              setWarehouseFocused(false);
                              warehouseInputRef.current?.blur();
                            }}
                            className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                          >
                            {w.Description}
                          </li>
                        ))}
                      </Dropdown>
                    </div>
                  </Field>
                )}
              </div>

              <p className="mt-1 text-[11px] text-gray-500">
                {deliveryType === 'NOVA_POSHTA_COURIER'
                  ? 'Вкажіть точну адресу для курʼєрської доставки.'
                  : deliveryType === 'PICK_UP'
                    ? 'Самовивіз із нашого магазину у Львові.'
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
      <aside className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24 shadow-sm">
        <Text.Header className="mb-4 text-lg">Замовлення</Text.Header>

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

function Field({
  label,
  children,
  className,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={cn('relative flex flex-col gap-1', className)}>
      <span className="text-[11px] text-gray-600">{label}</span>
      {children}
      {hint ? <span className="text-[10px] text-gray-400">{hint}</span> : null}
    </label>
  );
}
