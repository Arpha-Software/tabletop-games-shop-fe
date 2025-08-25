'use client';

import { useState, useRef, useEffect } from 'react';
import { LoginPage } from '@/app/login/ui/LoginPage';
import { useUserContext } from '@/context/user/context';
import { Text } from '@/utils/ui/Text';
import { TLoginScreen } from '@/utils/types';
import { Modal } from '@/app/ui/components/Modal';
import { RubikLoadable } from '../../../../../ui/components/Loader';
import { cn } from '@/utils/helpers';

interface Review {
  id: number;
  rating: number;
  comment: string;
  username: string;
  createdAt: string;
}

type TProps = { productId: string };

export const Reviews = ({ productId }: TProps) => {
  const { user } = useUserContext();

  // UI state
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');

  // Form state
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewError, setReviewError] = useState('');
  const reviewInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError('');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products/${productId}/reviews`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Не вдалося завантажити відгуки');
        const data = await res.json();
        setReviews(data.content || []);
      } catch (e: any) {
        setReviewsError(e.message || 'Помилка завантаження відгуків');
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    if (!reviewText.trim()) {
      setReviewError('Введіть текст відгуку.');
      reviewInputRef.current?.focus();
      return;
    }

    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: Number(productId),
          rating: reviewRating,
          comment: reviewText.trim(),
        }),
      });
      if (!res.ok) throw new Error('Не вдалося надіслати відгук');
      const newReview: Review = await res.json();

      setReviews((prev) => [newReview, ...prev]);
      setReviewText('');
      setReviewError('');
      setReviewRating(5);
    } catch (e: any) {
      setReviewError(e.message || 'Помилка надсилання відгуку');
    }
  };

  const StarButton = ({ value, selected }: { value: number; selected: boolean }) => (
    <button
      type="button"
      aria-label={`Оцінка ${value}`}
      onClick={(e) => {
        if (!user) {
          setLoginModalOpen(true);
          e.preventDefault();
          return;
        }
        setReviewRating(value);
      }}
      className={cn(
        'text-2xl leading-none focus:outline-none transition-transform',
        selected ? 'text-yellow-500 scale-100' : 'text-gray-300 hover:text-yellow-400 hover:scale-110'
      )}
    >
      ★
    </button>
  );

  return (
    <RubikLoadable loading={reviewsLoading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <section className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Text.Header className="text-xl">Відгуки</Text.Header>
          {reviews.length > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
              {reviews.length} {reviews.length === 1 ? 'відгук' : reviews.length < 5 ? 'відгуки' : 'відгуків'}
            </span>
          )}
        </div>

        {/* Write review card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <Text.Subheader className="text-lg mb-3">Залишити відгук</Text.Subheader>
          <form onSubmit={submitReview} className="flex flex-col gap-3 max-w-2xl">
            {/* Stars */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton key={star} value={star} selected={star <= reviewRating} />
              ))}
              <span className="ml-1 text-sm text-gray-500">{reviewRating} / 5</span>
            </div>

            {/* Textarea */}
            <textarea
              ref={reviewInputRef}
              className={cn(
                'w-full min-h-[96px] resize-y rounded-xl',
                'border border-secondary-100 bg-white px-3 py-2',
                'focus:outline-none focus:ring-2 focus:ring-primary/20'
              )}
              placeholder={user ? 'Ваш відгук…' : 'Увійдіть, щоб залишити відгук'}
              value={reviewText}
              onChange={(e) => {
                setReviewText(e.target.value);
                setReviewError('');
              }}
              onFocus={(e) => {
                if (!user) {
                  setLoginModalOpen(true);
                  e.currentTarget.blur();
                }
              }}
              disabled={!user && !isLoginModalOpen}
            />

            {/* Error + Submit */}
            <div className="flex items-center gap-3">
              {reviewError && <span className="text-red-600 text-sm">{reviewError}</span>}
              <button
                type="submit"
                className="ml-auto bg-primary text-white rounded-full px-6 py-2 disabled:opacity-60"
                disabled={!user}
              >
                Надіслати
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        {reviewsError ? (
          <Text.Paragraph className="text-red-600">{reviewsError}</Text.Paragraph>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <Text.Paragraph className="text-gray-600">
              Відгуки ще не додані. Ви можете бути першим, хто залишить відгук!
            </Text.Paragraph>
          </div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Text.Span className="font-semibold">{r.username}</Text.Span>
                      <span className="text-yellow-500 text-sm" aria-label={`Оцінка ${r.rating} з 5`}>
                        {'★'.repeat(r.rating)}
                        <span className="text-gray-300">{'★'.repeat(5 - r.rating)}</span>
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-gray-800 leading-relaxed">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Auth modal */}
        {isLoginModalOpen && (
          <Modal>
            {(setScreen: React.Dispatch<React.SetStateAction<TLoginScreen>>, screen: TLoginScreen) => (
              <div>
                <button
                  className="absolute top-2 right-4 text-2xl"
                  onClick={() => setLoginModalOpen(false)}
                  aria-label="Закрити"
                >
                  &times;
                </button>
                <LoginPage screen={screen} setScreen={setScreen} />
              </div>
            )}
          </Modal>
        )}
      </section>
    </RubikLoadable>
  );
};
