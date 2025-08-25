import { Container } from '@/app/ui/components';
import { Skeleton } from '@/app/ui/components/Skeleton';

export default function ProductLoading() {
  return (
    <Container className="py-8">
      {/* Layout: same 2-col grid as your ProductIntro (gallery + details) */}
      <div
        className="
          grid gap-6
          lg:grid-cols-[auto_1fr]
          items-start justify-items-start
        "
      >
        {/* LEFT: Gallery skeleton */}
        <div className="justify-self-center lg:justify-self-start">
          <div className="flex gap-4 md:gap-4">
            {/* Main image (square across breakpoints) */}
            <div
              className={[
                'relative overflow-hidden rounded-xl ring-1 ring-gray-200',
                'w-[88vw] max-w-[340px] aspect-square',     // mobile square
                'md:w-[420px] md:h-[420px] md:aspect-auto', // md: 420 square
                'lg:w-[516px] lg:h-[516px]',                // lg: 516 square
              ].join(' ')}
            >
              <Skeleton className="absolute inset-0 rounded-xl" />
            </div>

            {/* Thumbs (vertical, md+) */}
            <div className="hidden md:flex md:flex-col gap-3 flex-none w-[96px] lg:w-[120px]">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full aspect-square rounded-lg ring-1 ring-gray-200"
                />
              ))}
            </div>
          </div>

          {/* Mobile thumbs: horizontal row */}
          <div className="md:hidden mt-3 -mx-1">
            <div className="flex gap-3 overflow-x-auto px-1 snap-x snap-mandatory">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="shrink-0 w-[72px] h-[72px] rounded-lg ring-1 ring-gray-200"
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Product details skeleton (sticky area) */}
        <div className="w-full">
          <div className="sticky top-24">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-28" />
            </div>

            {/* Title */}
            <Skeleton className="h-7 w-3/4 mt-6 rounded-md" />
            <Skeleton className="h-6 w-1/3 mt-3 rounded-md" /> {/* rating line placeholder */}

            {/* Price */}
            <Skeleton className="h-9 w-40 mt-5 rounded-md" />

            {/* Control buttons row */}
            <div className="mt-6 flex items-center gap-3">
              <Skeleton className="h-11 w-40 rounded-full" /> {/* Buy now */}
              <Skeleton className="h-11 w-32 rounded-full" /> {/* Add to cart */}
              <Skeleton className="h-11 w-11 rounded-full" /> {/* Wishlist */}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-10">
        {/* Tab pills */}
        <div className="flex gap-4 border-b pb-3">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-40 rounded-full hidden md:block" />
        </div>

        {/* Tab content area */}
        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[82%]" />
          <Skeleton className="h-4 w-[88%]" />
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-4 w-[64%]" />
        </div>

        {/* Characteristics grid feel */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-x-12 gap-y-3 py-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
