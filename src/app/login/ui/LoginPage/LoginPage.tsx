'use client';

import { useState } from "react";

import { Login } from "../Login";
import { Confirmation } from "../Confirmation";
import { FinalRegister } from "../FinalRegister";

import { TLoginScreen } from "@/utils/types";
import { ELoginScreen } from "@/utils/enums";

type LoginPageProps = {
  screen: TLoginScreen;
  setScreen: React.Dispatch<React.SetStateAction<TLoginScreen>>;
};

export const LoginPage = ({ screen, setScreen }: LoginPageProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="flex flex-col items-center justify-center">
      {screen === ELoginScreen.CONFIRMATION ? (
        <Confirmation phoneNumber={phoneNumber} setScreen={setScreen} />
      ) : screen === ELoginScreen.REGISTER ? (
        <FinalRegister />
      ) : (
        <Login phoneNumber={phoneNumber} setState={setScreen} setPhoneNumber={setPhoneNumber} />
      )}
    </div>
  );
};
