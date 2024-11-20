import { Button, Input } from '@/app/ui/components';
import { useState } from 'react';
import { createPortal } from 'react-dom';

type TProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Sidebar = ({ isOpen, setOpen }: TProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [newGenre, setNewGenre] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = (item: string, setItem: React.Dispatch<React.SetStateAction<string>>, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (item.trim()) {
      setList((prevList) => [...prevList, item]);
      setItem('');
    }
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const closeSidebar = () => {
    setOpen(false);
  }

  return (
    <div
      className={`fixed top-0 overflow-auto right-0 h-full w-[500px] z-10 bg-gray-800 transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <form className="p-5">
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
          {['Назва товару', 'Тип', 'Кількість гравців', 'Кількість товару', 'Час гри', 'Опис', 'Ціна', 'Посилання на правила'].map((placeholder, index) => (
            <Input key={index} placeholder={placeholder} className='w-full p-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500'/>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          <CategorySelector
            label="Виберіть категорію"
            list={categories}
            newItem={newCategory}
            setNewItem={setNewCategory}
            setList={setCategories}
            placeholder="Додати нову категорію"
            handleAddItem={handleAddItem}
          />
          <CategorySelector
            label="Виберіть жанр"
            list={genres}
            newItem={newGenre}
            setNewItem={setNewGenre}
            setList={setGenres}
            placeholder="Додати новий жанр"
            handleAddItem={handleAddItem}
          />
        </div>

        <Button className="mt-4 w-full" variant="primary">Створити товар</Button>
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

export const CategorySelector = ({ label, list, newItem, setNewItem, setList, placeholder, handleAddItem }: any) => (
  <div>
    <label className="text-white mb-2 block">{label}</label>
    {list.length > 0 && (
      <select className="w-full p-2 rounded bg-gray-700 text-white mb-2">
        {list.map((item: string, idx: number) => (
          <option key={idx} value={item}>{item}</option>
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
