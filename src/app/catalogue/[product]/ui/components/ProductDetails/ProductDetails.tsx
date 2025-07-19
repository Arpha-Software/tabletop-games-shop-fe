import { Breadcrumbs } from '../Breadcrumbs';
import { Title } from '../Title';
import { Rating } from '../Rating';
import { Price } from '../Price';
import { ControlButtons } from '../ControlButtons';
import { TProduct } from '@/utils/types';

type TProps = {
  product: TProduct | null;
  productId: string;
  selectedAddons: number[];
  setMainProductLoading: (loading: boolean) => void;
};

export const ProductDetails = ({ product, productId, selectedAddons, setMainProductLoading }: TProps) => {
  const categoryId = product?.classification.categories[0]?.split(' ').join('_').toLowerCase() || '';
  const category = product?.classification.categories[0] || '';

  const links = [
    { href: '/', label: 'Головна' },
    { href: '/catalogue', label: 'Каталог' },
    { href: `/catalogue?category=${categoryId}`, label: category },
    { href: `/catalogue/${productId}`, label: product?.name || '' }
  ];

  return (
    <section className='flex flex-col justify-between w-full pl-10'>
      <div>
        <Breadcrumbs links={links} />
        <Title className='mt-10' text={product?.name || ''} />
        {(typeof product?.averageRating === 'number' && typeof product?.reviewCount === 'number') && (
          <div className="flex items-center gap-2 mt-2 mb-2">
            <span className="text-yellow-500 text-lg">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>{i < Math.round((product.averageRating ?? 0)) ? '★' : '☆'}</span>
              ))}
            </span>
            <span className="text-gray-700 text-base font-medium">{(product.averageRating ?? 0).toFixed(1)}</span>
            <span className="text-gray-400 text-sm">({product.reviewCount})</span>
          </div>
        )}
        <Price price={product?.price || 0} className='mt-6' />
      </div>
      <ControlButtons product={product} className='mt-6' selectedAddons={selectedAddons} setMainProductLoading={setMainProductLoading} />
    </section>
  );
};
