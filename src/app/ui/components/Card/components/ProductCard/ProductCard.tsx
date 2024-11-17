import Link from "next/link";
import Image from "next/image";

import { cn } from "@/utils/helpers";

type TProps = {
  title: string;
  price: number;
  img: string;
  href: string;
  className?: string;
}

export const ProductCard = ({
  title,
  price,
  img,
  href,
  className,
}: TProps) => {
  return (
    <Link href={href} className={cn("block min-w-52 max-w-72 w-full min-h-64 bg-secondary-100 shadow-card rounded-lg", className)}>
      <Image src={img} alt="product image" width={600} height={600} className="w-full h-40 rounded-lg" />

      <div className="flex flex-col gap-2.5 p-3.5">
        <p>{title}</p>
        <p className="font-medium">{price} ₴</p>
      </div>
    </Link>
  )
}
