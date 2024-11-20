import { registerUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
  success: false,
  errors: [],
}

export const useHandleFinalRegister = () => {
  const [state, formAction] = useFormState(() => registerUser(data), initialState);

  const [data, setData] = useState({});

  const handleSubmit = async () => {
    formAction();

    if (state.success) {
      redirect('/');
    }
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setData({ ...data, name: e.target.value });
  }

  const onChangeSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setData({ ...data, surname: e.target.value });
  }

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setData({ ...data, email: e.target.value });
  }

  useEffect(() => {
    if (state.success) {
      redirect('/');
    }
  }, [state.success]);

  return {
    state,
    handleSubmit,
    onChangeName,
    onChangeSurname,
    onChangeEmail,
  }
}
