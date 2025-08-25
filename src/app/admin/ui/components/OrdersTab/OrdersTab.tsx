'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import toast from 'react-hot-toast';
import { RubikLoadable } from '../../../../ui/components/Loader';
import { getOrders, getOrderDetails } from '@/app/actions/orders';
import { cn } from '@/utils/helpers';

/* -------------------------------------------
   Types that match backend
------------------------------------------- */
type BackendStatus =
  | 'NEW' | 'CANCELLED' | 'ON_THE_WAY' | 'WAITING_TAKEOUT' | 'CREATED_CONSIGNMENT'
  | 'CONSIGNMENT_NOT_FOUND' | 'IN_CITY_INTERREGIONAL' | 'IN_CITY_LOCAL' | 'HEADING_TO_CITY'
  | 'IN_CITY_ESTIMATED_DELIVERY' | 'ARRIVED_AT_WAREHOUSE' | 'ARRIVED_AT_LOCKER' | 'RECEIVED'
  | 'RECEIVED_PENDING_PAYMENT' | 'RECEIVED_PAYMENT_ISSUED' | 'PROCESSING' | 'REFUSED_RETURN_ORDERED'
  | 'REFUSED' | 'ADDRESS_CHANGED' | 'STORAGE_ENDED' | 'REVERSE_DELIVERY_CREATED'
  | 'FAILED_DELIVERY_NO_CONTACT' | 'DELIVERY_DATE_CHANGED';

type PageOrderList = {
  content: any[];
  totalPages: number;
  totalElements: number;
  number: number; // current page
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
};

type OrderRow = {
  id: number;
  userId: number | null;
  orderStatus: BackendStatus;
  createdAt: string;
  expectedDeliveryDate?: string;
  orderPriceSummary: number;
  orderQuantity: number;
  address: string;
};

type OrderDetails = {
  id: number;
  deliveryDetails?: {
    deliveryType?: string;
    paymentMethod?: string;
    city?: string; cityCode?: string;
    street?: string; streetCode?: string;
    houseNumber?: string; flatNumber?: string;
    department?: string; departmentCode?: string;
    docNumber?: string;
    expectedDeliveryDate?: string;
    deliveryPrice?: number;
  };
  customerDetails?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
  };
  orderStatus: BackendStatus;
  orderedItems?: Array<{ id: number; name: string; price: number; quantity: number; mainImg?: string }>;
  createdAt: string;
  statusHistory?: Array<{ status: BackendStatus; changedAt: string; notes?: string }>;
  orderPriceSummary: number;
  orderQuantity: number;
};

