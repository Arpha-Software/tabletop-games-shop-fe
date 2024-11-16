import Link from "next/link";

import { cn } from "@/utils/helpers";

type TProps = {
  title: string;
  img: string;
  href: string;
  titlePosition: 'top' | 'bottom';
  className?: string;
  style?: React.CSSProperties;
}

export const IntroCard = ({
  title,
  img,
  href,
  titlePosition,
  className,
  style,
}: TProps) => {
  const styles = {
    width: `100%`,
    height: `100%`,
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    ...style,
  }

  const titlePositionStyle = {
    top: 'items-start',
    bottom: 'items-end',
  }

  return (
    <Link href={href} className={cn("block relative rounded-lg", className)} style={styles}>
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-xs" />
      <span className={cn("relative flex h-full items-end p-6 text-lg text-white", titlePositionStyle[titlePosition])}>{title}</span>
    </Link>
  )
}
