import { verifyCode } from "@/app/actions/auth";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useTimer } from "../useTimer";
import { ELoginScreen } from "@/utils/enums";
import { TLoginScreen } from "@/utils/types";

type TProps = {
  setScreen: React.Dispatch<React.SetStateAction<TLoginScreen>>;
}

const initialState = {
  success: false,
  errors: [],
}

export const useHandleConfirmation = ({ setScreen }: TProps) => {
  const [state, formAction] = useFormState(() => verifyCode(code), initialState)

  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    formAction();

    if (state.success) {
      setScreen(ELoginScreen.REGISTER);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCode(e.target.value);
  }

  useEffect(() => {
    if (state.success) {
      setScreen(ELoginScreen.REGISTER);
    }
  }, [state.success]);

  return {
    handleSubmit,
    onChange,
    state,
  }
}
