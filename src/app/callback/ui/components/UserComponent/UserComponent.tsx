'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/user/context';

import { TUser } from '@/utils/types';
import { useFormState } from 'react-dom';

type TProps = {
  user: TUser;
  signup: any;
  accessToken: string;
  accessTokenExpirationDate: string;
}

export const UserComponent = (props: TProps) => {
  const { setUser } = useUserContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/users/${props.user.id}`, {
          headers: {
            "Authorization": `Bearer ${props.accessToken}`,
          }
        });
        const data = await response.json();

        setUser(data);
        localStorage.setItem('userId', JSON.stringify(data.id));
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();

    props.signup({ accessToken: props.accessToken, accessTokenExpirationDate: props.accessTokenExpirationDate });
  }, [props.user]);

  return (
    <div>Loading...</div>
  )
}
