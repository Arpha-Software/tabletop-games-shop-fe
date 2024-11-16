'use client';

import { LoginPage } from "@/app/login/ui/Login/Login";
import { Modal } from "@/app/ui/components/Modal";

export default function Page() {
  return (
    <Modal>
      {(setShowConfirmation, showConfirmation) => (
        <LoginPage showConfirmation={showConfirmation} setShowConfirmation={setShowConfirmation} />
      )}
    </Modal>
  )
}
