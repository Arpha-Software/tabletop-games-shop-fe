'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "./ui/LoginPage";
import { TLoginScreen } from "@/utils/types";
import { ELoginScreen } from "@/utils/enums";
import { useUserContext } from "@/context/user/context"; // Import useUserContext

export default function Page() {
  const [screen, setScreen] = useState<TLoginScreen>(ELoginScreen.LOGIN);
  const router = useRouter();
  const { user, loading } = useUserContext(); // Get user and loading state from context

  useEffect(() => {
    // If user is loaded and authenticated, redirect to profile
    if (!loading && user) {
      console.log('Login Page: User is authenticated, redirecting to /profile');
      router.replace('/profile');
    }
    // Removed original localStorage.getItem('authToken') logic as authentication state
    // is now managed by UserContextProvider and HttpOnly cookies.
  }, [user, loading, router]); // Depend on user and loading from context

  // Optionally, show a loading state here if user context is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-gray-500">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginPage screen={screen} setScreen={setScreen} />
      </div>
    </div>
  );
}
