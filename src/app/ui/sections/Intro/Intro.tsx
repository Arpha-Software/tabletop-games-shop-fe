import { IntroCard } from '@/app/ui/components';
import { Container } from '@/app/ui/components';
import { introClassNames, introGridConfig } from '@/utils/config';

import { TTitlePosition } from '@/utils/types';

export const Intro = () => {
  const { gridSettings, cards } = introGridConfig;

  return (
    <Container className={gridSettings.className} style={gridSettings.style}>
      {cards.map((card, index) => (
        <IntroCard
          key={index}
          className={introClassNames[card.id]}
          title={card.title}
          img={card.img}
          href={card.href}
          titlePosition={card.titlePosition as TTitlePosition}
        />
      ))}
    </Container>
  );
};
