import Image from 'next/image';

import { Container, Logo } from '@/components';

import TelegramIcon from '@/public/telegram.svg';
import InstagramIcon from '@/public/instagram.svg';
import TwitterIcon from '@/public/twitter.svg';
import Link from 'next/link';

export const Footer = () => {
  const socials = [
    {
      icon: TelegramIcon,
      href: 'https://t.me/',
    },
    {
      icon: InstagramIcon,
      href: 'https://instagram.com/',
    },
    {
      icon: TwitterIcon,
      href: 'https://twitter.com/',
    },
  ]

  const catalog = [
    {
      title: 'Категорія одна',
      href: '/category/1',
    },
    {
      title: 'Категорія друга',
      href: '/category/2',
    },
    {
      title: 'Категорія 3',
      href: '/category/3',
    },
    {
      title: 'Категорія інша',
      href: '/category/4',
    },
    {
      title: 'Категорія',
      href: '/category/5',
    },
    {
      title: 'Категорія 6',
      href: '/category/6',
    },
    {
      title: 'Категорія 7',
      href: '/category/7',
    },
    {
      title: 'Категорія',
      href: '/category/8',
    },
    {
      title: 'Категорія 9',
      href: '/category/9',
    },
    {
      title: 'Більше...',
      href: '/category',
      isLast: true,
    },
  ]

  return (
    <Container className='mt-20 mb-16'>
      <div className='border-t w-full rounded-sm mb-16' />

      <footer className='flex justify-between'>
        <div>
          <Logo />

          <div className='flex items-center gap-2 mt-7'>
            {socials.map(({ icon, href }, index) => (
              <a key={index} href={href}>
                <Image src={icon} alt='social media icon' />
              </a>
            ))}
          </div>
        </div>

        <div className='flex gap-36'>
          <div>
            <h3 className='text-lg mb-7'>Каталог</h3>

            <div className='grid grid-cols-2 gap-x-7 gap-y-1.5 text-sm'>
              {catalog.map(({ title, isLast, href }, index) => (
                <Link key={index} href={href} className={isLast ? 'opacity-50' : ''}>
                  {title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className='text-lg mb-7'>Контакти</h3>

            <div className='text-sm'>
              <p className='mb-1.5'>example@gmail.com</p>
              <p>+380935876935</p>
            </div>
          </div>
        </div>
      </footer>

      <p className='text-sm'>2024 &copy; All rights reserved</p>
    </Container>
  )
}
