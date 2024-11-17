import Image from 'next/image';
import Link from 'next/link';

import { Container, Logo } from '@/app/ui/components';

import TelegramIcon from '@/public/icons/telegram.svg';
import InstagramIcon from '@/public/icons/instagram.svg';
import TwitterIcon from '@/public/icons/twitter.svg';

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
      href: '/catalogue?category=1',
    },
    {
      title: 'Категорія друга',
      href: '/catalogue?category=2',
    },
    {
      title: 'Категорія 3',
      href: '/catalogue?category=3',
    },
    {
      title: 'Категорія інша',
      href: '/catalogue?category=4',
    },
    {
      title: 'Категорія',
      href: '/catalogue?category=5',
    },
    {
      title: 'Категорія 6',
      href: '/catalogue?category=6',
    },
    {
      title: 'Категорія 7',
      href: '/catalogue?category=7',
    },
    {
      title: 'Категорія',
      href: '/catalogue?category=8',
    },
    {
      title: 'Категорія 9',
      href: '/catalogue?category=9',
    },
    {
      title: 'Більше...',
      href: '/catalogue',
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
