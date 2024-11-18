import StarFilled from '@/public/icons/star-filled.svg'
import StarHalfFilled from '@/public/icons/star-half.svg'
import StarEmpty from '@/public/icons/star-empty.svg'
import Image from 'next/image';
import { cn } from '@/utils/helpers';

type TProps = {
  rating: number;
  maxRating?: number;
  className?: string;
}

const STAR_SIZE = 20;

export const Rating = ({ rating, maxRating = 5, className }: TProps) => {
  const validRating = Math.max(0, Math.min(rating, maxRating));

  const stars = Array.from({ length: maxRating }, (_, i) => {
    const fillPercentage = Math.min(Math.max(validRating - i, 0), 1);

    if (fillPercentage >= 0.75) {
      return <Image src={StarFilled} alt="filled star" key={i} width={STAR_SIZE}/>
    } else if (fillPercentage >= 0.25) {
      return <Image src={StarHalfFilled} alt="half-filled star" key={i} width={STAR_SIZE}/>
    } else {
      return <Image src={StarEmpty} alt="empty star" key={i} width={STAR_SIZE}/>
    }
  });

  return (
    <div aria-label={`Rating: ${validRating} out of ${maxRating}`} className={cn('flex gap-1', className)}>
      {stars}
    </div>
  );
}
