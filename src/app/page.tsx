import { Blog } from "@/sections/Blog";
import { Categories } from "@/sections/Categories";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { Intro } from "@/sections/Intro";
import { Popular } from "@/sections/Popular";
import { UGonnaNeed } from "@/sections/UGonnaNeed";

export default function Home() {
  return (
    <div className="">
      <Header />

      <Intro />

      <Categories />

      <UGonnaNeed />

      <Popular />

      <Blog />

      <Footer />
    </div>
  );
}
