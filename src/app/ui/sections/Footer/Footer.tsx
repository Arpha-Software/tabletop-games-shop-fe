// src/app/ui/sections/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Container, Logo } from '@/app/ui/components';

import TelegramIcon from '@/public/icons/telegram.svg';
import InstagramIcon from '@/public/icons/instagram.svg';
import TwitterIcon from '@/public/icons/twitter.svg';

export const Footer = () => {
  const year = new Date().getFullYear();

  const socials = [
    { icon: TelegramIcon, href: 'https://t.me/', label: 'Telegram' },
    { icon: InstagramIcon, href: 'https://instagram.com/', label: 'Instagram' },
    { icon: TwitterIcon, href: 'https://twitter.com/', label: 'Twitter (X)' },
  ];

  // ⚡ Quick filters built only with query params your catalogue supports
  const collections = [
    { title: 'Новинки', href: '/catalogue?sort=createdAt,desc' },
    { title: 'Хіти під 1000₴', href: '/catalogue?maxPrice=1000' },
    { title: 'Преміум 3000+₴', href: '/catalogue?minPrice=3000' },
    { title: 'Для двох гравців', href: '/catalogue?minPlayerNumberRange=2&maxPlayerNumberRange=2' },
    { title: 'На компанію 6+', href: '/catalogue?minPlayerNumberRange=6' },
    { title: 'Для дітей 6+', href: '/catalogue?minAgeRange=6' },
  ];

  const themes = [
    { title: 'Кооперативні', href: '/catalogue?searchQuery=кооператив' },
    { title: 'Для вечірок', href: '/catalogue?searchQuery=party' },
    { title: 'Фентезі', href: '/catalogue?searchQuery=фентезі' },
    { title: 'Sci-Fi', href: '/catalogue?searchQuery=sci' },
    { title: 'Детектив', href: '/catalogue?searchQuery=детектив' },
    { title: 'Абстрактні', href: '/catalogue?searchQuery=абстракт' },
  ];

  const accessories = [
    { title: 'Протектори', href: '/catalogue?searchQuery=протектор' },
    { title: 'Органайзери', href: '/catalogue?searchQuery=органайзер' },
    { title: 'Мініатюри', href: '/catalogue?searchQuery=мініатюр' },
    { title: 'Кубики', href: '/catalogue?searchQuery=кубик' },
    { title: 'Ігрові мати', href: '/catalogue?searchQuery=плеймат' },
    { title: 'Фарби та інструменти', href: '/catalogue?searchQuery=фарб' },
  ];

  const infoLinks = [
    { title: 'Про нас', href: '/about' },
    { title: 'Доставка та оплата', href: '/delivery' },
    { title: 'Повернення', href: '/returns' },
    { title: 'Контакти', href: '/contacts' },
  ];

  const legalLinks = [
    { title: 'Політика конфіденційності', href: '/policy/privacy' },
    { title: 'Умови використання', href: '/policy/terms' },
  ];

  return (
    <footer className="mt-20 mb-5">
      <Container>
        {/* Soft divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-10" />

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand / Socials */}
            <div className="md:col-span-4">
              <Logo />
              <p className="mt-4 text-sm text-gray-600">
                Настільні ігри, аксесуари та корисні поради — все в одному місці. 
                Підберемо ідеальну гру для компанії, родини чи дуелі.
              </p>

              <div className="mt-6 flex items-center gap-2">
                {socials.map(({ icon, href, label }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-gray-50"
                  >
                    <Image src={icon} alt={label} className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                  </a>
                ))}
              </div>

              <div className="mt-6 space-y-1 text-sm">
                <a href="mailto:example@gmail.com" className="text-gray-700 hover:text-primary transition">
                  example@gmail.com
                </a>
                <div>
                  <a href="tel:+380935876935" className="text-gray-700 hover:text-primary transition">
                    +380 93 587 69 35
                  </a>
                </div>
              </div>
            </div>

            {/* Collections */}
            <div className="md:col-span-4">
              <h3 className="text-base font-medium mb-4">Підбірки</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {collections.map((l, idx) => (
                  <Link
                    key={idx}
                    href={l.href}
                    className="group inline-flex items-center justify-between rounded-lg px-2 py-1 transition hover:bg-gray-50"
                  >
                    <span className="truncate">{l.title}</span>
                    <span className="ml-2 inline-block opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Themes */}
            <div className="md:col-span-2">
              <h3 className="text-base font-medium mb-4">Тематики</h3>
              <ul className="space-y-2 text-sm">
                {themes.map((l, i) => (
                  <li key={i}>
                    <Link href={l.href} className="text-gray-700 hover:text-primary transition">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accessories */}
            <div className="md:col-span-2">
              <h3 className="text-base font-medium mb-4">Аксесуари</h3>
              <ul className="space-y-2 text-sm">
                {accessories.map((l, i) => (
                  <li key={i}>
                    <Link href={l.href} className="text-gray-700 hover:text-primary transition">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Info / Legal */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Інформація</h4>
              <ul className="space-y-2 text-sm">
                {infoLinks.map((l, i) => (
                  <li key={i}>
                    <Link href={l.href} className="text-gray-700 hover:text-primary transition">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Юридичні</h4>
              <ul className="space-y-2 text-sm">
                {legalLinks.map((l, i) => (
                  <li key={i}>
                    <Link href={l.href} className="text-gray-700 hover:text-primary transition">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-800">Порада дня</p>
              <p className="mt-1">
                Оберіть ігри за кількістю гравців — так легше знайти ідеальну для вечора з друзями.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">© {year} Всі права захищені.</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Visa</span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Mastercard</span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Apple Pay</span>
            </div>
            <Link href="/catalogue" className="text-xs text-primary hover:underline">
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
