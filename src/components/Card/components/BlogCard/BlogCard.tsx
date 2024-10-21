import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/Button';

import { cn } from '@/utils';

type TProps = {
  title: string;
  date: Date;
  img: string;
  href: string;
  className?: string;
}

export const BlogCard = ({
  title,
  date,
  img,
  href,
  className,
}: TProps) => {
  return (
    <Link href={href} className={cn("block w-full min-w-[420px] bg-secondary shadow-card rounded-lg", className)}>
      <Image src={img} alt="product image" width={600} height={600} className="w-full rounded-lg" />

      <div className="flex flex-col gap-2.5 p-3.5">
        <p className='text-lg'>{title}</p>

        <div className='flex justify-between items-center mt-10'>
          <p className="text-sm opacity-40">{date.toLocaleDateString('ua-UA')}</p>
          <Button variant="secondary">Читати</Button>
        </div>
      </div>
    </Link>
  )
}
