'use client';

import { Modal } from "@/app/ui/components/Modal";
import { LoginPage } from "@/app/login/ui/LoginPage";

export default function Page() {
  return (
    <Modal>
      {(setScreen, screen) => (
        <LoginPage screen={screen} setScreen={setScreen} />
      )}
    </Modal>
  );
}
