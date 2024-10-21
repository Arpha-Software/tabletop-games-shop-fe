import { InputHTMLAttributes } from "react";

type TProps = {
  variant?: 'primary' | 'secondary'
  className?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = ({
  variant = 'primary',
  className,
  ...props
}: TProps) => {
  return (
    <input className={className} {...props} />
  )
}
