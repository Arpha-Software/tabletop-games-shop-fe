import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from 'react-hot-toast';

import { Header } from "@/app/ui/sections/Header";
import { Footer } from "@/app/ui/sections/Footer";

import { UserContextProvider } from "@/context/user/UserContextProvider";
import { ProductsContextProvider } from "@/context/product/ProductsContextProvider";
import { CartContextProvider } from "@/context/cart/CartContextProvider";
import { AppInitializer } from "@/app/ui/components/AppInitializer";

import "./globals.css";

const avenirNextCyrReg = localFont({
  src: "./fonts/AvenirNextCyr/AvenirNextCyr-Regular.ttf",
  variable: "--font-avenir-next-cyr",
  weight: "400",
});

const avenirNextCyrMed = localFont({
  src: "./fonts/AvenirNextCyr/AvenirNextCyr-Medium.ttf",
  variable: "--font-avenir-next-cyr",
  weight: "500",
});

const montserratAlternatesBold = localFont({
  src: "./fonts/MontserratAlternates/MontserratAlternates-Bold.ttf",
  variable: "--font-monsterrat-alternates",
  weight: "700",
});

const monsterratAlternatesReg = localFont({
  src: "./fonts/MontserratAlternates/MontserratAlternates-Regular.ttf",
  variable: "--font-monsterrat-alternates",
  weight: "400",
});

const montserratAlternatesMed = localFont({
  src: "./fonts/MontserratAlternates/MontserratAlternates-Medium.ttf",
  variable: "--font-monsterrat-alternates",
  weight: "500",
});


export const metadata: Metadata = {
  title: "TableTop Games Shop",
  description: "Your one-stop shop for tabletop games",
};

export default function RootLayout({
  children,
  auth,
  cart,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
  cart: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="h-full">
      <body
        className={
          `${avenirNextCyrReg.variable}
          ${avenirNextCyrMed.variable}
          ${montserratAlternatesBold.variable}
          ${monsterratAlternatesReg.variable}
          ${montserratAlternatesMed.variable}
          antialiased flex flex-col min-h-screen bg-secondary-50`
        }
      >
        <UserContextProvider>
          <ProductsContextProvider>
            <CartContextProvider>
              <AppInitializer />
              <>{auth}</>
              <>{cart}</>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{}}
              />
            </CartContextProvider>
          </ProductsContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
