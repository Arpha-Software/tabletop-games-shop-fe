import { Container } from "@/app/ui/components";
import { ProductIntro } from "./ui/sections/ProductIntro";

export default function Product(params: any) {
  const chosenProduct = params.params.product;

  return (
    <Container>
      <ProductIntro product={chosenProduct} />
    </Container>
  );
}
