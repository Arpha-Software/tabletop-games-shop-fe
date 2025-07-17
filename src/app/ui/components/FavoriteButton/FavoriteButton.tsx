import Image from 'next/image'
import Link from 'next/link'

import FavoriteIcon from '@/public/icons/favourite.svg';

export const FavoriteButton = () => {
  return (
    <Link href="/favorite" className="flex items-center w-10 h-10">
      <Image src={FavoriteIcon} alt="Favorite" width={24} height={24} />
    </Link>
  )
}
