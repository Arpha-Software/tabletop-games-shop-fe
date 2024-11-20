import { Button, Container, ProductCard } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";
import { popularConfig } from "@/utils/config";
import Link from "next/link";

export const Popular = () => {
  const { items } = popularConfig;

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

      <div className={`grid grid-cols-5 grid-rows-2 justify-center justify-items-center gap-5`}>
        {items.map(({ title, price, img, href }, index) => (
          <ProductCard
            key={index}
            item={null}
          />
        ))}
      </div>

      <Button tag={Link} href="/catalogue" className='mx-auto mt-8'>Більше товарів</Button>
    </Container>
  )
}
