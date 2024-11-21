import { useEffect, useState } from "react";

import { getAllGenres } from "@/app/actions/genres";
import { TGenre } from "@/utils/types";

export const useFetchGenres = () => {
  const [genres, setGenres] = useState<TGenre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const genres = await getAllGenres();

      if (genres.success) {
        setGenres(genres.data.content);
      }
    };

    fetchGenres();
  }, []);

  return genres;
}
