import { Button, Container, ProductCard } from "@/components";

import { popularConfig } from "@/utils/config";

export const Popular = () => {
  const { items } = popularConfig;

  return (
    <Container className='mt-20'>

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl">Найпопулярніші</h2>

        <div className="flex gap-4">
          <Button variant="secondary">Класичні</Button>
          <Button variant="secondary">Фентезі</Button>
          <Button variant="secondary">Дитячі</Button>
        </div>
      </div>

      <div className={`grid grid-cols-5 grid-rows-2 justify-center justify-items-center gap-5`}>
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
