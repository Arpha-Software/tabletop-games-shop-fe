import { UGonnaNeed } from "../ui/sections/UGonnaNeed";
import { ProductList } from "./ui/sections/ProductList.tsx";

import { SectionHeader } from "./ui/sections/Header";

export default function Catalogue(params: any) {
  const chosenCategory = params.searchParams.category;
  const chosenOffer = params.searchParams.offers;

  return (
    <section className="mt-10">
      <SectionHeader />

      <ProductList chosenCategory={chosenCategory} />

      <UGonnaNeed />
    </section>
  );
}
