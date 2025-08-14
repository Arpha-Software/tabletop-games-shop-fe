'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input } from '@/app/ui/components';
import { TProduct } from '@/utils/types';
import { Text } from '@/utils/ui/Text';
import { cn } from '@/utils/helpers';

type TProps = {
  editingProduct: TProduct | null;
  productData: any;
  productTypes: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  genres: { id: number; name: string }[];
  fileUploads: { file: File; uuid: string; isMain: boolean }[];
  imagePreviews: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleMultiSelectChange: (name: string, values: string[]) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowCreateForm: (show: boolean) => void;
  setFileUploads: React.Dispatch<React.SetStateAction<{ file: File; uuid: string; isMain: boolean }[]>>;
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
};

/* -------------------------------------------
   Shared UI
------------------------------------------- */
const Field = ({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {label}
      {required ? <span className="text-primary ml-1">*</span> : null}
    </label>
    {children}
    {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
  </div>
);

const SectionCard = ({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={cn('bg-white rounded-2xl shadow-card border border-secondary-100 p-6', className)}>
    <div className="mb-5">
      <Text.Header className="text-lg">{title}</Text.Header>
      {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
    {children}
  </section>
);

const UnitInput = ({
  name,
  value,
  placeholder,
  unit,
  type = 'number',
  min,
  step,
  onChange,
}: {
  name: string;
  value: any;
  placeholder?: string;
  unit: string;
  type?: 'text' | 'number';
  min?: number;
  step?: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative">
    <Input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="pr-12"
      min={min}
      step={step}
    />
    <span className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500">{unit}</span>
  </div>
);

/* -------------------------------------------
   Combobox (single & multiple)
------------------------------------------- */
type ComboOption = { id: number | string; name: string };

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={cn('w-4 h-4 transition-transform', open ? 'rotate-180' : 'rotate-0')}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder = 'Обрати…',
  multiple = false,
  tone, // не використовується тепер у полі (залишив для зворотної сумісності)
  clearLabel = 'Очистити',
}: {
  label: string;
  options: ComboOption[];
  value: number | string | null | undefined | string[];
  onChange: (next: any) => void; // single: id; multiple: string[] of names
  placeholder?: string;
  multiple?: boolean;
  tone?: 'primary' | 'green' | 'blue';
  clearLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [focusIdx, setFocusIdx] = useState(0);

  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQ('');
    }
  }, [open]);

  useEffect(() => {
    setFocusIdx(0);
  }, [q, open]);

  // Single-mode
  const selectedSingle = useMemo(
    () => (!multiple ? options.find((o) => String(o.id) === String(value ?? '')) : null),
    [multiple, options, value]
  );

  // Multiple-mode
  const selectedMulti = (multiple ? (value as string[]) : []) ?? [];
  const selectedMultiText = selectedMulti.join(', ');

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const base = multiple
      ? options.filter((o) => !selectedMulti.includes(o.name))
      : options;
    return qq ? base.filter((o) => o.name.toLowerCase().includes(qq)) : base;
  }, [q, options, multiple, selectedMulti]);

  const chooseSingle = (id: number | string) => {
    onChange(id);
    setOpen(false);
  };

  const toggleMulti = (name: string) => {
    if (!multiple) return;
    if (selectedMulti.includes(name)) {
      onChange(selectedMulti.filter((n) => n !== name));
    } else {
      onChange([...selectedMulti, name]);
    }
  };

  const clearAll = () => onChange([]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIdx((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!filtered.length) return;
      const target = filtered[focusIdx] ?? filtered[0];
      if (multiple) toggleMulti(target.name);
      else chooseSingle(target.id);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {multiple && selectedMulti.length > 0 && (
          <button type="button" className="text-xs text-gray-500 hover:text-red-600" onClick={clearAll}>
            {clearLabel}
          </button>
        )}
      </div>

      <div ref={boxRef} className="relative">
        {/* Display row (єдиний вигляд для single & multiple) */}
        <div
          className={cn(
            'w-full min-h-[44px] px-3 rounded-xl border border-secondary-100 bg-white flex items-center',
            'focus-within:ring-2 focus-within:ring-primary/30'
          )}
          onClick={() => setOpen(true)}
        >
          <span
            className={cn(
              'flex-1 truncate text-sm',
              multiple
                ? selectedMulti.length ? 'text-gray-900' : 'text-gray-500'
                : selectedSingle ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            {multiple
              ? selectedMulti.length ? selectedMultiText : placeholder
              : selectedSingle ? selectedSingle.name : placeholder}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((s) => !s);
            }}
            className="ml-2 px-2 h-7 rounded-md text-gray-600 hover:bg-secondary-100"
            aria-label={open ? 'Згорнути' : 'Розгорнути'}
          >
            <Chevron open={open} />
          </button>
        </div>

        {/* Dropdown */}
        <div
          className={cn(
            'absolute z-10 left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden transition-all',
            open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
          )}
          style={{ maxHeight: open ? 320 : 0 }}
        >
          {/* Уніфікований пошук (і для single, і для multiple) */}
          <div className="p-2 border-b border-gray-100 bg-white">
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full h-9 px-3 rounded-lg border border-secondary-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              placeholder="Пошук…"
              aria-label="Пошук"
            />
          </div>

          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">Нічого не знайдено</li>
            ) : (
              filtered.map((o, idx) => {
                const isSelected = multiple
                  ? selectedMulti.includes(o.name)
                  : String(o.id) === String(value ?? '');
                return (
                  <li
                    key={o.id}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      'px-3 py-2 text-sm cursor-pointer flex items-center justify-between',
                      idx === focusIdx ? 'bg-gray-50' : 'hover:bg-gray-50'
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => (multiple ? toggleMulti(o.name) : chooseSingle(o.id))}
                  >
                    <span className="truncate">{o.name}</span>
                    {isSelected && <span className="text-primary text-xs font-semibold">Обрано</span>}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------
   Custom “main photo” toggle (no native radio)
------------------------------------------- */
const MainPhotoToggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        'inline-flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-full',
        'border transition-colors',
        checked
          ? 'bg-primary/10 text-primary border-primary/30'
          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
      )}
    >
      <span
        aria-hidden
        className={cn(
          'inline-block w-3.5 h-3.5 rounded-full border',
          checked ? 'bg-primary border-primary' : 'bg-white border-gray-300'
        )}
      />
      Головне фото
    </button>
  );
};

