'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader } from '@/app/ui/components';
import { LoginPage } from '@/app/login/ui/LoginPage';
import { useUserContext } from '@/context/user/context';
import { Text } from '@/utils/ui/Text';
import { TLoginScreen } from '@/utils/types';
import { Modal } from '@/app/ui/components/Modal';

interface Review {
  id: number;
  rating: number;
  comment: string;
  username: string;
  createdAt: string;
}

type TProps = {
  productId: string;
};

export const Reviews = ({ productId }: TProps) => {
  const { user } = useUserContext();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const reviewInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError('');

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/products/${productId}/reviews`);
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

  return (
    <div className='mt-6'>
      <Text.Header className="mb-4 text-xl">Відгуки</Text.Header>
      <div className="mb-6 py-6 border-b">
        <Text.Subheader className="mb-2 text-lg">Залишити відгук</Text.Subheader>
        <form
          onSubmit={async e => {
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
              const newReview = await res.json();
              setReviews(prev => [newReview, ...prev]);
              setReviewText('');
              setReviewError('');
              setReviewRating(5);
            } catch (e: any) {
              setReviewError(e.message || 'Помилка надсилання відгуку');
            }
          }}
          className="flex flex-col gap-2 max-w-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                aria-label={`Оцінка ${star}`}
                onClick={e => {
                  if (!user) {
                    setLoginModalOpen(true);
                    e.preventDefault();
                    return;
                  }
                  setReviewRating(star);
                }}
                className="text-2xl focus:outline-none"
              >
                <span className={star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}>
                  ★
                </span>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">{reviewRating} / 5</span>
          </div>
          <textarea
            ref={reviewInputRef}
            className="border rounded-lg p-3 min-h-[80px] resize-y"
            placeholder="Ваш відгук..."
            value={reviewText}
            onChange={e => {
              setReviewText(e.target.value);
              setReviewError('');
            }}
            onFocus={e => {
              if (!user) {
                setLoginModalOpen(true);
                e.target.blur();
              }
            }}
            disabled={!user && !isLoginModalOpen}
          />
          {reviewError && <span className="text-red-600 text-sm">{reviewError}</span>}
          <div>
            <button
              type="submit"
              className="bg-primary text-white rounded-full px-8 py-2 mt-2 disabled:opacity-60"
              disabled={!user}
            >
              Надіслати
            </button>
          </div>
        </form>
      </div>

      {reviewsLoading ? (
        <Loader className="mt-8" />
      ) : reviewsError ? (
        <Text.Paragraph className="text-red-600 mt-8">{reviewsError}</Text.Paragraph>
      ) : reviews.length === 0 ? (
        <Text.Paragraph>Відгуки ще не додані. Ви можете бути першим, хто залишить відгук!</Text.Paragraph>
      ) : (
        <ul className="space-y-6 mb-8 mt-6">
          {reviews.map(review => (
            <li key={review.id} className="border-b pb-4">
              <div className="flex items-center gap-3 mb-1">
                <Text.Span className="font-bold">{review.username}</Text.Span>
                <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                <span className="text-gray-400 text-xs">{new Date(review.createdAt).toLocaleDateString('uk-UA')}</span>
              </div>
              <Text.Paragraph>{review.comment}</Text.Paragraph>
            </li>
          ))}
        </ul>
      )}

      {isLoginModalOpen && (
        <Modal>
          {(setScreen: React.Dispatch<React.SetStateAction<TLoginScreen>>, screen: TLoginScreen) => (
            <div>
              <button className="absolute top-2 right-4 text-2xl" onClick={() => setLoginModalOpen(false)}>&times;</button>
              <LoginPage screen={screen} setScreen={setScreen} />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
