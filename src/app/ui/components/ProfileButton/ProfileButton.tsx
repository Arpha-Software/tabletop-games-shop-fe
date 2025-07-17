'use client';

import Link from "next/link";
import Image from "next/image";
import ProfileIcon from "@/public/icons/profile.svg";
import { useEffect, useState } from "react";

export const ProfileButton = () => {
  const [redirectUrl, setRedirectUrl] = useState('/login');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setRedirectUrl('/profile');
    }
  }, []);

  return (
    <Link href={redirectUrl} className="flex items-center w-10 h-10">
      <Image src={ProfileIcon} alt="Profile" width={24} height={24} />
    </Link>
  );
}
