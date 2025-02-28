'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { createPortal, useFormState } from 'react-dom';

import { createCategory, getAllCategories } from '@/app/actions/categories';
import { createGenre, getAllGenres } from '@/app/actions/genres';
import { createProduct } from '@/app/actions/products';

import { Button, Input } from '@/app/ui/components';

import {
  TCategory,
  TGenre,
  TProduct,
} from '@/utils/types';
import { useFetchCategories } from '@/hooks/product/useFetchCategories';
import { useFetchGenres } from '@/hooks/product/useFetchGenres';
import { ImageUploader } from '../../components/ImageUploader';
import { CategorySelector } from '../../components/CategorySelector';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

type TProps = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const Sidebar = ({ isOpen, setOpen }: TProps) => {
  const oldCategories = useFetchCategories();
  const oldGenres = useFetchGenres();

  const [newCategories, setNewCategories] = useState<TCategory[]>([]);
  const [newGenres, setNewGenres] = useState<TGenre[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [newGenre, setNewGenre] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
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
    { name: 'playerNumber', placeholder: 'Кількість гравців' },
    { name: 'quantity', placeholder: 'Кількість товару' },
    { name: 'playTime', placeholder: 'Час гри' },
    { name: 'description', placeholder: 'Опис' },
    { name: 'price', placeholder: 'Ціна' },
    { name: 'rulesLink', placeholder: 'Посилання на правила' },
  ];

  if (!isOpen) return null;

  const closePreview = () => {
    setPreviewImage(null);
  };

  const closeSidebar = () => {
    setOpen(false);
  };

  const onProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateProduct = async () => {
    try {
      const [newCategoriesNames, newGenresNames, oldCategoriesNames, oldGenresNames] = [
        newCategories.map((category) => category.name),
        newGenres.map((genre) => genre.name),
        oldCategories.map((category) => category.name),
        oldGenres.map((genre) => genre.name),
      ];

      const createIfNew = async (name: string, isNew: boolean, createAction: any) => {
        if (isNew) {
          const response = await createAction({ name });

          if (!response.success) {
            toast.error('Помилка, спробуйте ще раз!');
            console.error(`Failed to create ${name}:`, name);
            return false;
          }
        }

        return true;
      };

      const isCategoryNew = newCategoriesNames.includes(selectedCategory) && !oldCategoriesNames.includes(selectedCategory);
      const isGenreNew = newGenresNames.includes(selectedGenre) && !oldGenresNames.includes(selectedGenre);

      const categoryCreated = await createIfNew(selectedCategory, isCategoryNew, createCategory);
      const genreCreated = await createIfNew(selectedGenre, isGenreNew, createGenre);

      if (!categoryCreated || !genreCreated) return;


      const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      };

      const imagesBase64 = await Promise.all(
        images.map(async (image) => {
          const buffer = await image.arrayBuffer();
          return arrayBufferToBase64(buffer);
        })
      );

      const product = {
        ...productData,
        playerNumber: Number(productData.playerNumber),
        quantity: Number(productData.quantity),
        playTime: Number(productData.playTime),
        price: Number(productData.price),
        categories: [selectedCategory],
        genres: [selectedGenre],
        imagesBase64,
      };
      console.log('images', imagesBase64)
      const result = await createProduct(product);

      if (result.success) {
        toast.success('Товар додано успішно!');
        setOpen(false);
      } else {
        toast.error(result.errors[0] || 'Помилка, спробуйте ще раз!');
        console.error('Failed to create product:', result);
      }
    } catch (error) {
      toast.error(String(error) || 'Помилка, спробуйте ще раз!');
      console.error('An error occurred while creating the product:', error);
    }
  };

  return (
    <div className={cn('fixed top-0 overflow-auto right-0 h-full w-[500px] z-10 bg-gray-800 transition-transform transform', isOpen ? 'translate-x-0' : 'translate-x-full')}>
      <form action={() => handleCreateProduct()} className="p-5">
        <div className='flex items-center justify-between mb-10'>
          <h2 className="text-2xl text-white">Додати товар</h2>
          <button
            onClick={closeSidebar}
            className="w-10 text-white text-lg"
          >
            ✕
          </button>
        </div>

        <ImageUploader images={images} setImages={setImages} maxImages={4} setPreviewImage={setPreviewImage} />

        <div className="space-y-2 mt-10">
          {formInputs.map(({ name, placeholder }, index) => (
            <Input
              key={index}
              name={name}
              value={productData ? productData[name as keyof typeof productData] : ''}
              onChange={onProductChange}
              placeholder={placeholder}
              className='w-full p-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            />
          ))}
        </div>

        <div className="mt-4 space-y-4">
          <CategorySelector
            label="Виберіть категорію"
            list={[...oldCategories, ...newCategories]}
            newItem={newCategory}
            setNewItem={setNewCategory}
            setList={setNewCategories}
            placeholder="Додати нову категорію"
            setSelectedItem={setSelectedCategory}
          />
          <CategorySelector
            label="Виберіть жанр"
            list={[...oldGenres, ...newGenres]}
            newItem={newGenre}
            setNewItem={setNewGenre}
            setList={setNewGenres}
            placeholder="Додати новий жанр"
            setSelectedItem={setSelectedGenre}
          />
        </div>

        <Button className="mt-4 w-full" variant="primary" type='submit'>Створити товар</Button>
      </form>

      {previewImage && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
          <div className="relative">
            <img src={previewImage} alt="preview" className="max-w-full max-h-full rounded-lg" />
          </div>

          <button
            onClick={closePreview}
            className="absolute top-2 right-2 w-11 bg-white text-black shadow-lg text-lg p-2 rounded-full"
          >
            ✕
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};


