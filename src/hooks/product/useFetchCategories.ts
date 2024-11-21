import { useEffect, useState } from "react";

import { getAllCategories } from "@/app/actions/categories";
import { TCategory } from "@/utils/types";

export const useFetchCategories = () => {
  const [categories, setCategories] = useState<TCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getAllCategories();

      if (categories.success) {
        setCategories(categories.data.content);
      }
    };

    fetchCategories();
  }, []);

  return categories;
}
