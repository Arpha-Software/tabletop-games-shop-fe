// src/app/ui/components/Card/components/CategoryCard/CategoryCard.tsx
import Link from "next/link";
import { cn } from "@/utils/helpers";
import { Text } from "@/utils/ui/Text"; // Import Text component

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
    <Link
      href={href}
      className={cn(
        "relative rounded-2xl overflow-hidden shadow-md group block transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      style={styles}
    >
      {/* Overlay for subtle darkening and hover effect */}
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300" />

      {/* Title always visible at the bottom, with hover effect */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
        <Text.Header className="text-xl font-semibold group-hover:underline">
          {title}
        </Text.Header>
      </div>

      {/* Optional: Hidden overlay for a "view more" or icon if desired on hover */}
      {/* <div className="absolute inset-0 flex items-center justify-center bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white text-lg font-bold">View Category</span>
      </div> */}
    </Link>
  )
}
