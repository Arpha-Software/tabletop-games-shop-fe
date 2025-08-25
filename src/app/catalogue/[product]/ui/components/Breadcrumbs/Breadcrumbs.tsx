// src/app/catalogue/[product]/ui/components/Breadcrumbs/Breadcrumbs.tsx
import Link from "next/link";

type TProps = {
  links: { href: string; label: string }[];
};

export const Breadcrumbs = ({ links }: TProps) => {
  if (!links?.length) return null;

  return (
    <nav aria-label="Хлібні крихти" className="text-xs md:text-sm">
      <ol className="flex items-center flex-wrap gap-1.5 text-gray-500">
        {links.map((link, i) => {
          const isLast = i === links.length - 1;

          return (
            <li key={`${link.href}-${i}`} className="inline-flex items-center">
              {!isLast ? (
                <Link
                  href={link.href}
                  className="transition-colors hover:text-gray-700"
                >
                  {link.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  title={link.label}
                  className="inline-flex min-w-0 max-w-[55vw] md:max-w-none truncate text-gray-400"
                >
                  {link.label}
                </span>
              )}

              {!isLast && (
                <span aria-hidden="true" className="mx-1.5 text-gray-300">
                  {/* small chevron */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="inline-block align-middle"
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
