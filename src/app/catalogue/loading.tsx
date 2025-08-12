// src/app/catalogue/loading.tsx
import { Container } from '../ui/components';

const SkeletonChip = () => (
  <div className="h-8 w-28 rounded-full bg-gray-100 animate-pulse" />
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-card overflow-hidden">
    <div className="h-40 sm:h-48 bg-gray-100 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
      <div className="mt-4 h-8 w-24 bg-gray-100 rounded-full animate-pulse" />
    </div>
  </div>
);

export default function LoadingCatalogue() {
  return (
    <Container className="mt-10">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-10 px-4 md:px-8 lg:px-16">
        <div className="h-8 w-64 bg-gray-100 rounded animate-pulse" />
        <div className="h-10 w-48 bg-gray-100 rounded-full animate-pulse" />
      </div>

      <div className="flex gap-6 lg:gap-10">
        {/* Filters column skeleton (keeps layout stable) */}
        <aside className="hidden md:block w-80 shrink-0">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card space-y-6">
            <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => <SkeletonChip key={i} />)}
            </div>
          </div>
        </aside>

        {/* Grid skeleton */}
        <main className="flex-1">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-6 lg:px-8">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </main>
      </div>
    </Container>
  );
}
