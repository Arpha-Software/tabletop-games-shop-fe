import { Button } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { TProduct } from '@/utils/types';
import { cn } from '@/utils/helpers';

type TProps = {
  product: TProduct | null;
  selectedAddons: number[];
  setSelectedAddons: React.Dispatch<React.SetStateAction<number[]>>;
  mainProductLoading: boolean;
};

export const Addons = ({ product, selectedAddons, setSelectedAddons, mainProductLoading }: TProps) => {
  return (
    <div className="py-6">
      <Text.Header className="mb-4 text-xl">Доповнення</Text.Header>
      {product?.addons?.length ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {product.addons.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <li
                key={addon.id}
                className={cn(
                  'border rounded-2xl p-5 bg-white shadow-card transition-shadow hover:shadow-md',
                  isSelected ? 'border-primary/60' : 'border-gray-100'
                )}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={addon.media.mainImgLink}
                    alt={addon.name}
                    className="w-24 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <Text.Span className="font-semibold text-base block truncate">{addon.name}</Text.Span>
                    <Text.Span className="text-primary font-bold text-lg">{addon.price} ₴</Text.Span>
                  </div>
                </div>

                {addon.description ? (
                  <Text.Paragraph className="mt-3 text-gray-700">{addon.description}</Text.Paragraph>
                ) : null}

                <Button
                  variant={isSelected ? 'primary' : 'secondary'}
                  className={cn('mt-4', isSelected ? '' : 'text-black')}
                  onClick={() =>
                    setSelectedAddons((prev) =>
                      isSelected ? prev.filter((id) => id !== addon.id) : [...prev, addon.id]
                    )
                  }
                  disabled={mainProductLoading}
                >
                  {isSelected ? 'Додано' : 'Додати'}
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        <Text.Paragraph>Наразі для цього товару немає доповнень.</Text.Paragraph>
      )}
    </div>
  );
};
