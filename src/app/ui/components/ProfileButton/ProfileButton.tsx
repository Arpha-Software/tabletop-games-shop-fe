import Link from "next/link";
import Image from "next/image";

import ProfileIcon from "@/public/icons/profile.svg"

export const ProfileButton = () => {
  return (
    <Link href="/profile" className="flex items-center space-x-2">
      <Image src={ProfileIcon} alt="Profile" width={24} height={24} />
    </Link>
  )
}
