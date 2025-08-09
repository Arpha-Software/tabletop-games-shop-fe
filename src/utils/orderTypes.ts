// Тільки типи/константи — можна імпортувати і з клієнта, і з сервера

export const DELIVERY_TYPES = [
  'PICK_UP',
  'NOVA_POSHTA_DEPARTMENT',
  'NOVA_POSHTA_COURIER',
  'NOVA_POSHTA_POSHTMAT',
] as const;
export type DeliveryType = typeof DELIVERY_TYPES[number];

export const PAYMENT_METHODS = ['CASH', 'NON_CASH', 'ONLINE'] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

export type CreateOrderPayload = {
  customerDetails: {
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
  deliveryDetails: {
    deliveryType: DeliveryType;
    paymentMethod: PaymentMethod;
    city?: string;
    cityCode?: string;
    street?: string;
    streetCode?: string;
    houseNumber?: string;
    flatNumber?: string;
    department?: string;
    departmentCode?: string;
    docNumber?: string;
    expectedDeliveryDate?: string; // YYYY-MM-DD
    deliveryPrice?: number;
  };
  orderedItems: Array<{ productId: number; quantity: number }>;
};
