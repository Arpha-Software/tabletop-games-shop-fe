import { Container } from "@/app/ui/components";
import { ProductIntro } from "./ui/sections/ProductIntro";
import { UGonnaNeed } from "@/app/ui/sections/UGonnaNeed";

export default function Product(params: any) {
  const chosenProduct = params.params.product;

  return (
    <>
      <ProductIntro productId={chosenProduct} />

      <UGonnaNeed />
    </>
  );
}
