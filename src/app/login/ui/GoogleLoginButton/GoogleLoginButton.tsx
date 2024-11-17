import { Button } from "@/app/ui/components";

import GoogleIcon from '@/public/icons/google.svg';

export const GoogleLoginButton = () => (
  <Button
    variant="base"
    icon={GoogleIcon}
    className="flex items-center mx-auto mt-10 gap-3 rounded-lg border-black"
  >
    <span>Google</span>
  </Button>
);
