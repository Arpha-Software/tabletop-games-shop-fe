// src/app/catalogue/[product]/ui/components/ProductDetails/ProductDetails.tsx
import { Breadcrumbs } from '../Breadcrumbs';
import { Title } from '../Title';
import { Price } from '../Price';
import { TProduct } from '@/utils/types';
import { ControlButtons } from '../ControlButtons';

type TProps = {
  product: TProduct | null;
  productId: string;
  selectedAddons?: number[];
  setMainProductLoading?: (loading: boolean) => void;
};

export const ProductDetails = ({
  product,
  productId,
  selectedAddons = [],
  setMainProductLoading,
}: TProps) => {
  const primaryCategory =
    product?.classification?.categories?.[0] ?? '';
  const categoryId = primaryCategory.split(' ').join('_').toLowerCase();

  const links = [
    { href: '/', label: 'Головна' },
    { href: '/catalogue', label: 'Каталог' },
    { href: `/catalogue?category=${categoryId}`, label: primaryCategory },
    { href: `/catalogue/${productId}`, label: product?.name || '' },
  ];

  const rating = product?.averageRating ?? null;
  const reviews = product?.reviewCount ?? null;

  return (
    <section className="flex w-full flex-col">
      {/* Breadcrumbs — light and compact */}
      <div className="mb-3 md:mb-4">
        <Breadcrumbs links={links} />
      </div>

      {/* Title */}
      <Title
        className="mt-2 text-balance leading-tight md:mt-3"
        text={product?.name || ''}
      />

      {/* Rating row */}
      {(typeof rating === 'number' && typeof reviews === 'number') && (
        <div className="mt-3 flex items-center gap-2 text-sm md:text-base">
          {/* Stars */}
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} aria-hidden="true">
                {i < Math.round(rating) ? '★' : '☆'}
              </span>
            ))}
          </div>

          {/* Score */}
          <span className="font-medium text-gray-800">{rating.toFixed(1)}</span>

          {/* Reviews count */}
          <a
            href="#reviews"
            className="text-xs md:text-sm text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Перейти до відгуків"
          >
            ({reviews})
          </a>
        </div>
      )}

      {/* Price */}
      <Price price={product?.price || 0} className="mt-4 md:mt-6" />

      {/* Thin divider for visual rhythm (not a full box) */}
      <div className="mt-5 border-t border-gray-100" />

      {/* Actions */}
      <div className="mt-5">
        <ControlButtons
          product={product ?? undefined}
          selectedAddons={selectedAddons}
          setMainProductLoading={setMainProductLoading}
        />
      </div>

      {/* Micro copy (availability / delivery hint) — optional, unobtrusive */}
      {typeof product?.quantity === 'number' && (
        <p className="mt-3 text-xs md:text-sm text-gray-500">
          {product.quantity > 0
            ? 'Є в наявності — відправка протягом 24 годин'
            : 'Наразі немає в наявності'}
        </p>
      )}
    </section>
  );
};
