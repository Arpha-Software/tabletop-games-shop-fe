'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllProducts, createProduct } from '@/app/actions/products';
import { TProduct } from '@/utils/types';
import toast from 'react-hot-toast';
import { Loader } from '@/app/ui/components/Loader';

export const ProductsTab = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);

  const [productData, setProductData] = useState({
    name: '',
    type: '',
    playerNumber: '',
    quantity: '',
    playTime: '',
    description: '',
    price: '',
    rulesLink: '',
    categories: [''],
    genres: [''],
  });

  const formInputs = [
    { name: 'name', placeholder: 'Назва товару', type: 'text' },
    { name: 'type', placeholder: 'Тип', type: 'text' },
    { name: 'playerNumber', placeholder: 'Кількість гравців', type: 'number' },
    { name: 'quantity', placeholder: 'Кількість товару', type: 'number' },
    { name: 'playTime', placeholder: 'Час гри', type: 'number' },
    { name: 'description', placeholder: 'Опис', type: 'text' },
    { name: 'price', placeholder: 'Ціна', type: 'number' },
    { name: 'rulesLink', placeholder: 'Посилання на правила', type: 'text' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts(currentPage);
      
      if (response.success) {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error('Помилка завантаження товарів');
      }
    } catch (error) {
      toast.error('Помилка завантаження товарів');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productPayload = {
        ...productData,
        playerNumber: Number(productData.playerNumber),
        quantity: Number(productData.quantity),
        playTime: Number(productData.playTime),
        price: Number(productData.price),
      };

      const response = await createProduct(productPayload);
      
      if (response.success) {
        toast.success('Товар створено успішно!');
        setShowCreateForm(false);
        setProductData({
          name: '',
          type: '',
          playerNumber: '',
          quantity: '',
          playTime: '',
          description: '',
          price: '',
          rulesLink: '',
          categories: [''],
          genres: [''],
        });
        fetchProducts();
      } else {
        toast.error(response.errors[0] || 'Помилка створення товару');
      }
    } catch (error) {
      toast.error('Помилка створення товару');
    }
  };

  const handleEdit = (product: TProduct) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      type: product.type,
      playerNumber: product.playerNumber.toString(),
      quantity: '0', // Assuming quantity is not in the product type
      playTime: product.playTime.toString(),
      description: product.description,
      price: product.price.toString(),
      rulesLink: product.rulesLink,
      categories: product.categories,
      genres: product.genres,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
      // TODO: Implement delete product API call
      toast.error('Функція видалення поки не реалізована');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Text.Header>Управління товарами</Text.Header>
        <Button 
          variant="primary" 
          onClick={() => {
            setShowCreateForm(true);
            setEditingProduct(null);
            setProductData({
              name: '',
              type: '',
              playerNumber: '',
              quantity: '',
              playTime: '',
              description: '',
              price: '',
              rulesLink: '',
              categories: [''],
              genres: [''],
            });
          }}
        >
          Додати товар
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <Text.Header className="text-lg">
              {editingProduct ? 'Редагувати товар' : 'Створити новий товар'}
            </Text.Header>
            <Button 
              variant="secondary" 
              onClick={() => setShowCreateForm(false)}
            >
              Скасувати
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {formInputs.map(({ name, placeholder, type }) => (
                <Input
                  key={name}
                  name={name}
                  type={type}
                  value={productData[name as keyof typeof productData] as string}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  required
                />
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" variant="primary">
                {editingProduct ? 'Оновити' : 'Створити'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowCreateForm(false)}
              >
                Скасувати
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Назва
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ціна
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Гравці
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price} ₴
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.playerNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="text-xs px-3 py-1"
                        onClick={() => handleEdit(product)}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-xs px-3 py-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(product.id)}
                      >
                        Видалити
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Попередня
              </Button>
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Наступна
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Сторінка <span className="font-medium">{currentPage + 1}</span> з{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="secondary"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    Попередня
                  </Button>
                  <Button
                    variant="secondary"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    Наступна
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 