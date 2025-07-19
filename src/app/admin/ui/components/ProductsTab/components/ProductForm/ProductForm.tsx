'use client';

import { Button, Input } from '@/app/ui/components';
import { TProduct } from '@/utils/types';
import { Text } from '@/utils/ui/Text';

type TProps = {
  editingProduct: TProduct | null;
  productData: any;
  productTypes: any[];
  categories: any[];
  genres: any[];
  fileUploads: any[];
  imagePreviews: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleMultiSelectChange: (name: string, values: string[]) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowCreateForm: (show: boolean) => void;
  setFileUploads: React.Dispatch<React.SetStateAction<{ file: File; uuid: string; isMain: boolean; }[]>>;
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ProductForm = ({
  editingProduct,
  productData,
  productTypes,
  categories,
  genres,
  fileUploads,
  imagePreviews,
  handleInputChange,
  handleMultiSelectChange,
  handleFileChange,
  handleSubmit,
  setShowCreateForm,
  setFileUploads,
  setImagePreviews,
}: TProps) => {
  return (
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
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Назва товару</label>
            <Input name="name" type="text" value={productData.name} onChange={handleInputChange} placeholder="Назва товару" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тип продукту</label>
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
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ціна</label>
            <Input name="price" type="number" value={productData.price} onChange={handleInputChange} placeholder="Ціна" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Кількість товару</label>
            <Input name="quantity" type="number" value={productData.quantity} onChange={handleInputChange} placeholder="Кількість товару" required />
          </div>
        </div>

        {/* Description */}
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

        {/* Game Details */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ігрові деталі</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Мінімальна кількість гравців</label>
              <Input name="minPlayerNumber" type="number" value={productData.minPlayerNumber} onChange={handleInputChange} placeholder="Мін. гравців" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Максимальна кількість гравців</label>
              <Input name="maxPlayerNumber" type="number" value={productData.maxPlayerNumber} onChange={handleInputChange} placeholder="Макс. гравців" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Мінімальний час гри (хв)</label>
              <Input name="minPlayTime" type="number" value={productData.minPlayTime} onChange={handleInputChange} placeholder="Мін. час гри" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Максимальний час гри (хв)</label>
              <Input name="maxPlayTime" type="number" value={productData.maxPlayTime} onChange={handleInputChange} placeholder="Макс. час гри" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Мінімальний вік</label>
              <Input name="minAge" type="number" value={productData.minAge} onChange={handleInputChange} placeholder="Мін. вік" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Складність</label>
              <Input name="complexity" type="number" value={productData.complexity} onChange={handleInputChange} placeholder="Складність (0-5)" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BGG рейтинг</label>
              <Input name="bggRating" type="number" value={productData.bggRating} onChange={handleInputChange} placeholder="BGG рейтинг" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Компоненти</label>
              <Input name="components" type="text" value={productData.components} onChange={handleInputChange} placeholder="Компоненти" required />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Класифікація</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Мова</label>
              <Input name="language" type="text" value={productData.language} onChange={handleInputChange} placeholder="Мова" required />
            </div>
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Категорії</label>
              <select
                onChange={e => {
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
              {productData.categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {productData.categories.map((category: string, index: number) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      {category}
                      <button type="button" onClick={() => handleMultiSelectChange('categories', productData.categories.filter((_: any, i: number) => i !== index))} className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Жанри</label>
              <select
                onChange={e => {
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
              {productData.genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {productData.genres.map((genre: string, index: number) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                      {genre}
                      <button type="button" onClick={() => handleMultiSelectChange('genres', productData.genres.filter((_: any, i: number) => i !== index))} className="ml-1 text-green-600 hover:text-green-800 focus:outline-none">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* Mechanics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Механіки</label>
              <Input
                name="mechanics"
                type="text"
                value={productData.mechanics.join(', ')}
                onChange={e => handleMultiSelectChange('mechanics', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                placeholder="Введіть механіки через кому"
              />
            </div>
          </div>
        </div>

        {/* Publication Details */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Видавництво</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Автор</label>
              <Input name="author" type="text" value={productData.author} onChange={handleInputChange} placeholder="Автор" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Видавець</label>
              <Input name="publisher" type="text" value={productData.publisher} onChange={handleInputChange} placeholder="Видавець" required />
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Розміри та вага</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ширина (мм)</label>
              <Input name="width" type="number" value={productData.width} onChange={handleInputChange} placeholder="Ширина" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Довжина (мм)</label>
              <Input name="length" type="number" value={productData.length} onChange={handleInputChange} placeholder="Довжина" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Висота (мм)</label>
              <Input name="height" type="number" value={productData.height} onChange={handleInputChange} placeholder="Висота" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Вага (г)</label>
              <Input name="weight" type="number" value={productData.weight} onChange={handleInputChange} placeholder="Вага" />
            </div>
          </div>
        </div>

        {/* Rules Link */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Посилання</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Посилання на правила</label>
            <Input name="rulesLink" type="text" value={productData.rulesLink} onChange={handleInputChange} placeholder="Посилання на правила (URL)" />
          </div>
        </div>
        
        {/* Photo Upload */}
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
                                }}
                                className="text-red-500 hover:text-red-700 text-sm font-bold focus:outline-none"
                              >
                                ×
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>Розмір: {(file.file.size / 1024).toFixed(1)} KB</div>
                              <div>Тип: {file.file.type}</div>
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

        {/* Form Actions */}
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
  );
};