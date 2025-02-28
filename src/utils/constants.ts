export enum ETab {
  DESCRIPTION = 'description',
  CHARACTERISTICS = 'characteristics',
  ADDITIONS = 'additions',
  FEEDBACK = 'feedback',
  SHIPPINGPAYMENT = 'shipping-payment',
}

export const tabItems = [
  {
    id: ETab.DESCRIPTION,
    label: 'Опис'
  },
  {
    id: ETab.CHARACTERISTICS,
    label: 'Характеристики'
  },
  {
    id: ETab.ADDITIONS,
    label: 'Доповнення'
  },
  {
    id: ETab.FEEDBACK,
    label: 'Відгуки'
  },
  {
    id: ETab.SHIPPINGPAYMENT,
    label: 'Доставка та оплата'
  },
]
