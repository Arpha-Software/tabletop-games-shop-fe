import { Text } from '@/utils/ui/Text';
import { TProduct } from '@/utils/types';

type TProps = { product: TProduct | null };

export const Characteristics = ({ product }: TProps) => {
  const characteristicsMap = [
    { label: 'Кількість гравців', value: product?.gameDetails?.players },
    { label: 'Вік', value: product?.gameDetails?.age },
    { label: 'Час гри', value: product?.gameDetails?.playTime },
    { label: 'Мова', value: product?.classification?.language },
    { label: 'Видавець', value: product?.publicationDetails?.publisher },
    { label: 'Рейтинг гри', value: product?.gameDetails?.bggRating },
    { label: 'Складність', value: product?.gameDetails?.complexity },
    { label: 'Механіки', value: product?.classification?.mechanics?.join(', ') },
    { label: 'Жанри', value: product?.classification?.genres?.join(', ') },
    { label: 'Автор', value: product?.publicationDetails?.author },
    { label: 'Комплектація', value: product?.gameDetails?.components },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 py-6">
      {characteristicsMap.map((item, idx) => (
        <div className="flex items-start justify-between" key={idx}>
          <Text.Span className="text-gray-500">{item.label}</Text.Span>
          <Text.Span className="text-gray-900 ml-6">{item.value || '-'}</Text.Span>
        </div>
      ))}
    </div>
  );
};
