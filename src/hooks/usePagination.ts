import { TPageable } from "@/utils/types";
import { useEffect, useState } from "react";

export const usePagination = (pageable: TPageable | null, changePage: any) => {
  const [currentPage, setCurrentPage] = useState(pageable?.pageNumber || 0);

  useEffect(() => {
    setCurrentPage((pageable?.pageNumber || 0));
  }, [pageable]);

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  return {
    currentPage,
    handlePageChange,
  };
}
