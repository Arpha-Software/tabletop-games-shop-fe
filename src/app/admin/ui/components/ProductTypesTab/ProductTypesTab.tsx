// src/app/admin/ui/components/ProductTypesTab/ProductTypesTab.tsx
'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import toast from 'react-hot-toast';
import { Button, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { getAllProductTypes, createProductType } from '@/app/actions/productTypes';
import { TProductType } from '@/utils/types';
import { RubikLoadable } from '../../../../ui/components/Loader';
import { cn } from '@/utils/helpers';

/* ---------- Shared UI (same as Products tab) ---------- */
const SectionCard = ({ title, subtitle, children, className }:{
  title:string; subtitle?:string; children:React.ReactNode; className?:string;
}) => (
  <section className={cn('bg-white rounded-2xl shadow-card border border-secondary-100 p-6', className)}>
    <div className="mb-5">
      <Text.Header className="text-lg">{title}</Text.Header>
      {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
    {children}
  </section>
);

const Field = ({ label, children }:{label:string; children:React.ReactNode}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const UnitInput = ({
  name, value, onChange, unit, step
}:{ name:string; value:any; onChange:(e:any)=>void; unit:string; step?:string }) => (
  <div className="relative">
    <Input name={name} type="number" value={value} onChange={onChange} step={step} className="pr-12" />
    <span className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500">{unit}</span>
  </div>
);

/* ---------- Memoized Form (prevents remounts) ---------- */
type FormState = {
  name: string;
  width: string;
  height: string;
  weight: string;
  length: string;
};

const ProductTypeForm = memo(function ProductTypeForm({
  data,
  setData,
  onSubmit,
  onCancel,
  editing,
}:{
  data: FormState;
  setData: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editing: boolean;
}) {
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // keep strings in state to avoid controlled/uncontrolled flips
    setData(prev => ({ ...prev, [name]: value }));
  }, [setData]);

  return (
    <SectionCard title={editing ? 'Редагувати тип продукту' : 'Створити новий тип продукту'}>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Назва типу продукту">
            <Input
              name="name"
              value={data.name}
              onChange={handleInputChange}
              placeholder="Напр., Board Game"
              required
            />
          </Field>
          <Field label="Вага (кг)">
            <UnitInput
              name="weight"
              value={data.weight}
              onChange={handleInputChange}
              unit="кг"
              step="0.001"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Ширина (мм)">
            <UnitInput name="width" value={data.width} onChange={handleInputChange} unit="мм" step="0.1" />
          </Field>
          <Field label="Довжина (мм)">
            <UnitInput name="length" value={data.length} onChange={handleInputChange} unit="мм" step="0.1" />
          </Field>
          <Field label="Висота (мм)">
            <UnitInput name="height" value={data.height} onChange={handleInputChange} unit="мм" step="0.1" />
          </Field>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="submit">{editing ? 'Оновити' : 'Створити'}</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Скасувати</Button>
        </div>
      </form>
    </SectionCard>
  );
});

/* ---------- Main ---------- */
export const ProductTypesTab = () => {
  const [productTypes, setProductTypes] = useState<TProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProductType, setEditingProductType] = useState<TProductType | null>(null);
  const [productTypeData, setProductTypeData] = useState<FormState>({
    name: '',
    width: '',
    height: '',
    weight: '',
    length: '',
  });

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        setLoading(true);
        const response = await getAllProductTypes();
        if (response.success) {
          setProductTypes(response.data); // already normalized to array
        } else {
          toast.error(response.errors?.[0] || 'Помилка завантаження типів продуктів');
        }
      } catch {
        toast.error('Помилка завантаження типів продуктів');
      } finally {
        setLoading(false);
      }
    };
    fetchProductTypes();
  }, []);

  const resetForm = useCallback(() => {
    setEditingProductType(null);
    setProductTypeData({ name: '', width: '', height: '', weight: '', length: '' });
  }, []);

  const handleCancel = useCallback(() => {
    setShowCreateForm(false);
    resetForm();
  }, [resetForm]);

  const handleEdit = useCallback((pt: TProductType) => {
    setEditingProductType(pt);
    const d = (pt as any)?.dimension || {};
    setProductTypeData({
      name: pt.name ?? '',
      width:  d?.width  != null ? String(d.width)  : '',
      height: d?.height != null ? String(d.height) : '',
      weight: d?.weight != null ? String(d.weight) : '',
      length: d?.length != null ? String(d.length) : '',
    });
    setShowCreateForm(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productTypeData.name.trim()) {
      toast.error('Назва типу продукту не може бути порожньою');
      return;
    }

    try {
      const payload: Omit<TProductType, 'id'> = {
        name: productTypeData.name.trim(),
        dimension: {
          width:  Number(productTypeData.width)  || 0,
          height: Number(productTypeData.height) || 0,
          weight: Number(productTypeData.weight) || 0,
          length: Number(productTypeData.length) || 0,
        },
      };

      const r = await createProductType(payload);
      if (!r.success) {
        toast.error(r.errors?.[0] || 'Помилка створення типу продукту');
        return;
      }
      toast.success(editingProductType ? 'Тип продукту оновлено успішно!' : 'Тип продукту створено успішно!');
      setShowCreateForm(false);
      resetForm();

      // refresh list
      setLoading(true);
      try {
        const resp = await getAllProductTypes();
        if (resp.success) setProductTypes(resp.data);
      } finally {
        setLoading(false);
      }
    } catch {
      toast.error('Помилка створення типу продукту');
    }
  }, [productTypeData, editingProductType, resetForm]);

  const handleDelete = useCallback(async (_id: number) => {
    toast.error('Функція видалення поки не реалізована');
  }, []);

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <div>
            <Text.Header>Управління типами продуктів</Text.Header>
            <Text.Span className="text-gray-500">Створення та редагування</Text.Span>
          </div>
          <Button onClick={() => { resetForm(); setShowCreateForm(true); }}>
            Додати тип продукту
          </Button>
        </div>

        {/* Form (memoized, not remounted on each keystroke) */}
        {showCreateForm && (
          <ProductTypeForm
            data={productTypeData}
            setData={setProductTypeData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editing={!!editingProductType}
          />
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-secondary-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Назва</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Розміри (мм)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Вага (кг)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Дії</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {productTypes.map((t) => {
                  const d = (t as any)?.dimension || {};
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/60">
                      <td className="px-6 py-4 text-sm text-gray-900">{t.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(d.width ?? '—')} × {(d.length ?? '—')} × {(d.height ?? '—')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{d.weight ?? '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => handleEdit(t)}>
                            Редагувати
                          </Button>
                          <Button
                            variant="secondary"
                            className="text-xs px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                            onClick={() => handleDelete(t.id)}
                          >
                            Видалити
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {productTypes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Типи продуктів не знайдено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RubikLoadable>
  );
};
