'use client';

import { Button, Input } from "@/app/ui/components";
import { CommonSection } from "../CommonSection";

import { useTimer } from "@/hooks/useTimer";
import { useHandleConfirmation } from "@/hooks/auth/useHandleConfirmation";

import { TLoginScreen } from "@/utils/types";

type TProps = {
  phoneNumber: string;
  setScreen: React.Dispatch<React.SetStateAction<TLoginScreen>>;
}

export const Confirmation = ({ phoneNumber, setScreen }: TProps) => {
  const { timer, isResendDisabled, handleResendCode} = useTimer();
  const { state, onChange, handleSubmit } = useHandleConfirmation({ setScreen });

  return (
    <CommonSection title={`Для входу введіть код підтвердження з SMS на номер ${phoneNumber}`}>
      <form action={handleSubmit} className="relative mb-10">
        <Input placeholder="Код підтвердження" onChange={onChange} />

        <span className="absolute block top-9 mt-2 text-sm text-red-600">{state.errors[0]}</span>

        <Button className="mt-8 mx-auto" variant="primary" type="submit">
          Підтвердити
        </Button>
      </form>

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
