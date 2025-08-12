// src/app/ui/sections/Intro/Intro.tsx
import { Container, Search, Button } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import Link from 'next/link';

export const Intro = () => {
  return (
    <section className="relative w-full">
      <div className="relative h-[520px] md:h-[600px] rounded-b-3xl overflow-hidden">
        {/* Soft brand gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-orange-50" />

        {/* Subtle dot pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            color: '#000000',
          }}
        />

        {/* Decorative glows (very soft) */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] w-[560px] h-[560px] rounded-full bg-orange-300/20 blur-3xl" />

        <Container className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Text.Header className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Ваша наступна улюблена настільна гра
          </Text.Header>

          <Text.Subheader className="mt-4 text-base md:text-lg lg:text-xl max-w-2xl text-gray-600">
            Підберемо гру для компанії будь-якого розміру: від сімейних вечорів до стратегічних марафонів.
          </Text.Subheader>

          {/* Search */}
          <div className="w-full max-w-xl mt-8">
            <Search
              className="w-full"
              inputClassName="py-4 md:py-5 text-base md:text-lg rounded-2xl shadow-xl"
            />
          </div>

          {/* CTAs */}
          <div className="mt-6 flex items-center gap-3">
            <Button tag={Link} href="/catalogue" className="px-6 py-3">
              Перейти в каталог
            </Button>
            <Button
              tag={Link}
              href="/blog"
              variant="secondary"
              className="px-6 py-3"
            >
              Читати блог
            </Button>
          </div>

          {/* Feature chips */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl">
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3 text-sm text-gray-700">
              🚚 Доставка по всій Україні
            </div>
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3 text-sm text-gray-700">
              🎯 Розумні рекомендації
            </div>
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3 text-sm text-gray-700">
              🔒 Безпечна оплата
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};
