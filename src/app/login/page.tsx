'use client';

import { useState } from "react";
import { LoginPage } from "./ui/LoginPage";
import { TLoginScreen } from "@/utils/types";
import { ELoginScreen } from "@/utils/enums";

export default function Page() {
  const [screen, setScreen] = useState<TLoginScreen>(ELoginScreen.LOGIN);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginPage screen={screen} setScreen={setScreen} />
      </div>
    </div>
  );
}
