'use client';

import { useEffect, useState } from 'react';
import { Container, ProductCard } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";
import { TProduct } from "@/utils/types";
import { getSharedWishlist } from '../../actions/wishlist';
import { Loader } from '../../ui/components/Loader';

export default function SharedWishlist({ params }: { params: { shareableLink: string } }) {
  const [wishlist, setWishlist] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      const response = await getSharedWishlist(params.shareableLink);
      if (response.success) {
        setWishlist(response.data.products);
        setUserEmail(response.data.userEmail);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [params.shareableLink]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-10 mb-16">
      <Text.Header className="mb-8">Список бажань користувача {userEmail}</Text.Header>
      {wishlist.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Text.Paragraph className="text-gray-500 text-lg">Цей список бажань порожній</Text.Paragraph>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.id} item={item} className="w-full" />
          ))}
        </div>
      )}
    </Container>
  );
}
