import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/ui/components';
import { TProduct } from '@/utils/types';

type TProps = {
  products: TProduct[];
  handleEdit: (product: TProduct) => void;
  handleDelete: (productId: number) => void;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const fmt = (n?: number) => (typeof n === 'number' ? `${n.toLocaleString('uk-UA')} ₴` : '—');

export const ProductTable = ({
  products,
  handleEdit,
  handleDelete,
  totalPages,
  currentPage,
  setCurrentPage,
}: TProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Товар</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Тип</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Ціна</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Гравці</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Дії</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((p) => {
              const thumb = p.media?.mainImgLink ?? p.media?.photos?.[0] ?? '';
              const g = (p as any)?.gameDetails;

              const players =
                g?.players ??
                ((g?.minPlayerNumber != null && g?.maxPlayerNumber != null)
                  ? `${g.minPlayerNumber}–${g.maxPlayerNumber}`
                  : '—');

              const typeName =
                (p as any)?.type?.name
                ?? (p as any)?.productType?.name
                ?? p.publicationDetails?.publisher
                ?? '—';

              return (
                <tr key={p.id} className="hover:bg-gray-50/60">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        {thumb ? (
                          <Image alt={p.name} src={thumb} width={48} height={48} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/catalogue/${p.id}`} className="block text-sm font-semibold text-gray-900 hover:underline">
                          {p.name}
                        </Link>
                        <div className="text-xs text-gray-500">ID: {p.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">{typeName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{fmt(p.price)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{players}</td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => handleEdit(p)}>
                        Редагувати
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-xs px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                        onClick={() => handleDelete(p.id)}
                      >
                        Видалити
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Немає товарів
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Сторінка <span className="font-medium">{currentPage + 1}</span> з{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2"
            >
              Попередня
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2"
            >
              Наступна
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
