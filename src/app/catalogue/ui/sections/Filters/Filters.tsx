'use client';

import { PriceFilter } from '../../components/PriceFilter'
import { CheckboxFilter } from '../../components/CheckboxFilter';

const optionsCategory = [
  {
    id: '1',
    value: 'Для дітей'
  },
  {
    id: '2',
    value: 'Для дорослих'
  },
  {
    id: '3',
    value: 'Фентезі'
  },
  {
    id: '4',
    value: 'Детективи'
  },
]

type TProps = {
  chosenCategory: string;
}

export const Filters = ({ chosenCategory }: TProps) => {
  return (
    <div className='mt-10 divide-y'>
      <PriceFilter
        min={0}
        max={20000}
        className='mb-8'
      />

      <CheckboxFilter title='Категорія' options={optionsCategory} chosenValue={[chosenCategory]} isOpenDefault />
      <CheckboxFilter title='Вік' options={optionsCategory} isOpenDefault />
      <CheckboxFilter title='Категорія' options={optionsCategory} />
      <CheckboxFilter title='Категорія' options={optionsCategory} />
      <CheckboxFilter title='Категорія' options={optionsCategory} />
      <CheckboxFilter title='Категорія' options={optionsCategory} />
    </div>
  )
}
