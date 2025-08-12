import { Container } from "@/app/ui/components";
import { BlogCard } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";
import { getAllBlogPosts, TBlogPost } from "@/app/actions/blog";
import { BlogControls } from "./ui/BlogControls";
import { BlogPagination } from "./ui/BlogPagination";

const PAGE_SIZE = 6;
const CATEGORIES = ["Всі", "Новини", "Огляди", "Поради"] as const;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page ?? 0) || 0;
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "Всі";

  const result = await getAllBlogPosts(page, PAGE_SIZE, search);
  const posts = result.success ? result.data : [];
  const totalPages = result.success ? result.totalPages : 0;
  const error = result.success ? null : (result.errors?.join(", ") || "Помилка завантаження");

  // Temporary SSR category filter (until API categories exist)
  const filtered: TBlogPost[] =
    category === "Всі"
      ? posts
      : posts.filter((p) => p.title.toLowerCase().includes(category.toLowerCase()));

  return (
    <Container className="mt-10 mb-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero / Intro */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Text.Header className="text-xl md:text-2xl mb-1">Блог</Text.Header>
              <Text.Span className="text-gray-600 text-sm">
                Новини, огляди та поради для поціновувачів настільних ігор.
              </Text.Span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Огляди ігор</Badge>
              <Badge>Нові релізи</Badge>
              <Badge>Гіди та поради</Badge>
            </div>
          </div>
        </section>

        {/* Controls card */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-6">
          <BlogControls
            categories={CATEGORIES as unknown as string[]}
            initialSearch={search}
            initialCategory={category}
          />
        </section>

        {/* Echo current category (SSR visible) */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                category === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Grid */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-4 md:p-6">
          {error ? (
            <div className="min-h-[300px] grid place-items-center">
              <Text.Paragraph className="text-center text-red-500">
                Помилка: {error}
              </Text.Paragraph>
            </div>
          ) : filtered.length === 0 ? (
            <div className="min-h-[300px] grid place-items-center text-center">
              <div>
                <Text.Subheader className="mb-1 text-base">Нічого не знайдено</Text.Subheader>
                <Text.Span className="text-gray-500 text-sm">
                  Спробуйте змінити запит або іншу категорію.
                </Text.Span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="group rounded-xl border border-gray-100 bg-white hover:shadow-md transition">
                  <BlogCard
                    title={item.title}
                    date={new Date(item.createdAt)}
                    img={item.mainImageUrl || "/placeholder.jpg"}
                    href={`/blog/${item.id}`}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <BlogPagination currentPage={page} totalPages={totalPages} />
          </div>
        )}
      </div>
    </Container>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
      {children}
    </span>
  );
}
