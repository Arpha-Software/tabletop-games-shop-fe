import { CategoryCard } from "@/app/ui/components";
import { Container } from "@/app/ui/components";
import { Button } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";

import { generateStaticClass } from "@/utils/helpers";
import { categoriesSectionConfig } from "@/utils/config";

export const Categories = () => {
  const { title, columns, rows, gap, buttonTitle, items } = categoriesSectionConfig;

  return (
    <Container>
      <div className="flex justify-between mb-10 mt-20">
        <Text.Header>{title}</Text.Header>
        <Button variant="secondary">{buttonTitle}</Button>
      </div>

      <div
        className={`grid
          ${generateStaticClass("grid-cols", columns)}
          ${generateStaticClass("grid-rows", rows)}
          ${generateStaticClass("gap", gap)}`}
      >
        {items.map(({ title, img, href, colSpan, rowSpan }, index) => (
          <CategoryCard
            key={index}
            title={title}
            img={img}
            href={href}
            className={`${generateStaticClass("col-span", colSpan)} ${generateStaticClass("row-span", rowSpan)}`}
          />
        ))}
      </div>
    </Container>
  );
};
