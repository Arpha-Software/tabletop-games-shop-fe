'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllProducts, createProduct } from '@/app/actions/products';
import { TProduct } from '@/utils/types';
import toast from 'react-hot-toast';
import { Loader } from '@/app/ui/components/Loader';
import Link from 'next/link';
import { getAllCategories } from '@/app/actions/categories';
import { getAllGenres } from '@/app/actions/genres';
import { getAllProductTypes } from '@/app/actions/productTypes';

export const ProductsTab = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [categories, setCategories] = useState<{id:number, name:string}[]>([]);
  const [genres, setGenres] = useState<{id:number, name:string}[]>([]);
  const [fileUploads, setFileUploads] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<{id:number, name:string, dimension:{width:number, height:number, length:number, weight:number}}[]>([]);

  const [productData, setProductData] = useState({
    name: '',
    productTypeId: '',
    playerNumber: '',
    quantity: '',
    playTime: '',
    description: '',
    price: '',
    width: '',
    length: '',
    height: '',
    weight: '',
    rulesLink: '',
    categories: [] as string[],
    genres: [] as string[],
    fileUploadRequests: [] as any[],
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
    fetchCategories();
    fetchGenres();
    fetchProductTypes();
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

  const fetchCategories = async () => {
    const res = await getAllCategories();
    if (res.success) setCategories(res.data.content || []);
  };
  const fetchGenres = async () => {
    const res = await getAllGenres();
    if (res.success) setGenres(res.data.content || []);
  };

  const fetchProductTypes = async () => {
    const res = await getAllProductTypes();
    if (res.success) setProductTypes(res.data.content || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setProductData(prev => ({
      ...prev,
      [name]: values,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Create file uploads data
    const uploads = Array.from(files).map((file, idx) => ({
      type: file.type,
      fileSize: file.size,
      uuid: `${file.name}-${Date.now()}-${idx}`,
      isMain: fileUploads.length === 0 && idx === 0, // Only first file of first upload is main
    }));
    
    // Create image previews
    const previews = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(previews).then(previewUrls => {
      setImagePreviews(prev => [...prev, ...previewUrls]);
    });
    
    // Append new files to existing ones
    setFileUploads(prev => [...prev, ...uploads]);
    setProductData(prev => ({ ...prev, fileUploadRequests: [...prev.fileUploadRequests, ...uploads] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productData,
        playerNumber: Number(productData.playerNumber),
        quantity: Number(productData.quantity),
        playTime: Number(productData.playTime),
        price: Number(productData.price),
        width: Number(productData.width),
        length: Number(productData.length),
        height: Number(productData.height),
        weight: Number(productData.weight),
        productTypeId: Number(productData.productTypeId),
      };
      const response = await createProduct(payload);
      if (response.success) {
        toast.success('Товар створено успішно!');
        setShowCreateForm(false);
        setProductData({
          name: '', productTypeId: '', playerNumber: '', quantity: '', playTime: '', description: '', price: '', width: '', length: '', height: '', weight: '', rulesLink: '', categories: [], genres: [], fileUploadRequests: [],
        });
        setFileUploads([]);
        setImagePreviews([]);
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
      productTypeId: product.type?.id?.toString() || '',
      playerNumber: product.playerNumber.toString(),
      quantity: product.quantity?.toString() || '0',
      playTime: product.playTime.toString(),
      description: product.description,
      price: product.price.toString(),
      width: product.width?.toString() || '',
      length: product.length?.toString() || '',
      height: product.height?.toString() || '',
      weight: product.weight?.toString() || '',
      rulesLink: product.rulesLink,
      categories: product.categories,
      genres: product.genres,
      fileUploadRequests: [],
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
              productTypeId: '',
              playerNumber: '',
              quantity: '',
              playTime: '',
              description: '',
              price: '',
              width: '',
              length: '',
              height: '',
              weight: '',
              rulesLink: '',
              categories: [] as string[],
              genres: [] as string[],
              fileUploadRequests: [] as any[],
            });
            setFileUploads([]);
            setImagePreviews([]);
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
            <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
              Скасувати
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input name="name" type="text" value={productData.name} onChange={handleInputChange} placeholder="Назва товару" required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип продукту
                </label>
                <select
                  name="productTypeId"
                  value={productData.productTypeId}
                  onChange={handleInputChange}
                  className="w-full text-xs text-black px-4 py-3 rounded-lg border-[0.5px] border-[#DCDCDC] focus:outline-none focus:border-secondary bg-secondary-100"
                  required
                >
                  <option value="">Оберіть тип продукту</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.dimension.width}×{type.dimension.length}×{type.dimension.height}мм, {type.dimension.weight}кг)
                    </option>
                  ))}
                </select>
              </div>
              <Input name="playerNumber" type="number" value={productData.playerNumber} onChange={handleInputChange} placeholder="Кількість гравців" required />
              <Input name="quantity" type="number" value={productData.quantity} onChange={handleInputChange} placeholder="Кількість товару" required />
              <Input name="playTime" type="number" value={productData.playTime} onChange={handleInputChange} placeholder="Час гри" required />
              <Input name="price" type="number" value={productData.price} onChange={handleInputChange} placeholder="Ціна" required />
              <Input name="rulesLink" type="text" value={productData.rulesLink} onChange={handleInputChange} placeholder="Посилання на правила" />
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Розміри та вага (необов'язково)</h3>
              <p className="text-sm text-gray-600 mb-4">
                Якщо поля залишити порожніми, будуть використані розміри з типу продукту. 
                Заповніть ці поля, щоб перевизначити розміри для цього товару.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ширина (мм) <span className="text-gray-500 font-normal">- необов'язково</span>
                  </label>
                  <Input 
                    name="width" 
                    type="number" 
                    value={productData.width} 
                    onChange={handleInputChange} 
                    placeholder="Залиште порожнім для типу продукту" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Довжина (мм) <span className="text-gray-500 font-normal">- необов'язково</span>
                  </label>
                  <Input 
                    name="length" 
                    type="number" 
                    value={productData.length} 
                    onChange={handleInputChange} 
                    placeholder="Залиште порожнім для типу продукту" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Висота (мм) <span className="text-gray-500 font-normal">- необов'язково</span>
                  </label>
                  <Input 
                    name="height" 
                    type="number" 
                    value={productData.height} 
                    onChange={handleInputChange} 
                    placeholder="Залиште порожнім для типу продукту" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вага (г) <span className="text-gray-500 font-normal">- необов'язково</span>
                  </label>
                  <Input 
                    name="weight" 
                    type="number" 
                    value={productData.weight} 
                    onChange={handleInputChange} 
                    placeholder="Залиште порожнім для типу продукту" 
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Опис товару</h3>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Детальний опис товару..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-h-[100px] resize-vertical"
                required
              />
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Категорії та жанри</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категорії
                  </label>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && !productData.categories.includes(value)) {
                          handleMultiSelectChange('categories', [...productData.categories, value]);
                        }
                        e.target.value = '';
                      }}
                      className="w-full text-xs text-black px-4 py-3 rounded-lg border-[0.5px] border-[#DCDCDC] focus:outline-none focus:border-secondary bg-secondary-100"
                    >
                      <option value="">Додати категорію</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name} disabled={productData.categories.includes(cat.name)}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {productData.categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {productData.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => handleMultiSelectChange('categories', productData.categories.filter((_, i) => i !== index))}
                            className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Жанри
                  </label>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && !productData.genres.includes(value)) {
                          handleMultiSelectChange('genres', [...productData.genres, value]);
                        }
                        e.target.value = '';
                      }}
                      className="w-full text-xs text-black px-4 py-3 rounded-lg border-[0.5px] border-[#DCDCDC] focus:outline-none focus:border-secondary bg-secondary-100"
                    >
                      <option value="">Додати жанр</option>
                      {genres.map(gen => (
                        <option key={gen.id} value={gen.name} disabled={productData.genres.includes(gen.name)}>
                          {gen.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {productData.genres.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {productData.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200"
                        >
                          {genre}
                          <button
                            type="button"
                            onClick={() => handleMultiSelectChange('genres', productData.genres.filter((_, i) => i !== index))}
                            className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Фотографії товару</h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#DCDCDC] rounded-lg cursor-pointer bg-secondary-100 hover:bg-secondary-200 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Натисніть для завантаження</span> або перетягніть файли сюди
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF до 10MB</p>
                    </div>
                  </label>
                </div>
                
                {fileUploads.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Завантажені файли:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {fileUploads.map((file, index) => (
                        <div
                          key={file.uuid}
                          className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {imagePreviews[index] && (
                            <div className="aspect-square bg-gray-100">
                              <img
                                src={imagePreviews[index]}
                                alt={file.uuid.split('-')[0]}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-700 truncate">
                                {file.uuid.split('-')[0]}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newUploads = fileUploads.filter((_, i) => i !== index);
                                  const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                  setFileUploads(newUploads);
                                  setImagePreviews(newPreviews);
                                  setProductData(prev => ({ ...prev, fileUploadRequests: newUploads }));
                                }}
                                className="text-red-500 hover:text-red-700 text-sm font-bold focus:outline-none"
                              >
                                ×
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>Розмір: {(file.fileSize / 1024).toFixed(1)} KB</div>
                              <div>Тип: {file.type}</div>
                              {file.isMain && (
                                <div className="text-blue-600 font-medium">Головне фото</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" variant="primary">
                {editingProduct ? 'Оновити' : 'Створити'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)}>
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
                    <Link href={`/catalogue/${product.id}`} className=' underline'>{product.name}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.type?.name || 'N/A'}
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