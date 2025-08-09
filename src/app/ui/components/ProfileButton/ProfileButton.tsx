'use client';

import Link from "next/link";
import Image from "next/image";
import ProfileIcon from "@/public/icons/profile.svg";
import { useEffect, useState } from "react";

export const ProfileButton = () => {
  return (
    <Link href='/profile' className="flex items-center w-10 h-10">
      <Image src={ProfileIcon} alt="Profile" width={24} height={24} />
    </Link>
  );
}
