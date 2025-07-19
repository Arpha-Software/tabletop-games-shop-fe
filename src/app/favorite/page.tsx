import { Container, ProductCard } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";
import { TProduct } from "@/utils/types";

// Mock favorite products (reuse mockProducts structure from useMockCart)
const mockFavorites: TProduct[] = [
  {
    id: 1,
    name: "Назва товару, можливо навіть довга",
    description: "A great board game for everyone",
    price: 720,
    quantity: 10,
    gameDetails: {
      players: "2-4",
      age: "8+",
      playTime: "60",
      complexity: 2,
      bggRating: 7.2,
      components: "Board, cards, tokens"
    },
    classification: {
      language: "UA",
      genres: ["Family"],
      categories: ["Strategy"],
      mechanics: ["Worker placement"]
    },
    publicationDetails: {
      author: "Автор 1",
      publisher: "Видавець 1"
    },
    media: {
      mainImgLink: "https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png",
      photos: ["https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png"]
    },
    averageRating: 4.5,
    reviewCount: 12,
    addons: []
  },
  {
    id: 2,
    name: "Ще одна гра для улюбленого",
    description: "An exciting card game",
    price: 720,
    quantity: 15,
    gameDetails: {
      players: "4-8",
      age: "10+",
      playTime: "30",
      complexity: 1,
      bggRating: 6.8,
      components: "Cards"
    },
    classification: {
      language: "UA",
      genres: ["Casual"],
      categories: ["Party"],
      mechanics: ["Set collection"]
    },
    publicationDetails: {
      author: "Автор 2",
      publisher: "Видавець 2"
    },
    media: {
      mainImgLink: "https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png",
      photos: ["https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png"]
    },
    averageRating: 4.0,
    reviewCount: 8,
    addons: []
  }
];

export default function Favorite() {
  return (
    <Container className="mt-10 mb-16">
      <Text.Header className="mb-8">Обране</Text.Header>
      {mockFavorites.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Text.Paragraph className="text-gray-500 text-lg">У вас ще немає обраних товарів</Text.Paragraph>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {mockFavorites.map((item) => (
            <ProductCard key={item.id} item={item} className="w-full" />
          ))}
        </div>
      )}
    </Container>
  );
}