/* -------------------------------------------
   Small shared UI
------------------------------------------- */
const SectionCard = ({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={cn('bg-white rounded-2xl shadow-card border border-secondary-100 p-6', className)}>
    <div className="mb-5">
      <Text.Header className="text-lg">{title}</Text.Header>
      {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
    {children}
  </section>
);

const badgeMap: Record<BackendStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  ON_THE_WAY: 'bg-purple-100 text-purple-800',
  WAITING_TAKEOUT: 'bg-amber-100 text-amber-800',
  CREATED_CONSIGNMENT: 'bg-cyan-100 text-cyan-800',
  CONSIGNMENT_NOT_FOUND: 'bg-gray-200 text-gray-800',
  IN_CITY_INTERREGIONAL: 'bg-teal-100 text-teal-800',
  IN_CITY_LOCAL: 'bg-teal-100 text-teal-800',
  HEADING_TO_CITY: 'bg-violet-100 text-violet-800',
  IN_CITY_ESTIMATED_DELIVERY: 'bg-emerald-100 text-emerald-800',
  ARRIVED_AT_WAREHOUSE: 'bg-sky-100 text-sky-800',
  ARRIVED_AT_LOCKER: 'bg-sky-100 text-sky-800',
  RECEIVED: 'bg-green-100 text-green-800',
  RECEIVED_PENDING_PAYMENT: 'bg-orange-100 text-orange-800',
  RECEIVED_PAYMENT_ISSUED: 'bg-green-100 text-green-800',
  REFUSED_RETURN_ORDERED: 'bg-red-100 text-red-800',
  REFUSED: 'bg-red-100 text-red-800',
  ADDRESS_CHANGED: 'bg-zinc-100 text-zinc-800',
  STORAGE_ENDED: 'bg-stone-200 text-stone-800',
  REVERSE_DELIVERY_CREATED: 'bg-fuchsia-100 text-fuchsia-800',
  FAILED_DELIVERY_NO_CONTACT: 'bg-rose-100 text-rose-800',
  DELIVERY_DATE_CHANGED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabel = (s: BackendStatus) => {
  const map: Partial<Record<BackendStatus, string>> = {
    NEW: 'Нове',
    PROCESSING: 'В обробці',
    ON_THE_WAY: 'В дорозі',
    WAITING_TAKEOUT: 'Очікує видачі',
    CREATED_CONSIGNMENT: 'Створено накладну',
    CONSIGNMENT_NOT_FOUND: 'Накладну не знайдено',
    IN_CITY_INTERREGIONAL: 'В місті (міжобл.)',
    IN_CITY_LOCAL: 'В місті (локально)',
    HEADING_TO_CITY: 'Прямує до міста',
    IN_CITY_ESTIMATED_DELIVERY: 'Очік. доставка',
    ARRIVED_AT_WAREHOUSE: 'На складі',
    ARRIVED_AT_LOCKER: 'У поштоматі',
    RECEIVED: 'Отримано',
    RECEIVED_PENDING_PAYMENT: 'Отримано (очік. оплати)',
    RECEIVED_PAYMENT_ISSUED: 'Оплачено / видано',
    REFUSED_RETURN_ORDERED: 'Відмова, замовлено повернення',
    REFUSED: 'Відмовлено',
    ADDRESS_CHANGED: 'Адресу змінено',
    STORAGE_ENDED: 'Зберігання завершено',
    REVERSE_DELIVERY_CREATED: 'Зворотна доставка',
    FAILED_DELIVERY_NO_CONTACT: 'Не доставлено (нема зв’язку)',
    DELIVERY_DATE_CHANGED: 'Дату доставки змінено',
    CANCELLED: 'Скасовано',
  };
  return map[s] || s;
};

const StatusBadge = ({ status }: { status: BackendStatus }) => (
  <span className={cn('inline-flex px-2 py-1 text-xs font-semibold rounded-full', badgeMap[status])}>
    {statusLabel(status)}
  </span>
);

/* -------------------------------------------
   Orders Tab
------------------------------------------- */
export const OrdersTab = () => {
  // table data
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);

  // filters
  const [status, setStatus] = useState<BackendStatus | ''>('');
  const [createdFrom, setCreatedFrom] = useState<string>(''); // YYYY-MM-DD
  const [createdTo, setCreatedTo] = useState<string>('');     // YYYY-MM-DD
  const [idQuery, setIdQuery] = useState<string>('');         // numeric

  // details modal
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [selectedKey, setSelectedKey] = useState<{ userId: number; orderId: number } | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Forward filters; your getOrders action should add them into query string.
      const resp = await getOrders({
        page,
        size,
        sort: 'createdAt,desc',
        orderStatus: status || undefined,
        id: idQuery ? Number(idQuery) : undefined,
        createdAtFrom: createdFrom || undefined,
        createdAtTo: createdTo || undefined,
      } as any);

      if (!resp.success) throw new Error(resp.errors?.[0] || 'Помилка');

      const data = resp.data;

      const rows: OrderRow[] = (data.content || []).map((o: any) => {
        // Try to compute address
        const addr = [
          o.city,
          [o.street, o.houseNumber].filter(Boolean).join(' '),
          o.flatNumber ? `кв. ${o.flatNumber}` : '',
          o.department ? `від.: ${o.department}` : '',
        ].filter(Boolean).join(', ');

        return {
          id: o.id,
          userId: o.user?.id ?? o.userId ?? null,
          orderStatus: o.orderStatus as BackendStatus,
          createdAt: o.createdAt,
          expectedDeliveryDate: o.expectedDeliveryDate,
          orderPriceSummary: o.orderPriceSummary,
          orderQuantity: o.orderQuantity,
          address: addr,
        };
      });

      setOrders(rows);
      setTotalPages(data.totalPages ?? 0);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Помилка завантаження замовлень');
      setOrders([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, size, status, idQuery, createdFrom, createdTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openDetails = useCallback(async (userId: number | null, orderId: number) => {
    if (userId == null) {
      toast.error('Для відкриття деталей потрібен userId (бек має його повертати у списку).');
      return;
    }
    setSelectedKey({ userId, orderId });
    setDetailsLoading(true);
    try {
      const r = await getOrderDetails(userId, orderId);
      if (!r.success) throw new Error(r.errors?.[0] || 'Помилка');
      setSelectedOrder(r.data as OrderDetails);
    } catch (e: any) {
      toast.error(e?.message || 'Не вдалося завантажити деталі замовлення');
      setSelectedOrder(null);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const resetFilters = () => {
    setStatus('');
    setCreatedFrom('');
    setCreatedTo('');
    setIdQuery('');
    setPage(0);
  };

  const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString('uk-UA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('uk-UA') : '—');

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        {/* Header + Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <Text.Header>Управління замовленнями</Text.Header>
              <Text.Span className="text-gray-500">Перегляд, фільтри, деталі замовлення</Text.Span>
            </div>
          </div>

          <SectionCard title="Фільтри">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Статус</label>
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value as BackendStatus | ''); setPage(0); }}
                  className="w-full h-10 px-3 rounded-xl border border-secondary-100 bg-white"
                >
                  <option value="">Усі</option>
                  {Object.keys(badgeMap).map((s) => (
                    <option key={s} value={s}>{statusLabel(s as BackendStatus)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Дата від</label>
                <Input
                  type="date"
                  value={createdFrom}
                  onChange={(e) => { setCreatedFrom(e.target.value); setPage(0); }}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Дата до</label>
                <Input
                  type="date"
                  value={createdTo}
                  onChange={(e) => { setCreatedTo(e.target.value); setPage(0); }}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">ID замовлення</label>
                <Input
                  inputMode="numeric"
                  placeholder="Напр., 123"
                  value={idQuery}
                  onChange={(e) => { setIdQuery(e.target.value.replace(/\D+/g, '')); }}
                  onBlur={() => setPage(0)}
                />
              </div>

              <div className="flex items-end gap-2">
                <Button variant="secondary" onClick={resetFilters} className="w-full md:w-auto">Скинути</Button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-secondary-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Сума</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">К-сть</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Місто / Адреса</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Створено</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Очік. доставка</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Дії</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{o.id}</td>
                    <td className="px-6 py-4"><StatusBadge status={o.orderStatus} /></td>
                    <td className="px-6 py-4 text-sm text-gray-800">{o.orderPriceSummary} ₴</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{o.orderQuantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="max-w-[320px] truncate">{o.address || '—'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{fmtDateTime(o.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{fmtDate(o.expectedDeliveryDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1"
                          onClick={() => openDetails(o.userId, o.id)}
                        >
                          Деталі
                        </Button>
                        {/* Status change UI is intentionally not wired, API isn’t specified */}
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">Замовлення не знайдено</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Сторінка <span className="font-medium">{page + 1}</span> з{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={size}
                  onChange={(e) => { setPage(0); setSize(Number(e.target.value)); }}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm"
                >
                  {[12, 24, 48].map((n) => <option key={n} value={n}>{n} / стор.</option>)}
                </select>
                <Button
                  variant="secondary"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2"
                >
                  Попередня
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2"
                >
                  Наступна
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedKey && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto border border-secondary-100 shadow-card">
              <div className="flex justify-between items-center mb-4">
                <Text.Header className="text-lg">Деталі замовлення #{selectedKey.orderId}</Text.Header>
                <Button
                  variant="secondary"
                  onClick={() => { setSelectedKey(null); setSelectedOrder(null); }}
                >
                  ✕
                </Button>
              </div>

              <RubikLoadable loading={detailsLoading} wobble size={120} dim="rgba(255,255,255,.6)">
                {selectedOrder ? (
                  <div className="space-y-6 text-sm">
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2"><span className="text-gray-600">Статус:</span> <StatusBadge status={selectedOrder.orderStatus} /></div>
                      <div><span className="text-gray-600">Сума:</span> <span className="ml-1 font-medium">{selectedOrder.orderPriceSummary} ₴</span></div>
                      <div><span className="text-gray-600">К-сть:</span> <span className="ml-1">{selectedOrder.orderQuantity}</span></div>
                      <div><span className="text-gray-600">Створено:</span> <span className="ml-1">{fmtDateTime(selectedOrder.createdAt)}</span></div>
                    </div>

                    {/* Customer */}
                    <SectionCard title="Клієнт">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <div className="text-gray-600">ПІБ</div>
                          <div className="font-medium">
                            {[selectedOrder.customerDetails?.lastName, selectedOrder.customerDetails?.firstName, selectedOrder.customerDetails?.middleName]
                              .filter(Boolean).join(' ') || '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Телефон</div>
                          <div className="font-medium">{selectedOrder.customerDetails?.phoneNumber || '—'}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Email</div>
                          <div className="font-medium">{selectedOrder.customerDetails?.email || '—'}</div>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Delivery */}
                    <SectionCard title="Доставка">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div><span className="text-gray-600">Тип:</span> <span className="ml-1">{selectedOrder.deliveryDetails?.deliveryType || '—'}</span></div>
                        <div><span className="text-gray-600">Оплата:</span> <span className="ml-1">{selectedOrder.deliveryDetails?.paymentMethod || '—'}</span></div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Адреса:</span>{' '}
                          <span className="ml-1">
                            {[
                              selectedOrder.deliveryDetails?.city,
                              [selectedOrder.deliveryDetails?.street, selectedOrder.deliveryDetails?.houseNumber].filter(Boolean).join(' '),
                              selectedOrder.deliveryDetails?.flatNumber ? `кв. ${selectedOrder.deliveryDetails?.flatNumber}` : '',
                              selectedOrder.deliveryDetails?.department ? `від.: ${selectedOrder.deliveryDetails?.department}` : '',
                            ].filter(Boolean).join(', ') || '—'}
                          </span>
                        </div>
                        <div><span className="text-gray-600">Очік. дата:</span> <span className="ml-1">{selectedOrder.deliveryDetails?.expectedDeliveryDate || '—'}</span></div>
                        <div><span className="text-gray-600">Доставка, ₴:</span> <span className="ml-1">{selectedOrder.deliveryDetails?.deliveryPrice ?? '—'}</span></div>
                        {selectedOrder.deliveryDetails?.docNumber && (
                          <div className="md:col-span-2"><span className="text-gray-600">Накладна:</span> <span className="ml-1">{selectedOrder.deliveryDetails?.docNumber}</span></div>
                        )}
                      </div>
                    </SectionCard>

                    {/* Items */}
                    <SectionCard title="Товари">
                      <div className="border rounded-lg divide-y">
                        {(selectedOrder.orderedItems || []).map((it) => (
                          <div key={it.id} className="p-3 flex items-center justify-between">
                            <div className="min-w-0">
                              <div className="font-medium truncate">{it.name}</div>
                              <div className="text-gray-500">К-сть: {it.quantity}</div>
                            </div>
                            <div className="shrink-0 font-medium">{it.price} ₴</div>
                          </div>
                        ))}
                        {(!selectedOrder.orderedItems || !selectedOrder.orderedItems.length) && (
                          <div className="p-3 text-gray-500">Немає товарів</div>
                        )}
                      </div>
                    </SectionCard>

                    {/* History */}
                    <SectionCard title="Історія статусів">
                      <div className="space-y-2">
                        {(selectedOrder.statusHistory || []).map((h, i) => (
                          <div key={i} className="flex items-center justify-between border rounded p-2">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={h.status} />
                              {h.notes ? <span className="text-sm text-gray-600">{h.notes}</span> : null}
                            </div>
                            <div className="text-xs text-gray-500">{fmtDateTime(h.changedAt)}</div>
                          </div>
                        ))}
                        {(!selectedOrder.statusHistory || !selectedOrder.statusHistory.length) && (
                          <div className="text-gray-500 text-sm">Немає історії</div>
                        )}
                      </div>
                    </SectionCard>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Немає даних по замовленню</div>
                )}
              </RubikLoadable>
            </div>
          </div>
        )}
      </div>
    </RubikLoadable>
  );
};
