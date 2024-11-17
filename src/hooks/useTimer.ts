import { useEffect, useState } from "react";

const INITIAL_SECONDS = 59;

export const useTimer = (initialTime?: number) => {
  const initialValue = initialTime ? initialTime : INITIAL_SECONDS;

  const [timer, setTimer] = useState(initialValue);
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
    setTimer(initialValue);
    setIsResendDisabled(true);
  };

  return {
    timer,
    isResendDisabled,
    handleResendCode,
  };
}
