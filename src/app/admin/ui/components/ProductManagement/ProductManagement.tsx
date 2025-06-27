'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

import { createCategory } from '@/app/actions/categories';
import { createGenre } from '@/app/actions/genres';
import { createProduct, deleteProduct, updateProduct } from '@/app/actions/products';

import { Button, Input } from '@/app/ui/components';
import { CategorySelector } from '@/app/catalogue/ui/components/CategorySelector';
import { ImageUploader } from '@/app/catalogue/ui/components/ImageUploader';
import { Pagination } from '@/app/ui/components/Pagination';

import { ImageWithUUID, TCategory, TGenre, TProduct } from '@/utils/types';
import { useFetchCategories } from '@/hooks/product/useFetchCategories';
import { useFetchGenres } from '@/hooks/product/useFetchGenres';
import { arrayBufferToBase64, cn } from '@/utils/helpers';
import { Text } from '@/utils/ui/Text';

const ITEMS_PER_PAGE = 10;

export const ProductManagement = () => {
  const oldCategories = useFetchCategories();
  const oldGenres = useFetchGenres();

  const [products, setProducts] = useState<TProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [newCategories, setNewCategories] = useState<TCategory[]>([]);
  const [newGenres, setNewGenres] = useState<TGenre[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [newGenre, setNewGenre] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [images, setImages] = useState<ImageWithUUID[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [productData, setProductData] = useState({
    name: '',
    type: '',
    playerNumber: '',
    quantity: '',
    playTime: '',
    description: '',
    price: '',
    rulesLink: '',
  });

  const formInputs = [
    { name: 'name', placeholder: 'Назва товару' },
    { name: 'type', placeholder: 'Тип' },
    { name: 'playerNumber', placeholder: 'Кількість гравців (наприклад, 2-4)' },
    { name: 'quantity', placeholder: 'Кількість товару (на складі)' },
    { name: 'playTime', placeholder: 'Час гри (наприклад, 30-60 хв)' },
    { name: 'description', placeholder: 'Опис' },
    { name: 'price', placeholder: 'Ціна (грн)' },
    { name: 'rulesLink', placeholder: 'Посилання на правила (необов\'язково)' },
  ];

  const handleCreateProduct = async () => {
    if (!productData.name || !selectedCategory || !selectedGenre || images.length === 0 || !productData.price) {
      toast.error('Будь ласка, заповніть усі обов\'язкові поля та додайте хоча б одне зображення.');
      return;
    }

    try {
      const [newCategoriesNames, newGenresNames, oldCategoriesNames, oldGenresNames] = [
        newCategories.map((category) => category.name),
        newGenres.map((genre) => genre.name),
        oldCategories.map((category) => category.name),
        oldGenres.map((genre) => genre.name),
      ];

      const createIfNew = async (name: string, isNew: boolean, createAction: any, type: 'category' | 'genre') => {
        if (isNew && name.trim()) {
          const response = await createAction({ name });
          if (!response.success) {
            toast.error(`Помилка створення ${type === 'category' ? 'категорії' : 'жанру'} "${name}"!`);
            console.error(`Failed to create ${name}:`, response.errors);
            return false;
          }
          toast.success(`${type === 'category' ? 'Категорію' : 'Жанр'} "${name}" успішно створено!`);
        }
        return true;
      };

      let currentSelectedCategory = selectedCategory;
      if (newCategory.trim() && !oldCategoriesNames.includes(newCategory.trim()) && !newCategoriesNames.includes(newCategory.trim())) {
        currentSelectedCategory = newCategory.trim();
        const categoryCreated = await createIfNew(currentSelectedCategory, true, createCategory, 'category');
        if (!categoryCreated) return;
        setNewCategories(prev => [...prev, { id: Date.now().toString(), name: currentSelectedCategory }]);
        setNewCategory('');
      }

      let currentSelectedGenre = selectedGenre;
      if (newGenre.trim() && !oldGenresNames.includes(newGenre.trim()) && !newGenresNames.includes(newGenre.trim())) {
        currentSelectedGenre = newGenre.trim();
        const genreCreated = await createIfNew(currentSelectedGenre, true, createGenre, 'genre');
        if (!genreCreated) return;
        setNewGenres(prev => [...prev, { id: Date.now().toString(), name: currentSelectedGenre }]);
        setNewGenre('');
      }

      if (!currentSelectedCategory || !currentSelectedGenre) {
        toast.error('Категорія та жанр мають бути обрані або створені.');
        return;
      }

      const imagesBase64 = await Promise.all(
        images.map(async (image, index) => {
          const buffer = await image.file.arrayBuffer();
          return {
            id: index,
            uuid: image.uuid,
            base64: arrayBufferToBase64(buffer),
          };
        })
      );

      const imagesMeta = images.map((image, index) => ({
        type: image.file.type,
        fileSize: image.file.size,
        uuid: image.uuid,
        isMain: index === 0,
      }));

      const productPayload = {
        ...productData,
        playerNumber: Number(productData.playerNumber) || 0,
        quantity: Number(productData.quantity) || 0,
        playTime: Number(productData.playTime) || 0,
        price: Number(productData.price),
        productTypeId: 1,
        width: 30.5,
        length: 30.5,
        height: 7,
        weight: 1.2,
        categories: [currentSelectedCategory],
        genres: [currentSelectedGenre],
        fileUploadRequests: imagesMeta,
        imagesBase64,
      };

      const result = await createProduct(productPayload);

      if (result.success) {
        toast.success('Товар додано успішно!');
        resetForm();
        // Refresh products list
      } else {
        toast.error(result.errors?.join(', ') || 'Помилка створення товару. Спробуйте ще раз.');
        console.error('Failed to create product:', result);
      }
    } catch (error: any) {
      toast.error(error.message || 'Непередбачена помилка. Спробуйте ще раз.');
      console.error('An error occurred while creating the product:', error);
    }
  };

  const handleEditProduct = async (product: TProduct) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      type: product.type,
      playerNumber: product.playerNumber.toString(),
      quantity: product.quantity.toString(),
      playTime: product.playTime.toString(),
      description: product.description,
      price: product.price.toString(),
      rulesLink: product.rulesLink || '',
    });
    setSelectedCategory(product.categories[0]);
    setSelectedGenre(product.genres[0]);
    setIsCreating(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар?')) {
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          toast.success('Товар успішно видалено!');
          // Refresh products list
        } else {
          toast.error('Помилка видалення товару. Спробуйте ще раз.');
        }
      } catch (error) {
        toast.error('Непередбачена помилка при видаленні товару.');
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setProductData({
      name: '',
      type: '',
      playerNumber: '',
      quantity: '',
      playTime: '',
      description: '',
      price: '',
      rulesLink: '',
    });
    setImages([]);
    setSelectedCategory(oldCategories.length > 0 ? oldCategories[0].name : '');
    setSelectedGenre(oldGenres.length > 0 ? oldGenres[0].name : '');
    setEditingProduct(null);
    setIsCreating(false);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const onProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Text.Header className="text-2xl text-gray-800">
          {isCreating ? (editingProduct ? 'Редагувати товар' : 'Додати новий товар') : 'Управління товарами'}
        </Text.Header>
        {!isCreating && (
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            Додати товар
          </Button>
        )}
      </div>

      {isCreating ? (
        <form action={handleCreateProduct} className="space-y-6">
          <ImageUploader images={images} setImages={setImages} maxImages={4} setPreviewImage={setPreviewImage} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formInputs.slice(0, 2).map(({ name, placeholder }) => (
              <Input
                key={name}
                name={name}
                value={productData[name as keyof typeof productData]}
                onChange={onProductChange}
                placeholder={placeholder}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            ))}
          </div>

          <textarea
            name="description"
            value={productData.description}
            onChange={onProductChange}
            placeholder="Опис товару"
            rows={4}
            className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formInputs.slice(2, 5).map(({ name, placeholder }) => (
              <Input
                key={name}
                name={name}
                type="text"
                value={productData[name as keyof typeof productData]}
                onChange={onProductChange}
                placeholder={placeholder}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            ))}
            <Input
              name="price"
              type="number"
              value={productData.price}
              onChange={onProductChange}
              placeholder="Ціна (грн)"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <Input
              name="rulesLink"
              value={productData.rulesLink}
              onChange={onProductChange}
              placeholder="Посилання на правила"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary md:col-span-2 lg:col-span-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategorySelector
              label="Категорія"
              list={[...oldCategories, ...newCategories]}
              newItem={newCategory}
              setNewItem={setNewCategory}
              setList={setNewCategories}
              placeholder="Або додати нову категорію..."
              selectedItem={selectedCategory}
              setSelectedItem={setSelectedCategory}
            />
            <CategorySelector
              label="Жанр"
              list={[...oldGenres, ...newGenres]}
              newItem={newGenre}
              setNewItem={setNewGenre}
              setList={setNewGenres}
              placeholder="Або додати новий жанр..."
              selectedItem={selectedGenre}
              setSelectedItem={setSelectedGenre}
            />
          </div>

          <div className="flex gap-4">
            <Button className="w-full md:w-auto py-3 px-6" variant="primary" type="submit">
              {editingProduct ? 'Зберегти зміни' : 'Створити товар'}
            </Button>
            <Button
              className="w-full md:w-auto py-3 px-6"
              variant="secondary"
              onClick={resetForm}
            >
              Скасувати
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-1 aspect-h-1 mb-4">
                  <img
                    src={product.images?.[0]?.url || product.mainImgLink || ''}
                    alt={product.name}
                    className="object-cover rounded-lg w-full h-48"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{product.price} грн</span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEditProduct(product)}
                    >
                      Редагувати
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDeleteProduct(product.id.toString())}
                    >
                      Видалити
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(products.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          )}
        </div>
      )}

      {previewImage && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={closePreview}>
          <div className="relative p-4" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="preview" className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain" />
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-lg shadow-lg hover:bg-gray-200"
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}; 