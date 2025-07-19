import { Button } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { TProduct } from '@/utils/types';

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
      {product?.addons && product.addons.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.addons.map(addon => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <li key={addon.id} className={`border rounded-xl p-6 bg-white shadow-md flex flex-col gap-3 ${isSelected ? 'border-primary' : ''}`}>
                <div className="flex items-center gap-4 mb-2">
                  <img src={addon.media.mainImgLink} alt={addon.name} className="w-24 h-16 object-cover rounded-lg border" />
                  <div className="flex-1">
                    <Text.Span className="font-bold text-lg block mb-1">{addon.name}</Text.Span>
                    <Text.Span className="text-primary font-bold text-lg">{addon.price} ₴</Text.Span>
                  </div>
                </div>
                <Text.Paragraph className="mb-2 text-gray-700">{addon.description}</Text.Paragraph>
                <Button
                  variant={isSelected ? 'primary' : 'secondary'}
                  className={`w-fit mt-auto ${isSelected ? '' : 'text-black'}`}
                  onClick={() => {
                    setSelectedAddons(prev =>
                      isSelected ? prev.filter(id => id !== addon.id) : [...prev, addon.id]
                    );
                  }}
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
