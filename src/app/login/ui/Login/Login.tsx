'use client';

import { useFormState } from "react-dom";
import { verifyUser } from "@/app/actions";

import { Button, Input } from "@/app/ui/components";
import { Separator } from "@/app/ui/components/Separator";

import GoogleIcon from '@/public/google.svg';
import { useEffect, useState } from "react";

type TProps = {
  title: string;
  children: React.ReactNode;
};

const GoogleLoginButton = () => (
  <Button
    variant="base"
    icon={GoogleIcon}
    className="flex items-center mx-auto mt-10 gap-3 rounded-lg border-black"
  >
    <span>Google</span>
  </Button>
);

const CommonSection = ({ title, children }: TProps) => (
  <section className="mt-12 w-full">
    <div className="px-16">
      <h3 className="text-center">{title}</h3>
      <div className="mt-10 mb-10">{children}</div>
    </div>
  </section>
);

const INITIAL_SECONDS = 59;

export const Confirmation = ({ phoneNumber }: {phoneNumber: string}) => {
  const [timer, setTimer] = useState(INITIAL_SECONDS);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const timerId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleResendCode = () => {
    setTimer(INITIAL_SECONDS);
    setIsResendDisabled(true);
  };

  return (
    <CommonSection title={`Для входу введіть код підтвердження з SMS на номер ${phoneNumber}`}>
      <Input placeholder="Код підтвердження" />
      <Button className="mt-6 mx-auto" variant="primary">
        Підтвердити
      </Button>
      <Button
        className="mt-4 mx-auto"
        variant={isResendDisabled ? 'link-disabled' : 'link'}
        onClick={handleResendCode}
        disabled={isResendDisabled}
      >
        {isResendDisabled ? `Відправити код ще раз (${timer})` : 'Відправити код ще раз'}
      </Button>
    </CommonSection>
  );
};

type TLoginProps = {
  phoneNumber: string;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
};

const initialState = {
  success: false,
  errors: [],
};

export const Login = ({ phoneNumber, setState, setPhoneNumber }: TLoginProps) => {
  const [state, formAction] = useFormState(() => verifyUser(phoneNumber), initialState)

  const handleLogin = async () => {
    formAction();

    if (state.success) {
      setState(true);
    }
  };

  useEffect(() => {
    if (state.success) {
      setState(true);
    }
  }, [state.success]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPhoneNumber(e.target.value);
  }

  return (
    <CommonSection title="Схоже ви не увійшли до свого акаунту">
      <form action={handleLogin} className="mb-10">
        <Input placeholder="Номер телефону" onChange={onChange}/>
        <Button className="mt-6 mx-auto" variant="primary" type="submit">
          Продовжити
        </Button>
      </form>

      <Separator text="або" />
      <GoogleLoginButton />
    </CommonSection>
  );
};

type LoginPageProps = {
  showConfirmation: boolean;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoginPage = ({ showConfirmation, setShowConfirmation }: LoginPageProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="flex flex-col items-center justify-center">
      {showConfirmation ? <Confirmation phoneNumber={phoneNumber} /> : <Login phoneNumber={phoneNumber} setState={setShowConfirmation} setPhoneNumber={setPhoneNumber} />}
    </div>
  );
};
