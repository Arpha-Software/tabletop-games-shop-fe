import { cn } from "@/utils"

type TProps = {
  id?: string
  children: React.ReactNode
  className?: string,
  style?: React.CSSProperties
}

export const Container = ({
  id,
  children,
  className,
  style,
}: TProps) => {
  return (
    <section id={id} className={cn('px-14', className)} style={style}>
      { children }
    </section>
  )
}
