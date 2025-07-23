// src/app/profile/ui/sections/ProfileSection/ProfileSection.tsx
'use client';

import { logout } from '@/app/actions/auth';
import { changeUserInfo } from '@/utils/api';
import { Button, Container, Input } from '@/app/ui/components';
import { useUserContext } from '@/context/user/context';
import { Text } from '@/utils/ui/Text';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import ProfileIcon from '@/public/icons/profile.svg';
import { TUser } from '@/utils/types';

// Define the shape of the form state for better type safety and clarity
interface ProfileFormState {
  firstName: string;
  lastName: string;
  phone: string;
  isSubscribedToNewsLetter: boolean;
  subscribedToNewsLetter: boolean;
}

// Define the shape of the action result for consistency
interface ActionResult {
  success: boolean;
  errors: string[];
  data?: any;
}

export const ProfileSection = () => {
  const { user, loading, setUser } = useUserContext();

  const [formState, setFormState] = useState<ProfileFormState>({
    firstName: '',
    lastName: '',
    phone: '',
    isSubscribedToNewsLetter: false,
    subscribedToNewsLetter: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveResult, setSaveResult] = useState<ActionResult | null>(null);
  console.log('user', user)

  useEffect(() => {
    if (user) {
      setFormState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        isSubscribedToNewsLetter: user.isSubscribedToNewsLetter || false,
        subscribedToNewsLetter: user.subscribedToNewsLetter || false,
      });
      setSaveResult(null);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const originalFirstName = user.firstName || '';
      const originalLastName = user.lastName || '';
      const originalPhone = user.phone || '';
      const originalIsSubscribed = user.isSubscribedToNewsLetter || false;
      const originalSubscribed = user.subscribedToNewsLetter || false;

      setHasChanges(
        formState.firstName !== originalFirstName ||
        formState.lastName !== originalLastName ||
        formState.phone !== originalPhone ||
        formState.isSubscribedToNewsLetter !== originalIsSubscribed ||
        formState.subscribedToNewsLetter !== originalSubscribed
      );
    }
  }, [formState, user]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;

    setFormState(prev => {
      const newState = { ...prev };
      if (id === 'isSubscribedToNewsLetter' || id === 'subscribedToNewsLetter') {
        newState[id] = checked;
      } else {
        newState[id as Exclude<keyof ProfileFormState, 'isSubscribedToNewsLetter' | 'subscribedToNewsLetter'>] = value;
      }

      if (id === 'phone') {
        newState.phone = formatPhoneNumber(value);
      }
      return newState;
    });
  }, []);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 8) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  };

  const handleLogout = async () => {
    // Removed: localStorage.removeItem('authToken'); // This is now handled by the server action
    setUser(null);
    await logout();
    // The redirect to /login is handled by the logout server action or a global error handler
  };

  const handleSave = async () => {
    if (!user) {
      setSaveResult({ success: false, errors: ['User data not available. Cannot save.'] });
      return;
    }

    const result = await changeUserInfo({
      id: user.id,
      ...formState,
    });
    setSaveResult(result);

    if (result.success) {
      setIsEditing(false);
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            ...formState,
          };
        }
        return null;
      });
    }
  };

  const handleCancel = useCallback(() => {
    if (user) {
      setFormState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        isSubscribedToNewsLetter: user.isSubscribedToNewsLetter || false,
        subscribedToNewsLetter: user.subscribedToNewsLetter || false,
      });
    }
    setIsEditing(false);
    setSaveResult(null);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  if (!user) {
    return (
      <Container>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Text.Header className="text-gray-500">Завантаження профілю...</Text.Header>
          </div>
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
              <Image src={ProfileIcon} alt="Profile" width={32} height={32} className="text-secondary" />
            </div>
            <div>
              <Text.Header className="text-2xl mb-1">Мій профіль</Text.Header>
              <Text.Subheader className="text-gray-600">{user.email}</Text.Subheader>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <Text.Header className="text-xl">Особиста інформація</Text.Header>
              {!isEditing ? (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-sm px-6 py-2"
                >
                  Редагувати
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleCancel}
                    className="text-sm px-6 py-2"
                  >
                    Скасувати
                  </Button>
                  <Button
                    type="submit"
                    className="text-sm px-6 py-2"
                    disabled={!hasChanges}
                  >
                    Зберегти
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Ім'я
                </label>
                <Input
                  id='firstName'
                  placeholder="Введіть ваше ім'я"
                  type="text"
                  value={formState.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Прізвище
                </label>
                <Input
                  id='lastName'
                  placeholder="Введіть ваше прізвище"
                  type="text"
                  value={formState.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Номер телефону (необов'язково)
              </label>
              <Input
                id='phone'
                placeholder="xxx-xxx-xx-xx"
                type="tel"
                value={formState.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
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

            {saveResult?.errors && saveResult.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Помилки при збереженні:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {saveResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {saveResult?.success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Успішно збережено!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      Ваші дані були оновлені.
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                <Text.Span className="text-gray-600">
                  {user.role === 'admin' ? 'Адміністратор' : 'Користувач'}
                </Text.Span>
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
              <form action={handleLogout}>
                <Button
                  variant="secondary"
                  type="submit"
                  className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Вийти
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
