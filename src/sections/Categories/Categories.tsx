import { CategoryCard } from "@/components";
import { Container } from "@/components";
import { Button } from "@/components";

import { categoriesSectionConfig } from "@/utils/config";

export const Categories = () => {
  const { title, buttonTitle, items } = categoriesSectionConfig;

  return (
    <Container>
      <div className="flex justify-between mb-10 mt-20">
        <h2 className="text-3xl">{title}</h2>
        <Button variant="secondary">{buttonTitle}</Button>
      </div>

      <div className={`grid grid-cols-3 grid-rows-2 gap-4`}>
        {items.map(({ title, img, href, colSpan, rowSpan }, index) => (
          <CategoryCard
            key={index}
            title={title}
            img={img}
            href={href}
            className={`col-span-${colSpan} row-span-${rowSpan}`}
          />
        ))}
      </div>
    </Container>
  );
};
