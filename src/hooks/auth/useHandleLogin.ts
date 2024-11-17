import { verifyUser } from "@/app/actions";
import { ELoginScreen } from "@/utils/enums";
import { TLoginScreen } from "@/utils/types";
import { useEffect } from "react";
import { useFormState } from "react-dom";

type TProps = {
  phoneNumber: string;
  setState: React.Dispatch<React.SetStateAction<TLoginScreen>>;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
}

const initialState = {
  success: false,
  errors: [],
};

export const useHandleLogin = ({
  phoneNumber,
  setState,
  setPhoneNumber,
}: TProps) => {
  const [state, formAction] = useFormState(() => verifyUser(phoneNumber), initialState)

  const handleLogin = async () => {
    formAction();

    if (state.success) {
      setState(ELoginScreen.CONFIRMATION);
    }
  };

  useEffect(() => {
    if (state.success) {
      setState(ELoginScreen.CONFIRMATION);
    }
  }, [state.success]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPhoneNumber(e.target.value);
  }

  return {
    handleLogin,
    onChange,
    state,
  }
}
