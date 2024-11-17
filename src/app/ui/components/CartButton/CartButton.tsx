import Image from 'next/image'
import Link from 'next/link'

import CartIcon from '@/public/icons/cart.svg';

export const CartButton = () => {
  return (
    <Link href="/cart" className="flex items-center space-x-2">
      <Image src={CartIcon} alt="Cart" width={24} height={24} />
    </Link>
  )
}
