export const API_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL!;

export const SORTING_OPTIONS = [
    { value: 'averageRating,desc', label: 'За рейтингом' },
    { value: 'reviewCount,desc', label: 'За популярністю' },
    { value: 'price,asc', label: 'Від дешевих до дорогих' },
    { value: 'price,desc', label: 'Від дорогих до дешевих' },
];

export const DEFAULT_STORE_ADDRESS = "м.Львів, вул.Пекарська, 25";
