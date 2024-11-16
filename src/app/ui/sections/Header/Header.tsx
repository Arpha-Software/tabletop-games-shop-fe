import { FavoriteButton } from "@/app/ui/components";
import { ProfileButton } from "@/app/ui/components";
import { Navigation } from "@/app/ui/components";
import { CartButton } from "@/app/ui/components";
import { Container } from "@/app/ui/components";
import { Search } from "@/app/ui/components";
import { Logo } from "@/app/ui/components";

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
