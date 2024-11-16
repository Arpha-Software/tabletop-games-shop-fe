export const introGridConfig = {
  gridSettings: {
    className: "grid gap-4 grid-cols-10 mt-10",
    style: { gridTemplateRows: '30px repeat(11, minmax(30px, 1fr))' },
  },
  cards: [
    {
      id: 1,
      title: 'Бонуси',
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729532461/Intro1_dry0rt.png',
      href: '/bonuses',
      titlePosition: 'bottom',
    },
    {
      id: 2,
      title: 'Знижки',
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729539861/Rectangle_4_qet3kz.png',
      href: '/discounts',
      titlePosition: 'bottom',
    },
    {
      id: 3,
      title: 'Гарячі пропозиції',
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729539882/Rectangle_5_rdxpa5.png',
      href: '/hot-deals',
      titlePosition: 'bottom',
    },
    {
      id: 4,
      title: 'Щоденна пропозиція',
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729539907/Rectangle_3_hwkuvh.png',
      href: '/daily-offer',
      titlePosition: 'top',
    },
    {
      id: 5,
      title: 'Спеціальні пропозиції',
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729539947/Rectangle_44_j33gqd.png',
      href: '/special-offers',
      titlePosition: 'top',
    },
    {
      id: 6,
      title: 'До каталогу',
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729539975/Rectangle_8_adjun7.png',
      href: '/catalogue',
      titlePosition: 'top',
    },
    {
      id: 7,
      title: 'До обраних',
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729539975/Rectangle_7_lkk169.png',
      href: '/favorites',
      titlePosition: 'top',
    },
  ],
};

export const introClassNames = {
  [introGridConfig.cards[0].id]: 'col-span-2 row-span-4 row-start-1',
  [introGridConfig.cards[1].id]: 'col-span-2 row-span-4 row-start-5',
  [introGridConfig.cards[2].id]: 'col-span-2 row-span-4 row-start-9',
  [introGridConfig.cards[3].id]: 'col-start-3 col-span-4 row-span-12',
  [introGridConfig.cards[4].id]: 'col-span-4 row-span-6 col-start-7',
  [introGridConfig.cards[5].id]: 'col-span-2 row-span-6',
  [introGridConfig.cards[6].id]: 'col-span-2 row-span-6',
}

export const categoriesSectionConfig = {
  title: 'Категорії',
  buttonTitle: 'Більше',
  columns: 3,
  rows: 2,
  gap: 4,
  items: [
    {
      title: "Категорія",
      img: "https://res.cloudinary.com/dkwve6mul/image/upload/v1729539907/Rectangle_3_hwkuvh.png",
      href: "/catalogue?category=1",
      colSpan: 1,
      rowSpan: 1,
    },
    {
      title: "Категорія",
      img: "https://res.cloudinary.com/dkwve6mul/image/upload/v1729539907/Rectangle_3_hwkuvh.png",
      href: "/catalogue?category=2",
      colSpan: 1,
      rowSpan: 1,
    },
    {
      title: "Категорія",
      img: "https://res.cloudinary.com/dkwve6mul/image/upload/v1729539907/Rectangle_3_hwkuvh.png",
      href: "/catalogue?category=3",
      colSpan: 1,
      rowSpan: 1,
    },
    {
      title: "Категорія",
      img: "https://res.cloudinary.com/dkwve6mul/image/upload/v1729539907/Rectangle_3_hwkuvh.png",
      href: "/catalogue?category=4",
      colSpan: 1,
      rowSpan: 1,
    },
    {
      title: "Категорія",
      img: "https://res.cloudinary.com/dkwve6mul/image/upload/v1729539907/Rectangle_3_hwkuvh.png",
      href: "/catalogue?category=5",
      colSpan: 2,
      rowSpan: 1,
    },
  ]
};

export const uGonnaNeedConfig = {
  columns: 5,
  rows: 1,
  gap: 5,
  items: [
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/cool-tabletop-greenwood',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-2',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-3',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-4',
    }
  ]
}

export const popularConfig = {
  columns: 5,
  rows: 2,
  gap: 5,
  items: [
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-1',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-2',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-3',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-4',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-5',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-6',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-7',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-8',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-9',
    },
    {
      title: 'Cool tabletop “Greenwood”',
      price: 10000,
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729547011/Rectangle_9_shgshw.png',
      href: '/catalogue/product-10',
    }
  ]
}

export const blogConfig = {
  title: 'Блог',
  columns: 3,
  items: [
    {
      title: 'New article with very long title, almost on two lines, maybe even three lines, if it’s needed',
      date: new Date(),
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729549837/hannah-busing-f0iHba5bSlQ-unsplash_ph3pm1.jpg',
      href: '/blog/new-article'
    },
    {
      title: 'New article with very long title, almost on two lines, maybe even three lines, if it’s needed',
      date: new Date(),
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729549837/hannah-busing-f0iHba5bSlQ-unsplash_ph3pm1.jpg',
      href: '/blog/new-article-2'
    },
    {
      title: 'New article with very long title, almost on two lines, maybe even three lines, if it’s needed',
      date: new Date(),
      img: 'https://res.cloudinary.com/dkwve6mul/image/upload/v1729549837/hannah-busing-f0iHba5bSlQ-unsplash_ph3pm1.jpg',
      href: '/blog/new-article-3'
    }
  ]
}
