import { getBlogPostById, TBlogPost, TComment } from "@/app/actions/blog";
import { Container } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";
import Image from "next/image";

export default async function Article({ params }: { params: { article: string } }) {
  const { article: postId } = params;
  const { data: blogPost, errors } = await getBlogPostById(postId);

  if (errors.length > 0) {
    return (
      <Container className="mt-10 mb-16">
        <Text.Header className="text-center text-red-500">Помилка завантаження статті</Text.Header>
        <Text.Paragraph className="text-center opacity-60 mt-4">{errors.join(", ")}</Text.Paragraph>
      </Container>
    );
  }

  if (!blogPost) {
    return (
      <Container className="mt-10 mb-16">
        <Text.Header className="text-center">Статтю не знайдено</Text.Header>
        <Text.Paragraph className="text-center opacity-60 mt-4">Можливо, стаття була видалена або переміщена.</Text.Paragraph>
      </Container>
    );
  }

  return (
    <Container className="mt-10 mb-16">
      <div className="max-w-4xl mx-auto">
        <Text.Header className="text-center mb-8">{blogPost.title}</Text.Header>

        {blogPost.mainImageUrl && (
          <div className="mb-8">
            <Image
              src={blogPost.mainImageUrl}
              alt={blogPost.title}
              width={800} // Adjust width and height as needed
              height={400} // Adjust width and height as needed
              layout="responsive"
              className="rounded-lg shadow-md"
            />
          </div>
        )}

        <Text.Paragraph className="text-sm text-gray-500 mb-4">
          Автор: {blogPost.author} | Опубліковано: {new Date(blogPost.createdAt).toLocaleDateString()}
        </Text.Paragraph>

        <div className="prose max-w-none mb-10">
          <Text.Paragraph>{blogPost.content}</Text.Paragraph>
        </div>

        {blogPost.otherImageUrls && blogPost.otherImageUrls.length > 0 && (
          <div className="mb-10 grid grid-cols-2 gap-4">
            {blogPost.otherImageUrls.map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                alt={`${blogPost.title} image ${index + 1}`}
                width={400}
                height={300}
                layout="responsive"
                className="rounded-lg shadow-sm"
              />
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 pt-8">
          <Text.Header className="text-xl mb-6">Коментарі ({blogPost.comments.length})</Text.Header>
          {blogPost.comments.length === 0 ? (
            <Text.Paragraph className="opacity-60">Будьте першим, хто прокоментує!</Text.Paragraph>
          ) : (
            <div className="space-y-6">
              {blogPost.comments.map((comment: TComment) => (
                <div key={comment.id} className="border p-4 rounded-lg bg-gray-50">
                  <Text.Paragraph className="font-medium text-gray-800">{comment.username}</Text.Paragraph>
                  <Text.Paragraph className="text-sm text-gray-500 mb-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text.Paragraph>
                  <Text.Paragraph className="text-gray-700">{comment.content}</Text.Paragraph>
                </div>
              ))}
            </div>
          )}
          {/* Add a comment form here if needed */}
        </div>
      </div>
    </Container>
  );
}
