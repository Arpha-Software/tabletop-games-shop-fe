import { Button, Container, ProductCard } from '@/components';

import { uGonnaNeedConfig } from '@/utils/config';

export const UGonnaNeed = () => {
  const { items } = uGonnaNeedConfig;

  return (
    <Container className='mt-20'>
      <h2 className="text-3xl mb-10">Вам це точно знадобиться</h2>

      <div className={`grid grid-cols-5 justify-center justify-items-center gap-5`}>
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
