'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllProductTypes, createProductType } from '@/app/actions/productTypes';
import { TProductType } from '@/utils/types';
import toast from 'react-hot-toast';
import { Loader } from '@/app/ui/components/Loader';

export const ProductTypesTab = () => {
  const [productTypes, setProductTypes] = useState<TProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProductType, setEditingProductType] = useState<TProductType | null>(null);
  const [productTypeData, setProductTypeData] = useState({
    name: '',
    width: '',
    height: '',
    weight: '',
    length: '',
  });

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      const response = await getAllProductTypes();
      
      if (response.success) {
        setProductTypes(response.data.content);
      } else {
        toast.error('Помилка завантаження типів продуктів');
      }
    } catch (error) {
      toast.error('Помилка завантаження типів продуктів');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductTypeData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productTypeData.name.trim()) {
      toast.error('Назва типу продукту не може бути порожньою');
      return;
    }

    try {
      const payload = {
        name: productTypeData.name.trim(),
        width: Number(productTypeData.width),
        height: Number(productTypeData.height),
        weight: Number(productTypeData.weight),
        length: Number(productTypeData.length),
      };

      const response = await createProductType(payload);
      
      if (response.success) {
        toast.success(editingProductType ? 'Тип продукту оновлено успішно!' : 'Тип продукту створено успішно!');
        setShowCreateForm(false);
        setProductTypeData({
          name: '',
          width: '',
          height: '',
          weight: '',
          length: '',
        });
        setEditingProductType(null);
        fetchProductTypes();
      } else {
        toast.error(response.errors[0] || 'Помилка створення типу продукту');
      }
    } catch (error) {
      toast.error('Помилка створення типу продукту');
    }
  };

  const handleEdit = (productType: TProductType) => {
    setEditingProductType(productType);
    setProductTypeData({
      name: productType.name,
      width: productType.dimension.width.toString(),
      height: productType.dimension.height.toString(),
      weight: productType.dimension.weight.toString(),
      length: productType.dimension.length.toString(),
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (productTypeId: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей тип продукту?')) {
      // TODO: Implement delete product type API call
      toast.error('Функція видалення поки не реалізована');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setProductTypeData({
      name: '',
      width: '',
      height: '',
      weight: '',
      length: '',
    });
    setEditingProductType(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Text.Header>Управління типами продуктів</Text.Header>
        <Button 
          variant="primary" 
          onClick={() => {
            setShowCreateForm(true);
            setEditingProductType(null);
            setProductTypeData({
              name: '',
              width: '',
              height: '',
              weight: '',
              length: '',
            });
          }}
        >
          Додати тип продукту
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <Text.Header className="text-lg">
              {editingProductType ? 'Редагувати тип продукту' : 'Створити новий тип продукту'}
            </Text.Header>
            <Button 
              variant="secondary" 
              onClick={handleCancel}
            >
              Скасувати
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Назва типу продукту
                </label>
                <Input
                  name="name"
                  value={productTypeData.name}
                  onChange={handleInputChange}
                  placeholder="Введіть назву типу продукту"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ширина (мм)
                </label>
                <Input
                  name="width"
                  type="number"
                  step="0.1"
                  value={productTypeData.width}
                  onChange={handleInputChange}
                  placeholder="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Висота (мм)
                </label>
                <Input
                  name="height"
                  type="number"
                  step="0.1"
                  value={productTypeData.height}
                  onChange={handleInputChange}
                  placeholder="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Довжина (мм)
                </label>
                <Input
                  name="length"
                  type="number"
                  step="0.1"
                  value={productTypeData.length}
                  onChange={handleInputChange}
                  placeholder="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Вага (кг)
                </label>
                <Input
                  name="weight"
                  type="number"
                  step="0.001"
                  value={productTypeData.weight}
                  onChange={handleInputChange}
                  placeholder="0.001"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" variant="primary">
                {editingProductType ? 'Оновити' : 'Створити'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleCancel}
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
                  Розміри (мм)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Вага (кг)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productTypes.map((productType) => (
                <tr key={productType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {productType.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {productType.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {productType.dimension.width} × {productType.dimension.length} × {productType.dimension.height}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {productType.dimension.weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="text-xs px-3 py-1"
                        onClick={() => handleEdit(productType)}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-xs px-3 py-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(productType.id)}
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
        
        {productTypes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Типи продуктів не знайдено
          </div>
        )}
      </div>
    </div>
  );
}; 