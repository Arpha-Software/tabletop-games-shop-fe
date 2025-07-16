"use client";

import { Container } from "@/app/ui/components";
import { BlogCard } from "@/app/ui/components";
import { Search } from "@/app/ui/components/Search";
import { Pagination } from "@/app/ui/components/Pagination";
import { Text } from "@/utils/ui/Text";
import { blogPageConfig } from "@/utils/config";
import { useState } from "react";

const PAGE_SIZE = 6;

export default function BlogPage() {
  const { title, items, categories } = blogPageConfig;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Всі");
  const [page, setPage] = useState(0);

  // Filter by category and search
  const filtered = items.filter(
    (item) =>
      (category === "Всі" || item.category === category) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <Container className="mt-10 mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <Text.Header>{title}</Text.Header>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 min-h-[400px]">
          {paginated.length === 0 ? (
            <Text.Paragraph className="col-span-full text-center opacity-60 mt-20">Нічого не знайдено</Text.Paragraph>
          ) : (
            paginated.map((item, idx) => (
              <BlogCard
                key={item.href + idx}
                title={item.title}
                date={item.date}
                img={item.img}
                href={item.href}
                className="h-full"
              />
            ))
          )}
        </div>

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
