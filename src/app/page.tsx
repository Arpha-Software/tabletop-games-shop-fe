import { Blog } from "@/app/ui/sections/Blog";
import { Categories } from "@/app/ui/sections/Categories";
import { Intro } from "@/app/ui/sections/Intro";
import { Popular } from "@/app/ui/sections/Popular";
import { UGonnaNeed } from "@/app/ui/sections/UGonnaNeed";

export default function Home() {
  return (
    <>
      <Intro />

      <Categories />

      <UGonnaNeed />

      <Popular />

      <Blog />
    </>
  );
}
