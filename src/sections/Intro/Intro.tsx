import { IntroCard } from '@/components';
import { Container } from '@/components';

export const Intro = () => {
  return (
    <Container
      className="grid gap-4 grid-cols-10 mt-10"
      style={{ gridTemplateRows: '30px repeat(11, minmax(30px, 1fr))' }}
    >
      <IntroCard className='col-span-2 row-span-4 row-start-1' title='Бонуси' img='https://res.cloudinary.com/dkwve6mul/image/upload/v1729532461/Intro1_dry0rt.png' href='/bonuses' titlePosition={'top'} />
      <IntroCard className='col-span-2 row-span-4 row-start-5' title='Знижки' img='https://res.cloudinary.com/dkwve6mul/image/upload/v1729539861/Rectangle_4_qet3kz.png' href='/discounts' titlePosition={'top'} />
      <IntroCard className='col-span-2 row-span-4 row-start-9' title='Гарячі пропозиції' img='https://res.cloudinary.com/dkwve6mul/image/upload/v1729539882/Rectangle_5_rdxpa5.png' href='/hot-deals' titlePosition={'top'} />
      <IntroCard className='col-start-3 col-span-4 row-span-12' title='Щоденна пропозиція' img='https://res.cloudinary.com/dkwve6mul/image/upload/v1729539907/Rectangle_3_hwkuvh.png' href='/daily-offer' titlePosition={'top'} />
      <IntroCard className='col-span-4 row-span-6' title='Спеціальні пропозиції' img='https://res.cloudinary.com/dkwve6mul/image/upload/v1729539947/Rectangle_44_j33gqd.png' href='/special-offers' titlePosition={'top'} />
      <IntroCard className='col-span-2 row-span-6' title='До каталогу' img='https://res.cloudinary.com/dkwve6mul/image/upload/v1729539975/Rectangle_8_adjun7.png' href='/catalog' titlePosition={'top'} />
      <IntroCard className='col-span-2 row-span-6' title='До обраних' img='https://res.cloudinary.com/dkwve6mul/image/upload/v1729539975/Rectangle_7_lkk169.png' href='/favorites' titlePosition={'top'} />
    </Container>
  );
};
