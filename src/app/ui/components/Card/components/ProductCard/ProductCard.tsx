import Link from "next/link";
import Image from "next/image";

import { cn } from "@/utils/helpers";
import { TProduct } from "@/utils/types";

type TProps = {
  item: TProduct | null;
  className?: string;
}

export const ProductCard = ({
  item,
  className,
}: TProps) => {
  if (!item) {
    return null;
  }

  const { id, name, price } = item;

  return (
    <Link href={`/catalogue/${id}`} className={cn("block min-w-52 max-w-72 w-full min-h-64 max-h-72 bg-secondary-100 shadow-card rounded-lg", className)}>
      <Image src={'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png'} alt="product image" width={600} height={600} className="w-full h-40 rounded-lg" />

      <div className="flex flex-col gap-2.5 p-3.5">
        <p>{name}</p>
        <p className="font-medium">{price} ₴</p>
      </div>
    </Link>
  )
}
