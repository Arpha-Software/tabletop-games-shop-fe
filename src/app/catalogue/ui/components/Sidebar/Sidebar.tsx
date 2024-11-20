'use client';

import { createCategory, getAllCategories } from '@/app/actions/categories';
import { createGenre, getAllGenres } from '@/app/actions/genres';
import { createProduct } from '@/app/actions/products';
import { Button, Input } from '@/app/ui/components';
import { useEffect, useState } from 'react';
import { createPortal, useFormState } from 'react-dom';

type TProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type TCategory = {
  id: number;
  name: string;
}

type TGenre = {
  id: number;
  name: string;
}

const initialState = {
  success: false,
  errors: [],
};

export const Sidebar = ({ isOpen, setOpen }: TProps) => {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [oldGenres, setOldGenres] = useState<TGenre[]>([]);
  const [oldCategories, setOldCategories] = useState<TCategory[]>([]);
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
    playerNumber: 0,
    quantity: 0,
    playTime: 0,
    description: '',
    price: 0,
    rulesLink: '',
  });

  const [state, formCreateAction] = useFormState(() => createProduct({...productData, selectedCategory, selectedGenre }), initialState)

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getAllCategories();
      console.log('CATEGORIES', categories);
      if (categories.success) {
        setOldCategories(categories.data.content);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      const genres = await getAllGenres();
      console.log('GENRES', genres);
      if (genres.success) {
        setOldGenres(genres.data.content);
      }
    };

    fetchGenres();
  }, []);

  if (!isOpen) return null;

  const handleAddItem = (item: string, setItem: React.Dispatch<React.SetStateAction<string>>, setList: React.Dispatch<React.SetStateAction<any[]>>) => {
    if (item.trim()) {
      setList((prevList) => [...prevList, { id: prevList.length + 1, name: item }]);
      setItem('');
    }
  };

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
    const newCategoriesNames = newCategories.map((category) => category.name);
    const newGenresNames = newGenres.map((genre) => genre.name);
    const oldCategoriesNames = oldCategories.map((category) => category.name);
    const oldGenresNames = oldGenres.map((genre) => genre.name);

    let responseCategory;
    let responseGenre;
    console.log('newCategory', newCategories);
    console.log('newGenre', newGenres);
    if (newCategoriesNames.includes(selectedCategory)) {
      responseCategory = await createCategory({ name: selectedCategory });
    }

    if (newGenresNames.includes(selectedGenre)) {
      responseGenre = await createGenre({ name: selectedGenre });
    }

    if (oldCategoriesNames.includes(selectedCategory)) {
      responseCategory = { success: true };
    }

    if (oldGenresNames.includes(selectedGenre)) {
      responseGenre = { success: true };
    }
    console.log('RESPONSES', responseCategory, responseGenre);
    if (!responseCategory?.success || !responseGenre?.success) return;

    formCreateAction();
    console.log('STATE', state);
    if (state.success) setOpen(false);
  }

  return (
    <div
      className={`fixed top-0 overflow-auto right-0 h-full w-[500px] z-10 bg-gray-800 transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <form action={handleCreateProduct} className="p-5">
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
          {[
            { name: 'name', placeholder: 'Назва товару' },
            { name: 'type', placeholder: 'Тип' },
            { name: 'playerNumber', placeholder: 'Кількість гравців' },
            { name: 'quantity', placeholder: 'Кількість товару' },
            { name: 'playTime', placeholder: 'Час гри' },
            { name: 'description', placeholder: 'Опис' },
            { name: 'price', placeholder: 'Ціна' },
            { name: 'rulesLink', placeholder: 'Посилання на правила' },
          ].map(({ name, placeholder }, index) => (
            <Input
              key={index}
              name={name}
              value={productData[name as keyof typeof productData]}
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
            handleAddItem={handleAddItem}
            setSelectedItem={setSelectedCategory}
          />
          <CategorySelector
            label="Виберіть жанр"
            list={[...oldGenres, ...newGenres]}
            newItem={newGenre}
            setNewItem={setNewGenre}
            setList={setNewGenres}
            placeholder="Додати новий жанр"
            handleAddItem={handleAddItem}
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

export const CategorySelector = ({ label, list, newItem, setNewItem, setList, placeholder, handleAddItem, setSelectedItem }: any) => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(e.target.value);
  }

  return (
    <div>
      <label className="text-white mb-2 block">{label}</label>
      {list.length > 0 && (
        <select className="w-full p-2 rounded bg-gray-700 text-white mb-2" onChange={onChange}>
          {list.map((item: TCategory, idx: number) => (
            <option key={idx} value={item.name}>{item.name}</option>
          ))}
        </select>
      )}
      <div className="flex flex-col space-y-2">
        <Input
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={() => handleAddItem(newItem, setNewItem, setList)} variant="secondary" className='w-full text-white'>
          Додати
        </Button>
      </div>
    </div>
  );
};

export const ImageUploader = ({ images, setImages, maxImages, setPreviewImage }: any) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, maxImages - images.length);
      setImages((prevImages: File[]) => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages: any) => prevImages.filter((_: any, i: any) => i !== index));
  };

  const handlePreviewImage = (image: File) => {
    const imageUrl = URL.createObjectURL(image);
    setPreviewImage(imageUrl);
  };

  return (
    <div className="mt-4">
      <label className="text-white mb-2 block">Додати зображення (до {maxImages})</label>
      <div className="relative w-full h-32 border-2 border-dashed border-gray-500 rounded-lg flex justify-center items-center cursor-pointer hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="text-center text-gray-400">
          <p className="text-sm">Перетягніть або натисніть, щоб завантажити зображення</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {images.map((image: File, index: number) => (
          <div key={index} className="relative group w-20 h-20">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-full h-full object-cover rounded-lg border border-gray-500 cursor-pointer"
              onClick={() => handlePreviewImage(image)}
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
