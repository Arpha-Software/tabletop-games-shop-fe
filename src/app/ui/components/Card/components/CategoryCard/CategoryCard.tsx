import Link from "next/link";

import { cn } from "@/utils/helpers";

type TProps = {
  title: string;
  img: string;
  href: string;
  className?: string;
}

export const CategoryCard = ({
  title,
  img,
  href,
  className,
}: TProps) => {
  const styles = {
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <Link href={href} className={cn("block relative rounded-lg h-60 group", className)} style={styles}>
      <div className="absolute inset-0 bg-primary/0 backdrop-blur-xs rounded-lg group-hover:bg-primary/60 transition-all" />
      <span className="absolute hidden h-full items-end px-9 py-7 text-xl text-white group-hover:flex">{title}</span>
    </Link>
  )
}
