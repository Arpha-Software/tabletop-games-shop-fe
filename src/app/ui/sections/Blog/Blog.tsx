import { Container } from '@/app/ui/components';
import { BlogCard } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllBlogPosts } from '@/app/actions/blog'; // Import the new action

export const Blog = async () => { // Made the component async
  const PAGE_SIZE_LANDING = 3;
  const { data: blogPosts, errors, success } = await getAllBlogPosts(0, PAGE_SIZE_LANDING); // Fetch up to 3 posts

  if (!success || errors.length > 0) {
    console.error("Failed to fetch blog posts for landing page:", errors.join(", "));
    return (
      <Container className='mt-20'>
        <Text.Header className='mb-10'>Наш Блог</Text.Header> {/* Keep a default title */}
        <Text.Paragraph className="text-center opacity-60">
          Не вдалося завантажити статті блогу. Спробуйте пізніше.
        </Text.Paragraph>
      </Container>
    );
  }

  // Ensure blogPosts is an array before slicing, although getAllBlogPosts should return [] on error
  const displayedPosts = blogPosts?.slice(0, PAGE_SIZE_LANDING) || [];

  return (
    <Container className='mt-20'>
      <Text.Header className='mb-10'>Наш Блог</Text.Header> {/* Assuming a static title for the landing page blog section */}

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`}> {/* Adjusted grid for responsiveness if needed */}
        {displayedPosts.length === 0 ? (
          <Text.Paragraph className="col-span-full text-center opacity-60">Поки що немає статей.</Text.Paragraph>
        ) : (
          displayedPosts.map((item) => (
            <BlogCard
              key={item.id} // Use item.id as key
              title={item.title}
              date={new Date(item.createdAt)} // Format date
              img={item.mainImageUrl || '/path/to/placeholder-image.jpg'} // Fallback if mainImageUrl is null
              href={`/blog/${item.id}`} // Link to the article page by ID
            />
          ))
        )}
      </div>
    </Container>
  );
}
