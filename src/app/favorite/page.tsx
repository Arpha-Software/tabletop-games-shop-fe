'use client';

import { useEffect, useState } from 'react';
import { Container, Button } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";
import { TProduct } from "@/utils/types";
import { getWishlist, removeProductFromWishlist } from '../actions/wishlist';
import { Modal } from '../ui/components/Modal';
import { WishlistProductCard } from './ui/components/WishlistProductCard';
import toast from 'react-hot-toast';
import { RubikLoadable } from '../ui/components/Loader';

export default function Favorite() {
  const [favorites, setFavorites] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareableLink, setShareableLink] = useState('');
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await getWishlist();
      if (response.success) {
        setFavorites(response.data.products);
        setShareableLink(response.data.shareableLink);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromWishlist = async (productId: number) => {
    const response = await removeProductFromWishlist(productId);
    if (response.success) {
      setFavorites(prev => prev.filter(p => p.id !== productId));
      toast.success('Товар видалено з обраного.');
    } else {
      toast.error(response.errors?.[0] || 'Не вдалося видалити товар з обраного.');
    }
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/wishlist/${shareableLink}`);
    toast.success('Посилання скопійовано!');
  };

  return (
    <RubikLoadable loading={loading} fullscreen dim="rgba(255,255,255,.6)" wobble size={160}>
      <Container className="mt-10 mb-16">
        <div className="flex justify-between items-center mb-8">
          <Text.Header>Обране</Text.Header>
          {favorites.length > 0 && (
            <Button variant="secondary" onClick={handleShare}>Поділитися</Button>
          )}
        </div>
        {favorites.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <Text.Paragraph className="text-gray-500 text-lg">У вас ще немає обраних товарів</Text.Paragraph>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {favorites.map((item) => (
              <WishlistProductCard key={item.id} product={item} onRemove={handleRemoveFromWishlist} />
            ))}
          </div>
        )}
        {isShareModalOpen && (
          <Modal>
            {() => (
              <div className="p-8">
                <Text.Header className="mb-4">Поділитися списком бажань</Text.Header>
                <Text.Paragraph className="mb-4">Скопіюйте посилання та поділіться з друзями!</Text.Paragraph>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/wishlist/${shareableLink}`}
                    className="w-full p-2 border rounded"
                  />
                  <Button variant="primary" onClick={handleCopyLink}>Копіювати</Button>
                </div>
                <Button variant="secondary" onClick={() => setShareModalOpen(false)} className="mt-4">Закрити</Button>
              </div>
            )}
          </Modal>
        )}
      </Container>
    </RubikLoadable>
  );
}
