import Image from "next/image";
import Link from "next/link";
import LogoIcon from "@/public/images/logo.png";

export const Logo = () => {
  return (
    <Link href="/" className="font-bold text-2xl" replace>
      <Image
        src='https://res.cloudinary.com/dkwve6mul/image/upload/v1731797132/%D0%BF%D1%80%D0%BE%D0%B7%D0%BE%D1%80%D0%B8%D0%B9_%D1%84%D0%BE%D0%BD_niczk5.png'
        alt="Logo"
        width={440}
        height={440}
        className="w-20 h-20"
      />
    </Link>
  )
}
