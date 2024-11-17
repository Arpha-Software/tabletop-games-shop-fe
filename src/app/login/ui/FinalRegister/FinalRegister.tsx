'use client';

import { Button, Input } from "@/app/ui/components";
import { CommonSection } from "../CommonSection";

import { useHandleFinalRegister } from "@/hooks/auth/useHanfleFinalRegister";

export const FinalRegister = () => {
  const { state, handleSubmit, onChangeName, onChangeSurname, onChangeEmail } = useHandleFinalRegister();

  return (
    <CommonSection title="Для входу необхідно заповнити особисті дані">
      <form action={handleSubmit}>
        <div className="space-y-2.5">
          <Input placeholder="Ім'я" onChange={onChangeName}/>

          <Input placeholder="Прізвище" onChange={onChangeSurname}/>

          <Input placeholder="Email" onChange={onChangeEmail}/>
        </div>

        <div>
          {state.errors.map(e => {
            return <span className="block mt-2 text-sm text-red-600">{e}</span>
          })}
        </div>

        <Button className="mt-6 mx-auto" variant="primary" type="submit">
          Підтвердити
        </Button>
      </form>
    </CommonSection>
  );
};
