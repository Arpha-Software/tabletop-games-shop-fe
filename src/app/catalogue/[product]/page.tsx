// src/app/catalogue/[product]/page.tsx
import { UGonnaNeed } from "@/app/ui/sections/UGonnaNeed";
import { getProductById, getProductsRecommendations } from "@/app/actions/products";
import { TProduct } from "@/utils/types";
import { ProductIntro } from "./ui/sections/ProductIntro";

type TParams = { params: { product: string } };

export default async function Product({ params }: TParams) {
  const productId = params.product;

  const [productRes, recsRes] = await Promise.all([
    getProductById(productId),
    getProductsRecommendations(0), // lightweight page 0 is fine here
  ]);
  const product: TProduct | null = productRes.success ? productRes.data : null;
  const recs = recsRes.success ? (recsRes.data ?? []) : [];
  // console.log('PAGE PRODUCT ID', recs)

  return (
    <>
      <ProductIntro product={product} productId={productId} />
      <UGonnaNeed items={recs} />
    </>
  );
}
