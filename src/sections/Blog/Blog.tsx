import { Container } from '@/components';
import { BlogCard } from '@/components';

import { blogConfig } from '@/utils/config';

export const Blog = () => {
  const { title, items } = blogConfig;

  return (
    <Container className='mt-20'>
      <h2 className='text-3xl mb-10'>{title}</h2>

      <div className={`grid grid-cols-3 gap-5`}>
        {items.map(({ title, date, img, href }, index) => (
          <BlogCard
            key={index}
            title={title}
            date={date}
            img={img}
            href={href}
          />
        ))}
      </div>
    </Container>
  )
}
