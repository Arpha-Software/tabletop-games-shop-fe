import { Button } from "@/app/ui/components";
import { useRouter } from 'next/navigation';

import GoogleIcon from '@/public/icons/google.svg';

export const GoogleLoginButton = () => {
  const router = useRouter();

  const handleLogin = async () => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/oauth2/authorization/google`);
  };

  return (
    <form action={handleLogin}>
      <Button
        variant="base"
        icon={GoogleIcon}
        type="submit"
        className="flex items-center mx-auto mt-10 gap-3 rounded-lg border-black"
      >
        <span>Google</span>
      </Button>
    </form>
  )
}
