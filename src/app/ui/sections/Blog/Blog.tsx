import { Container } from '@/app/ui/components';
import { BlogCard } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';

import { blogConfig } from '@/utils/config';

export const Blog = () => {
  const { title, items } = blogConfig;

  return (
    <Container className='mt-20'>
      <Text.Header className='mb-10'>{title}</Text.Header>

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
