import Link from "next/link";

type TProps = {
  links: {
    href: string;
    label: string;
  }[];
}

export const Breadcrumbs = ({ links }: TProps) => {
  return (
    <div>
      {links.map((link, index) => (
        <span key={index}>
          <Link href={link.href} className='text-sm text-slate-400 hover:text-slate-500'>{link.label}</Link>
          {index !== links.length - 1 && <span className='text-sm text-slate-400 mx-2'>&#62;</span>}
        </span>
      ))}
    </div>
  )
}