/* -------------------------------------------
   Main Component
------------------------------------------- */
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
  // remove file
  const removeUploadAt = useCallback(
    (index: number) => {
      const newUploads = fileUploads.filter((_, i) => i !== index);
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      if (newUploads.length && !newUploads.some((u) => u.isMain)) {
        newUploads[0] = { ...newUploads[0], isMain: true };
      }
      setFileUploads(newUploads);
      setImagePreviews(newPreviews);
    },
    [fileUploads, imagePreviews, setFileUploads, setImagePreviews]
  );

  // mark main (custom, no radio -> avoids scroll jump)
  const markAsMain = useCallback(
    (index: number) => {
      setFileUploads((prev) => prev.map((u, i) => ({ ...u, isMain: i === index })));
    },
    [setFileUploads]
  );

  return (
    <div
      className="rounded-2xl border border-secondary-100 bg-secondary-50/5 p-4 md:p-6"
      style={{ overflowAnchor: 'none' as any }} // prevent scroll anchoring jumps
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-6">
        <div>
          <Text.Header className="text-xl md:text-2xl">
            {editingProduct ? 'Редагувати товар' : 'Створити новий товар'}
          </Text.Header>
          <p className="text-sm text-gray-500">Заповніть основну інформацію, характеристики та додайте фото.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" type="button" onClick={() => setShowCreateForm(false)} className="px-5">
            Скасувати
          </Button>
          <Button type="submit" form="product-form" className="px-6">
            {editingProduct ? 'Оновити' : 'Створити'}
          </Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <SectionCard title="Основне" subtitle="Назва, тип, ціна та кількість">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Назва товару" htmlFor="name" required>
              <Input
                id="name"
                name="name"
                type="text"
                value={productData.name}
                onChange={handleInputChange}
                placeholder="Напр., Кіт у Чоботях"
              />
            </Field>

            {/* Product Type — single combobox */}
            <Combobox
              label="Тип продукту"
              options={productTypes}
              value={productData.productTypeId || null}
              onChange={(id: number | string) =>
                handleInputChange({
                  target: { name: 'productTypeId', value: id, type: 'text' },
                } as any)
              }
              placeholder="Оберіть тип продукту"
            />

            <Field label="Ціна" htmlFor="price" required>
              <UnitInput
                name="price"
                value={productData.price}
                placeholder="0"
                unit="₴"
                step="0.01"
                onChange={handleInputChange as any}
              />
            </Field>

            <Field label="Кількість на складі" htmlFor="quantity" required>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={productData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                min={0}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Опис товару" htmlFor="description" required>
              <textarea
                id="description"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Детальний опис, враження, для кого підходить тощо…"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border border-secondary-100',
                  'bg-white focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'min-h-[120px] resize-vertical'
                )}
                required
              />
            </Field>
          </div>
        </SectionCard>

        {/* GAME DETAILS */}
        <SectionCard title="Ігрові деталі" subtitle="К-сть гравців, час партії, вік, складність, BGG рейтинг, компоненти">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Мін. гравців" htmlFor="minPlayerNumber" required>
              <Input
                id="minPlayerNumber"
                name="minPlayerNumber"
                type="number"
                value={productData.minPlayerNumber}
                onChange={handleInputChange}
                placeholder="1"
                min={1}
              />
            </Field>
            <Field label="Макс. гравців" htmlFor="maxPlayerNumber" required>
              <Input
                id="maxPlayerNumber"
                name="maxPlayerNumber"
                type="number"
                value={productData.maxPlayerNumber}
                onChange={handleInputChange}
                placeholder="4"
                min={1}
              />
            </Field>
            <Field label="Вік" htmlFor="minAge" required>
              <UnitInput
                name="minAge"
                value={productData.minAge}
                placeholder="8"
                unit="+"
                min={0}
                onChange={handleInputChange as any}
              />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Мін. час гри" htmlFor="minPlayTime" required hint="у хвилинах">
              <UnitInput
                name="minPlayTime"
                value={productData.minPlayTime}
                placeholder="30"
                unit="хв"
                min={0}
                onChange={handleInputChange as any}
              />
            </Field>
            <Field label="Макс. час гри" htmlFor="maxPlayTime" required hint="у хвилинах">
              <UnitInput
                name="maxPlayTime"
                value={productData.maxPlayTime}
                placeholder="120"
                unit="хв"
                min={0}
                onChange={handleInputChange as any}
              />
            </Field>
            <Field label="Складність" htmlFor="complexity" required hint="0–5">
              <Input
                id="complexity"
                name="complexity"
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={productData.complexity}
                onChange={handleInputChange}
                placeholder="2.5"
              />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="BGG рейтинг" htmlFor="bggRating" required>
              <Input
                id="bggRating"
                name="bggRating"
                type="number"
                step="0.1"
                min={0}
                max={10}
                value={productData.bggRating}
                onChange={handleInputChange}
                placeholder="7.8"
              />
            </Field>
            <Field label="Компоненти" htmlFor="components" required>
              <Input
                id="components"
                name="components"
                type="text"
                value={productData.components}
                onChange={handleInputChange}
                placeholder="Карти, жетони, мініатюри…"
              />
            </Field>
          </div>
        </SectionCard>

        {/* CLASSIFICATION */}
        <SectionCard title="Класифікація" subtitle="Мова, категорії, жанри, механіки">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Мова" htmlFor="language" required>
              <Input
                id="language"
                name="language"
                type="text"
                value={productData.language}
                onChange={handleInputChange}
                placeholder="UA / EN / ін."
              />
            </Field>

            {/* Categories — multiple combobox */}
            <Combobox
              label="Категорії"
              options={categories}
              value={productData.categories || []}
              onChange={(next: string[]) => handleMultiSelectChange('categories', next)}
              multiple
              tone="blue"
              placeholder="Додати категорію…"
              clearLabel="Очистити"
            />

            {/* Genres — multiple combobox */}
            <Combobox
              label="Жанри"
              options={genres}
              value={productData.genres || []}
              onChange={(next: string[]) => handleMultiSelectChange('genres', next)}
              multiple
              tone="green"
              placeholder="Додати жанр…"
              clearLabel="Очистити"
            />

            <Field label="Механіки" hint="Введіть через кому (напр., Drafting, Deck Building)">
              <Input
                name="mechanics"
                type="text"
                value={productData.mechanics?.join(', ') || ''}
                onChange={(e) =>
                  handleMultiSelectChange(
                    'mechanics',
                    e.target.value
                      .split(',')
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="Drafting, Set Collection…"
              />
            </Field>
          </div>
        </SectionCard>

        {/* PUBLICATION */}
        <SectionCard title="Видавництво">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Автор" htmlFor="author" required>
              <Input
                id="author"
                name="author"
                type="text"
                value={productData.author}
                onChange={handleInputChange}
                placeholder="Ім’я автора"
              />
            </Field>
            <Field label="Видавець" htmlFor="publisher" required>
              <Input
                id="publisher"
                name="publisher"
                type="text"
                value={productData.publisher}
                onChange={handleInputChange}
                placeholder="Назва видавця"
              />
            </Field>
          </div>
        </SectionCard>

        {/* DIMENSIONS */}
        <SectionCard title="Розміри та вага">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="Ширина" htmlFor="width">
              <UnitInput name="width" value={productData.width} unit="мм" min={0} onChange={handleInputChange as any} />
            </Field>
            <Field label="Довжина" htmlFor="length">
              <UnitInput name="length" value={productData.length} unit="мм" min={0} onChange={handleInputChange as any} />
            </Field>
            <Field label="Висота" htmlFor="height">
              <UnitInput name="height" value={productData.height} unit="мм" min={0} onChange={handleInputChange as any} />
            </Field>
            <Field label="Вага" htmlFor="weight">
              <UnitInput name="weight" value={productData.weight} unit="г" min={0} onChange={handleInputChange as any} />
            </Field>
          </div>
        </SectionCard>

        {/* LINKS */}
        <SectionCard title="Посилання">
          <Field label="Правила (URL)" htmlFor="rulesLink" hint="Додайте лінк на правила або огляд">
            <Input
              id="rulesLink"
              name="rulesLink"
              type="text"
              value={productData.rulesLink}
              onChange={handleInputChange}
              placeholder="https://…"
            />
          </Field>
        </SectionCard>

        {/* MEDIA */}
        <SectionCard title="Фото товару" subtitle="Додайте зображення, оберіть головне">
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
                className={cn(
                  'flex flex-col items-center justify-center w-full h-36',
                  'rounded-xl border-2 border-dashed border-secondary-200',
                  'bg-secondary-50 hover:bg-secondary-100 transition-colors cursor-pointer'
                )}
              >
                <svg
                  className="w-8 h-8 mb-2 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Натисніть</span> або перетягніть файли сюди
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF до 10MB</p>
              </label>
            </div>

            {fileUploads.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Завантажені файли</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {fileUploads.map((file, index) => (
                    <div
                      key={file.uuid}
                      className="group relative bg-white border border-secondary-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {imagePreviews[index] && (
                        <div className="aspect-square bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreviews[index]}
                            alt={file.uuid.split('-')[0]}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-gray-700 truncate">{file.file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeUploadAt(index)}
                            className="text-gray-400 hover:text-red-600 text-sm font-bold focus:outline-none"
                            aria-label="Видалити"
                          >
                            ×
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <MainPhotoToggle checked={!!file.isMain} onChange={() => markAsMain(index)} />
                          <span className="text-[11px] text-gray-500">{(file.file.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* STICKY ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
          <Button type="submit" className="px-6">
            {editingProduct ? 'Оновити товар' : 'Створити товар'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)} className="px-5">
            Скасувати
          </Button>
        </div>
      </form>
    </div>
  );
};
