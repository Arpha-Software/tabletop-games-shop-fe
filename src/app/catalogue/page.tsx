import { UGonnaNeed } from "../ui/sections/UGonnaNeed";
import { ProductList } from "./ui/sections/ProductList.tsx"
import { Text } from '@/utils/ui/Text';

export default function Catalogue(params: any) {
  const chosenCategory = params.searchParams.category;
  const chosenOffer = params.searchParams.offers;

  return (
    <section className="mt-10">
      <Text.Header className='mb-14 ml-16'>Найпопулярніші</Text.Header>

      <ProductList chosenCategory={chosenCategory} />

      <UGonnaNeed />
    </section>
  );
}
