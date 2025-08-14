'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';

import { getAllProducts, createProduct, deleteProduct } from '@/app/actions/products';
import { getAllCategories } from '@/app/actions/categories';
import { getAllGenres } from '@/app/actions/genres';
import { getAllProductTypes } from '@/app/actions/productTypes';

import { TProduct } from '@/utils/types';
import { ProductForm } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';
import { unwrapList } from '@/utils/helpers';
import { RubikLoadable } from '../../../../ui/components/Loader';

const initialProductData = {
  name: '',
  productTypeId: '',
  description: '',
  price: '',
  quantity: '',
  minPlayerNumber: '',
  maxPlayerNumber: '',
  minPlayTime: '',
  maxPlayTime: '',
  minAge: '',
  language: '',
  publisher: '',
  author: '',
  bggRating: '',
  complexity: '',
  components: '',
  mechanics: [] as string[],
  rulesLink: '',
  width: '',
  length: '',
  height: '',
  weight: '',
  categories: [] as string[],
  genres: [] as string[],
};

export const ProductsTab = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // paging & search
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  // taxonomies
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [productTypes, setProductTypes] = useState<
    { id: number; name: string; dimension?: { width: number; height: number; length: number; weight: number } }[]
  >([]);

  // form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [productData, setProductData] = useState(initialProductData);
  const [fileUploads, setFileUploads] = useState<{ file: File; uuid: string; isMain: boolean }[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // ------- Fetchers -------
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const resp = await getAllProducts({
          page: currentPage,
          size: pageSize,
          sort: 'id,desc',
          name: search ? undefined : undefined, // body filters if you add later
          // (if your API supports in-body search, map it here)
        });

        if (resp.success) {
          setProducts(resp.data.content || []);
          setTotalPages(resp.data.totalPages || 0);
        } else {
          toast.error(resp.errors?.[0] || 'Помилка завантаження товарів');
          setProducts([]);
          setTotalPages(0);
        }
      } catch {
        toast.error('Помилка завантаження товарів');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [currentPage, pageSize, search]);

  useEffect(() => {
    const fetchTaxonomies = async () => {
      const [cats, gens, types] = await Promise.all([
        getAllCategories(),
        getAllGenres(),
        getAllProductTypes(),
      ]);

      if (cats.success) setCategories(unwrapList<{ id: number; name: string }>(cats.data));
      if (gens.success) setGenres(unwrapList<{ id: number; name: string }>(gens.data));
      if (types.success) setProductTypes(unwrapList<{ id: number; name: string }>(types.data));
    };
    fetchTaxonomies();
  }, []);

  // ------- Handlers -------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setProductData((prev) => ({ ...prev, [name]: values }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploads = Array.from(files).map((file, idx) => ({
      file,
      uuid: `${file.name}-${Date.now()}-${idx}`,
      isMain: fileUploads.length === 0 && idx === 0,
    }));

    const previews = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(previews).then((urls) => setImagePreviews((p) => [...p, ...urls]));
    setFileUploads((p) => [...p, ...uploads]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productData,
        productTypeId: Number(productData.productTypeId),
        price: Number(productData.price),
        quantity: Number(productData.quantity),
        minPlayerNumber: Number(productData.minPlayerNumber),
        maxPlayerNumber: Number(productData.maxPlayerNumber),
        minPlayTime: Number(productData.minPlayTime),
        maxPlayTime: Number(productData.maxPlayTime),
        minAge: Number(productData.minAge),
        bggRating: Number(productData.bggRating),
        complexity: Number(productData.complexity),
        width: Number(productData.width) || 0,
        length: Number(productData.length) || 0,
        height: Number(productData.height) || 0,
        weight: Number(productData.weight) || 0,
        fileUploadRequests: fileUploads.map((f) => ({
          type: f.file.type,
          fileSize: f.file.size,
          uuid: f.uuid,
          isMain: f.isMain,
        })),
      };

      const resp = await createProduct(payload);
      if (!resp.success) {
        toast.error(resp.errors?.[0] || 'Помилка створення товару');
        return;
      }

      if (fileUploads.length && resp.data?.fileResponses?.length) {
        toast.loading('Завантаження зображень...');
        try {
          await Promise.all(
            fileUploads.map(async (f, i) => {
              const fr = resp.data!.fileResponses![i];
              if (!fr?.fileAccessLink?.link) throw new Error('Missing upload link');
              const r = await fetch(fr.fileAccessLink.link, {
                method: 'PUT',
                headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': f.file.type },
                body: f.file,
              });
              if (!r.ok) throw new Error(`${f.file.name}: ${r.status}`);
            })
          );
          toast.success('Товар створено та фото завантажено!');
        } catch (e: any) {
          toast.error(`Фото: ${String(e)}`);
          toast.success('Товар створено (без деяких фото).');
        } finally {
          toast.dismiss();
        }
      } else {
        toast.success('Товар створено!');
      }

      setShowCreateForm(false);
      setProductData(initialProductData);
      setFileUploads([]);
      setImagePreviews([]);

      // refresh list
      setCurrentPage(0);
    } catch {
      toast.error('Помилка створення товару');
    }
  };

  const handleEdit = (product: TProduct) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      productTypeId: '',
      description: product.description,
      price: product.price?.toString?.() ?? '',
      quantity: product.quantity?.toString?.() ?? '0',
      minPlayerNumber: '',
      maxPlayerNumber: '',
      minPlayTime: '',
      maxPlayTime: '',
      minAge: '',
      language: product.classification?.language || '',
      publisher: product.publicationDetails?.publisher || '',
      author: product.publicationDetails?.author || '',
      bggRating: product.gameDetails?.bggRating?.toString() || '0',
      complexity: product.gameDetails?.complexity?.toString() || '0',
      components: product.gameDetails?.components || '',
      mechanics: product.classification?.mechanics || [],
      rulesLink: '',
      width: '',
      length: '',
      height: '',
      weight: '',
      categories: product.classification?.categories || [],
      genres: product.classification?.genres || [],
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити товар?')) return;
    const r = await deleteProduct(id);
    r.success ? toast.success('Видалено') : toast.error(r.errors?.[0] || 'Помилка видалення');
    setCurrentPage((p) => p); // trigger refetch via effect
  };

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Text.Header>Управління товарами</Text.Header>
            <Text.Span className="text-gray-500">Створення, редагування та видалення товарів</Text.Span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <select
                value={pageSize}
                onChange={(e) => { setCurrentPage(0); setPageSize(Number(e.target.value)); }}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm"
              >
                {[12, 24, 48].map((n) => (
                  <option key={n} value={n}>{n} / стор.</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Input
                placeholder="Пошук за назвою…"
                value={search}
                onChange={(e) => { setCurrentPage(0); setSearch(e.target.value); }}
                className="pr-10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-50">⌘K</span>
            </div>

            <Button onClick={() => {
              setEditingProduct(null);
              setProductData(initialProductData);
              setFileUploads([]);
              setImagePreviews([]);
              setShowCreateForm(true);
            }}>
              Додати товар
            </Button>
          </div>
        </div>

        {/* Create / Edit form */}
        {showCreateForm && (
          <ProductForm
            editingProduct={editingProduct}
            productData={productData}
            productTypes={productTypes}
            categories={categories}
            genres={genres}
            fileUploads={fileUploads}
            imagePreviews={imagePreviews}
            handleInputChange={handleInputChange}
            handleMultiSelectChange={handleMultiSelectChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            setShowCreateForm={setShowCreateForm}
            setFileUploads={setFileUploads}
            setImagePreviews={setImagePreviews}
          />
        )}

        {/* Table */}
        <ProductTable
          products={products}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </RubikLoadable>
  );
};
