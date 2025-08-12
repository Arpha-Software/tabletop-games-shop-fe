import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/ui/components/Button';
import { cn } from '@/utils/helpers';

type TProps = {
  title: string;
  date: Date;
  img: string;
  href: string;
  className?: string;
};

export const BlogCard = ({ title, date, img, href, className }: TProps) => {
  return (
    <Link href={href} aria-label={`Читати: ${title}`} className={cn('group block', className)}>
      <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md focus-within:shadow-md">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, 100vw"
            priority={false}
          />
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          <h3 className="text-base md:text-lg font-medium leading-tight line-clamp-2">
            {title}
          </h3>

          <div className="mt-4 flex items-center justify-between">
            <time
              dateTime={date.toISOString()}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500"
              aria-label={`Дата публікації: ${date.toLocaleDateString('uk-UA')}`}
            >
              <CalendarIcon />
              {date.toLocaleDateString('uk-UA')}
            </time>

            <Button variant="secondary" className="px-3 py-1.5 text-xs inline-flex justify-center items-center">
              <span>Читати</span>
              <ArrowRightIcon className="inline ml-1.5 h-4 w-4 align-middle" />
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
};

/* ---- tiny inline icons to avoid extra deps ---- */
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="opacity-70">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v3H3V5a1 1 0 0 1 1-1h3V2Zm14 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9h18ZM7 14H5v2h2v-2Zm6 0h-2v2h2v-2Zm6 0h-2v2h2v-2Z"
      />
    </svg>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M10 6l6 6l-6 6l-1.4-1.4L12.2 12l-3.6-3.6L10 6Z"
      />
    </svg>
  );
}
