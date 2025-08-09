"use client";

import { Container } from "@/app/ui/components";
import { BlogCard } from "@/app/ui/components";
import { Pagination } from "@/app/ui/components/Pagination";
import { Text } from "@/utils/ui/Text";
import { useState, useEffect, useCallback } from "react";
import { getAllBlogPosts, TBlogPost } from "@/app/actions/blog";

const PAGE_SIZE = 6;

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Всі");
  const [page, setPage] = useState(0);
  const [blogPosts, setBlogPosts] = useState<TBlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Всі", "Новини", "Огляди", "Поради"];

  const fetchBlogPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getAllBlogPosts(page, PAGE_SIZE, search);
    if (result.success) {
      // Client-side filtering by category still applies as the API doesn't seem to support it
      const filteredByUICategory = (result.data || []).filter(
        (item) => 
          category === "Всі" || 
          // Assuming categories can be inferred from title or content, or a placeholder logic
          // A more robust solution would involve backend category filtering or a dedicated category field in TBlogPost
          item.title.toLowerCase().includes(category.toLowerCase())
      );
      setBlogPosts(filteredByUICategory);
      setTotalPages(result.totalPages || 0); // Total pages from API for API-driven pagination
    } else {
      setError(result.errors.join(", "));
      setBlogPosts([]);
      setTotalPages(0);
    }
    setLoading(false);
  }, [page, search, category]); // Added category to dependency array to re-fetch when category changes

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  return (
    <Container className="mt-10 mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <Text.Header>Блог</Text.Header>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Пошук статей..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="rounded-3xl px-6 py-3 text-xs border border-secondary-100 w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-3xl border text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-secondary border-secondary-100 hover:bg-secondary-100"
              }`}
              onClick={() => {
                setCategory(cat);
                setPage(0);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <Text.Paragraph className="col-span-full text-center opacity-60 mt-20">Завантаження...</Text.Paragraph>
        ) : error ? (
          <Text.Paragraph className="col-span-full text-center text-red-500 mt-20">Помилка: {error}</Text.Paragraph>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 min-h-[400px]">
            {blogPosts.length === 0 ? (
              <Text.Paragraph className="col-span-full text-center opacity-60 mt-20">Нічого не знайдено</Text.Paragraph>
            ) : (
              blogPosts.map((item) => (
                <BlogCard
                  key={item.id}
                  title={item.title}
                  date={new Date(item.createdAt)}
                  // Provide a fallback image or ensure mainImageUrl is never null/undefined if BlogCard uses Next/Image without fallback
                  img={item.mainImageUrl || '/path/to/placeholder-image.jpg'} // Fallback if mainImageUrl is null
                  href={`/blog/${item.id}`}
                  className="h-full"
                />
              ))
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
