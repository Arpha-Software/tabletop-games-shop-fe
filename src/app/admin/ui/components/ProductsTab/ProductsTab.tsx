'use client';

import { useState, useEffect } from 'react';
import { Button, Loader } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllProducts, createProduct, deleteProduct } from '@/app/actions/products';
import { TProduct } from '@/utils/types';
import toast from 'react-hot-toast';
import { getAllCategories } from '@/app/actions/categories';
import { getAllGenres } from '@/app/actions/genres';
import { getAllProductTypes } from '@/app/actions/productTypes';
import { ProductForm } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';

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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [categories, setCategories] = useState<{id:number, name:string}[]>([]);
  const [genres, setGenres] = useState<{id:number, name:string}[]>([]);
  const [fileUploads, setFileUploads] = useState<{file: File, uuid: string, isMain: boolean}[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<{id:number, name:string, dimension:{width:number, height:number, length:number, weight:number}}[]>([]);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [productData, setProductData] = useState(initialProductData);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchGenres();
    fetchProductTypes();
    setTriggerRefetch(false);
  }, [currentPage, triggerRefetch]);

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
    setProductData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setProductData((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploads = Array.from(files).map((file, idx) => ({
      file,
      uuid: `${file.name}-${Date.now()}-${idx}`,
      isMain: fileUploads.length === 0 && idx === 0,
    }));

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

    setFileUploads(prev => [...prev, ...uploads]);
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
        fileUploadRequests: fileUploads.map((fileUpload) => ({
          type: fileUpload.file.type,
          fileSize: fileUpload.file.size,
          uuid: fileUpload.uuid,
          isMain: fileUpload.isMain,
        })),
      };

      const response = await createProduct(payload);

      if (!response.success) {
        toast.error(response.errors?.[0] || 'Помилка створення товару');
        return;
      }

      if (fileUploads.length > 0 && response.data?.fileResponses) {
        toast.loading('Завантаження зображень...');
        try {
          const uploadPromises = fileUploads.map(async (fileUpload, index) => {
            const fileResponse = response.data.fileResponses[index];
            if (!fileResponse || !fileResponse.fileAccessLink) {
              throw new Error(`No upload link for file ${fileUpload.file.name}`);
            }
            const uploadResponse = await fetch(fileResponse.fileAccessLink.link, {
              method: 'PUT',
              headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': fileUpload.file.type },
              body: fileUpload.file,
            });
            if (!uploadResponse.ok) {
              throw new Error(`Failed to upload ${fileUpload.file.name}: ${uploadResponse.status} ${uploadResponse.statusText}`);
            }
            return { fileName: fileUpload.file.name, success: true };
          });
          await Promise.all(uploadPromises);
          toast.dismiss();
          toast.success('Товар створено та зображення завантажено успішно!');
        } catch (uploadError) {
          toast.dismiss();
          toast.error(`Помилка завантаження зображень: ${uploadError}`);
          toast.success('Товар створено, але виникла помилка при завантаженні зображень');
        }
      } else {
        toast.success('Товар створено успішно!');
      }

      setShowCreateForm(false);
      setProductData(initialProductData);
      setFileUploads([]);
      setImagePreviews([]);
      setTriggerRefetch(true);
    } catch (error) {
      toast.error('Помилка створення товару');
    }
  };

  const handleEdit = (product: TProduct) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      productTypeId: '',
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity?.toString() || '0',
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

  const handleDelete = async (productId: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
      const response = await deleteProduct(productId);
      if (response.success) {
        toast.success('Продукт успішно видалено');
        setTriggerRefetch(true);
      } else {
        toast.error(response.errors?.[0] || 'Помилка при видаленні продукту');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Text.Header>Управління товарами</Text.Header>
        <Button
          variant="primary"
          onClick={() => {
            setShowCreateForm(true);
            setEditingProduct(null);
            setProductData(initialProductData);
            setFileUploads([]);
            setImagePreviews([]);
          }}
        >
          Додати товар
        </Button>
      </div>

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

      <ProductTable
        products={products}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
