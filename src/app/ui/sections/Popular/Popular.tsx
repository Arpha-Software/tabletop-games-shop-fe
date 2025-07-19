'use client';

import Link from "next/link";

import { Button, Container, ProductCard } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";

import { useProductsContext } from "@/context/product/context";

export const Popular = () => {
  const { products } = useProductsContext();

  return (
    <Container className='mt-20'>
      <div className="flex justify-between items-center mb-10">
        <Text.Header>Найпопулярніші</Text.Header>

        <div className="flex gap-4">
          <Button tag={Link} href="/catalogue?category=classic" variant="secondary">Класичні</Button>
          <Button tag={Link} href="/catalogue?category=fantasy" variant="secondary">Фентезі</Button>
          <Button tag={Link} href="/catalogue?category=child" variant="secondary">Дитячі</Button>
        </div>
      </div>

      <div className={`grid grid-cols-5 justify-center justify-items-center gap-5`}>
        {products?.slice(0, 5).map((item, index) => (
          <ProductCard
            key={index}
            item={item}
          />
        ))}
      </div>

      <Button tag={Link} href="/catalogue" className='mx-auto mt-8'>Більше товарів</Button>
    </Container>
  )
}
