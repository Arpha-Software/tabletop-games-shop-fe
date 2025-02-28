'use client';

import { useFetchProduct } from '@/hooks/product/useFetchProduct';
import { useQuery } from '@/hooks/useQuery';

import { Container } from '@/app/ui/components';
import { TabMenu } from '../../components/TabMenu'
import { Description } from './sections/Description';
import { Characteristics } from './sections/Characteristics';
import { Additions } from './sections/Additions';
import { Feedback } from './sections/Feedback';
import { Shipping } from './sections/Shipping';

import { ETab } from '@/utils/constants';

type TProps = {
  productId: string;
}

export const ProductInfo = ({ productId }: TProps) => {
  const { product } = useFetchProduct(productId);
  const queryTab = useQuery('tab');

  const tab = Object.values(ETab).includes(queryTab as ETab) ? (queryTab as ETab) : ETab.DESCRIPTION;

  const component: Record<ETab, JSX.Element> = {
    [ETab.DESCRIPTION]: <Description text={product?.description!} />,
    [ETab.CHARACTERISTICS]: <Characteristics />,
    [ETab.ADDITIONS]: <Additions />,
    [ETab.FEEDBACK]: <Feedback />,
    [ETab.SHIPPINGPAYMENT]: <Shipping />,
  }

  return (
    <Container className='mt-20'>
      <TabMenu />

      <section className='mt-14'>
        {component[tab]}
      </section>
    </Container>
  )
}
