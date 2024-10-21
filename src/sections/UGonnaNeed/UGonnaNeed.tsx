import { Button, Container, ProductCard } from '@/components';

import { uGonnaNeedConfig } from '@/utils/config';

export const UGonnaNeed = () => {
  const { columns, gap, items } = uGonnaNeedConfig;

  return (
    <Container className='mt-20'>
      <h2 className="text-3xl mb-10">Вам це точно знадобиться</h2>

      <div className={`grid grid-cols-${columns} justify-center justify-items-center gap-${gap}`}>
        {items.map(({ title, price, img, href }, index) => (
          <ProductCard
            key={index}
            title={title}
            price={price}
            img={img}
            href={href}
          />
        ))}
      </div>

      <Button className='mx-auto mt-8'>Більше товарів</Button>
    </Container>
  )
}
