'use client';

import { Button, Input, Separator } from "@/app/ui/components";
import { CommonSection } from "../CommonSection";
import { GoogleLoginButton } from "../GoogleLoginButton";

import { TLoginScreen } from "@/utils/types";
import { useHandleLogin } from "@/hooks/auth/useHandleLogin";

type TLoginProps = {
  phoneNumber: string;
  setState: React.Dispatch<React.SetStateAction<TLoginScreen>>;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
};

export const Login = ({ phoneNumber, setState, setPhoneNumber }: TLoginProps) => {
  const { state, handleLogin, onChange } = useHandleLogin({ phoneNumber, setState, setPhoneNumber });

  return (
    <CommonSection title="Схоже ви не увійшли до свого акаунту">
      <form action={handleLogin} className="relative mb-10">
        <Input placeholder="Номер телефону" onChange={onChange}/>

        <span className="absolute block top-9 mt-2 text-sm text-red-600">{state.errors[0]}</span>

        <Button className="mt-8 mx-auto" variant="primary" type="submit">
          Продовжити
        </Button>
      </form>

      <Separator text="або" />
      <GoogleLoginButton />
    </CommonSection>
  );
};
