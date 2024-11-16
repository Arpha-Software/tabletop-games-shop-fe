import { Button, Container, ProductCard } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';

import { uGonnaNeedConfig } from '@/utils/config';
import Link from 'next/link';

export const UGonnaNeed = () => {
  const { items } = uGonnaNeedConfig;

  return (
    <Container className='mt-20'>
      <Text.Header className='mb-10'>Вам це точно знадобиться</Text.Header>

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

      <Button tag={Link} href='/catalogue' className='mx-auto mt-8'>Більше товарів</Button>
    </Container>
  )
}
