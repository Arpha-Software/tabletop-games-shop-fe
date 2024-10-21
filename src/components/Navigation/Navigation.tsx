import Link from 'next/link';

import { links } from './links';

export const Navigation = () => {
  return (
    <nav className='flex gap-10 items-center'>
      {links.map(({ url, label}) => (
        <Link key={url} href={url} className='hover:text-primary hover:underline'>
          {label}
        </Link>
      ))}
    </nav>
  )
}
