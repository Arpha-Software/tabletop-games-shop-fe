import { Container } from "@/app/ui/components";
import { ProductIntro } from "./ui/sections/ProductIntro";
import { ProductInfo } from "./ui/sections/ProductInfo";
import { UGonnaNeed } from "@/app/ui/sections/UGonnaNeed";
import { Popular } from "@/app/ui/sections/Popular";

export default function Product(params: any) {
  const chosenProduct = params.params.product;

  return (
    <>
      <ProductIntro productId={chosenProduct} />
      <ProductInfo productId={chosenProduct} />
      <UGonnaNeed />
      <Popular />
    </>
  );
}
