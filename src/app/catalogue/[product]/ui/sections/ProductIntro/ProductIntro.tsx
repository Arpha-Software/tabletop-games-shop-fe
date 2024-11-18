import { Gallery } from '../../components/Gallery'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Title } from '../../components/Title';
import { Rating } from '../../components/Rating';
import { Price } from '../../components/Price';
import { Description } from '../../components/Description';
import { ControlButtons } from '../../components/ControlButtons';

type TProps = {
  product: string;
}

export const ProductIntro = ({ product }: TProps) => {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/catalogue?category=1', label: 'Category' },
    { href: `/catalogue/${product}`, label: product }
  ]

  return (
    <div className='flex justify-between'>
      <Gallery images={["https://via.placeholder.com/1440", "https://via.placeholder.com/512", "https://via.placeholder.com/512", "https://via.placeholder.com/512"]} />

      <section className='flex flex-col justify-between w-full pl-10'>
        <div>
          <Breadcrumbs links={links} />
          <Title className='mt-10' text="Product title that is long enough to cover two lines, or even three, if it is needed" />
          <Rating rating={1.7} className='mt-2' />
          <Price price={100} className='mt-6' />
          <Description
            text='Lorem ipsum dolor sit amet consectetur. Volutpat congue pellentesque tincidunt metus quam eget velit dignissim. Enim iaculis fermentum enim quisque. Ac semper sagittis proin blandit massa erat phasellus. Sed erat urna amet lorem vulputate auctor vitae sagittis. massa erat phasellus. Sed erat urna amet lorem vulputate auctor vitae sagittis.'
            className='mt-6'
          />
        </div>

        <ControlButtons className='mt-6' />
      </section>
    </div>
  )
}
