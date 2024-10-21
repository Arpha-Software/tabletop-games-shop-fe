import { FavoriteButton } from "@/components";
import { ProfileButton } from "@/components";
import { Navigation } from "@/components";
import { CartButton } from "@/components";
import { Container } from "@/components";
import { Search } from "@/components";
import { Logo } from "@/components";

export const Header = () => {
  return (
    <Container className="py-8">
      <header className="flex justify-between items-center">
        <Logo />

        <div className="flex gap-36">
          <Navigation />

          <div className="flex gap-12">
            <Search />

            <div className="flex gap-4">
              <ProfileButton />
              <FavoriteButton />
              <CartButton />
            </div>
          </div>
        </div>
      </header>
    </Container>
  )
}
