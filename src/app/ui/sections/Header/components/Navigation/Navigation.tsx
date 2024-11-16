import Link from 'next/link';

import { Text } from '@/utils/ui/Text';
import { links } from './links';

import styles from './Navigation.module.scss';

export const Navigation = () => {
  return (
    <nav className='flex gap-10 items-center'>
      {links.map(({ url, label}) => (
        <Link key={url} href={url} className={styles['nav-link']}>
          <Text.Span>{label}</Text.Span>
        </Link>
      ))}
    </nav>
  )
}
