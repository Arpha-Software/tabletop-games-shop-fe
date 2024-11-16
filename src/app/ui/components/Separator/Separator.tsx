type TProps = {
  text: string;
}

export const Separator = ({ text }: TProps) => {
  return (
    <div className="relative">
      <div className="block w-fit m-auto bg-white px-4">{text}</div>
      <div className="absolute w-full h-[1px] top-1/2 -z-10 -translate-y-1/2 bg-black/10"/>
    </div>
  )
}
