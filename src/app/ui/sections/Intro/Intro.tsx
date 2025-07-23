// src/app/ui/sections/Intro/Intro.tsx
import { Container, Search } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import Image from 'next/image';
import IntroBackground from '@/public/icons/Intro1.png'; // Assuming this is a suitable background image

export const Intro = () => {
  return (
    <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden rounded-b-3xl">
      {/* Background Image */}
      <Image
        src={IntroBackground}
        alt="Tabletop Games Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      <Container className="relative z-20 text-center text-white flex flex-col items-center justify-center px-4">
        <Text.Header className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
          Знайдіть свою ідеальну настільну гру!
        </Text.Header>
        <Text.Subheader className="text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl drop-shadow-md">
          Відкрийте для себе світ захоплюючих пригод та стратегічних битв.
        </Text.Subheader>
        <Search
          className="w-full max-w-md md:max-w-lg lg:max-w-xl" // Make the search bar wide
          inputClassName="py-4 md:py-5 lg:py-6 text-base md:text-lg lg:text-xl rounded-full shadow-xl" // Make input taller and text larger
        />
      </Container>
    </section>
  );
};
