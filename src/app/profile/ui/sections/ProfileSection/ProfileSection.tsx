'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { logout as serverLogout } from '@/app/actions/auth';
import { changeUserInfo } from '@/utils/api';

import { Button, Container, Input } from '@/app/ui/components';
import { Text } from '@/utils/ui/Text';
import { useUserContext } from '@/context/user/context';

import ProfileIcon from '@/public/icons/profile.svg';

interface ProfileFormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isSubscribedToNewsLetter: boolean;
  subscribedToNewsLetter: boolean;
}
interface ActionResult {
  success: boolean;
  errors: string[];
  data?: any;
}

export const ProfileSection = () => {
  const router = useRouter();
  const { user, loading, setUser } = useUserContext();

  const [formState, setFormState] = useState<ProfileFormState>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    isSubscribedToNewsLetter: false,
    subscribedToNewsLetter: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveResult, setSaveResult] = useState<ActionResult | null>(null);

  // ---- Hooks must be unconditional (before any early return) ----
  useEffect(() => {
    if (!user) {
      // reset to blanks when user logs out
      setFormState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        isSubscribedToNewsLetter: false,
        subscribedToNewsLetter: false,
      });
      setSaveResult(null);
      return;
    }
    setFormState({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      isSubscribedToNewsLetter: user.isSubscribedToNewsLetter || false,
      subscribedToNewsLetter: user.subscribedToNewsLetter || false,
    });
    setSaveResult(null);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setHasChanges(false);
      return;
    }
    setHasChanges(
      formState.firstName !== (user.firstName || '') ||
      formState.lastName !== (user.lastName || '') ||
      formState.phoneNumber !== (user.phoneNumber || '') ||
      formState.isSubscribedToNewsLetter !== (user.isSubscribedToNewsLetter || false) ||
      formState.subscribedToNewsLetter !== (user.subscribedToNewsLetter || false)
    );
  }, [formState, user]);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 8) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked, type } = e.target;
    setFormState(prev => {
      const next = { ...prev };
      if (type === 'checkbox') {
        (next as any)[id] = checked;
      } else {
        if (id === 'phone') {
          next.phoneNumber = formatPhoneNumber(value);
        } else {
          (next as any)[id] = value;
        }
      }
      return next;
    });
  }, []);

  const handleCancel = useCallback(() => {
    if (!user) return;
    setFormState({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      isSubscribedToNewsLetter: user.isSubscribedToNewsLetter || false,
      subscribedToNewsLetter: user.subscribedToNewsLetter || false,
    });
    setIsEditing(false);
    setSaveResult(null);
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      setSaveResult({ success: false, errors: ['User data not available. Cannot save.'] });
      return;
    }
    const result = await changeUserInfo({ id: user.id, ...formState });
    setSaveResult(result);
    if (result.success) {
      setIsEditing(false);
      setUser(prev => (prev ? { ...prev, ...formState } : prev));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSave();
  };

  const handleLogout = async () => {
    // clear context immediately for snappy UI, then clear session server-side
    setUser(null);
    await serverLogout();
    router.replace('/'); // or '/login'
  };

  const roleLabel =
    user && (user.role === 'ROLE_ADMIN' || user.role === 'admin') ? 'Адміністратор' : 'Користувач';

  // ---- Now we can safely early-return UI ----
  if (loading) {
    return (
      <Container>
        <div className="min-h-[400px] flex items-center justify-center">
          <Text.Header className="text-gray-500">Завантаження профілю...</Text.Header>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <div className="min-h-[400px] pt-20 text-center">
          <Text.Header className="text-gray-500 mb-4">Увійдіть, щоб переглянути профіль</Text.Header>
          <Button onClick={() => router.push('/login')}>Увійти</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
              <Image src={ProfileIcon} alt="Profile" width={32} height={32} />
            </div>
            <div>
              <Text.Header className="text-2xl mb-1">Мій профіль</Text.Header>
              <Text.Subheader className="text-gray-600">{user.email}</Text.Subheader>
            </div>
          </div>
          <Button tag={Link} href="/profile/orders" variant="secondary" className="text-sm px-6 py-2">
            Мої замовлення
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <Text.Header className="text-xl">Особиста інформація</Text.Header>
              {!isEditing ? (
                <Button variant="secondary" type="button" onClick={() => setIsEditing(true)} className="text-sm px-6 py-2">
                  Редагувати
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button variant="secondary" type="button" onClick={handleCancel} className="text-sm px-6 py-2">
                    Скасувати
                  </Button>
                  <Button type="submit" className="text-sm px-6 py-2" disabled={!hasChanges}>
                    Зберегти
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Ім&apos;я
                </label>
                <Input
                  id="firstName"
                  placeholder="Введіть ваше ім'я"
                  type="text"
                  value={formState.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Прізвище
                </label>
                <Input
                  id="lastName"
                  placeholder="Введіть ваше прізвище"
                  type="text"
                  value={formState.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Номер телефону (необов&apos;язково)
              </label>
              <Input
                id="phone"
                placeholder="xxx-xxx-xx-xx"
                type="tel"
                value={formState.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}
              />
              <p className="text-sm text-gray-500 mt-1">Формат: xxx-xxx-xx-xx</p>
            </div>

            <div className="space-y-4">
              <Text.Header className="text-lg">Налаштування підписки</Text.Header>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isSubscribedToNewsLetter"
                  checked={formState.isSubscribedToNewsLetter}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="isSubscribedToNewsLetter" className="text-sm font-medium text-gray-700">
                  Підписатися на новини та акції
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="subscribedToNewsLetter"
                  checked={formState.subscribedToNewsLetter}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="subscribedToNewsLetter" className="text-sm font-medium text-gray-700">
                  Отримувати email-повідомлення
                </label>
              </div>
            </div>

            {saveResult?.errors?.length ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-red-800">Помилки при збереженні:</h3>
                <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                  {saveResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {saveResult?.success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800">Успішно збережено!</h3>
                <p className="mt-2 text-sm text-green-700">Ваші дані були оновлені.</p>
              </div>
            ) : null}
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <Text.Header className="text-xl mb-6">Налаштування акаунту</Text.Header>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Text.Paragraph className="font-semibold">Email</Text.Paragraph>
                <Text.Span className="text-gray-600">{user.email}</Text.Span>
              </div>
              <Text.Span className="text-sm text-gray-500">Не можна змінити</Text.Span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Text.Paragraph className="font-semibold">Роль користувача</Text.Paragraph>
                <Text.Span className="text-gray-600">{roleLabel}</Text.Span>
              </div>
              <Text.Span className="text-sm text-gray-500">Системна роль</Text.Span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <Text.Paragraph className="font-semibold text-gray-900">Вийти з акаунту</Text.Paragraph>
                <Text.Span className="text-gray-600">Завершити поточну сесію</Text.Span>
              </div>
              <Button
                variant="secondary"
                type="button"
                onClick={handleLogout}
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              >
                Вийти
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
