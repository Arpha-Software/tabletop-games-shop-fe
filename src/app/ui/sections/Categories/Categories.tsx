'use client';

import { CategoryCard } from "@/app/ui/components";
import { Container } from "@/app/ui/components";
import { Button } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/app/actions/categories";
import { TCategory } from "@/utils/types";
import { categoriesSectionConfig } from "@/utils/config";

export const Categories = () => {
  const { title, buttonTitle } = categoriesSectionConfig;

  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getAllCategories();

        if (result.success && result.data) {
          setCategories(result.data);
        } else {
          setError(result.errors.join(', ') || "Failed to load categories.");
          setCategories([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        setError(err.message || "An unexpected error occurred while fetching categories.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Container className="py-16 text-center">
        <Text.Header className="text-gray-500">Завантаження категорій...</Text.Header>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-16 text-center">
        <Text.Header className="text-red-500">Помилка завантаження категорій: {error}</Text.Header>
      </Container>
    );
  }

  if (categories.length === 0) {
    return (
      <Container className="py-16 text-center">
        <Text.Header className="text-gray-500">Категорії не знайдено.</Text.Header>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="flex justify-between items-center mb-12">
        <Text.Header className="text-3xl font-bold text-gray-800">
          {title || "Наші Категорії"}
        </Text.Header>
        <Button variant="secondary" className="px-6 py-3 text-base" href="/catalogue">
          {buttonTitle || "Переглянути всі"}
        </Button>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.name}
            img={'https://placehold.co/400x300/E0E0E0/333333?text=No+Image'}
            href={`/catalogue?category=${category.id}`}
            className="h-60"
          />
        ))}
      </div>
    </Container>
  );
};
