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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/users/${props.user.id}`, {
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ0YWJsZXRvcC1nYW1lcy1zaG9wIiwic3ViIjoicG9saXZrYWFyc2VuQGdtYWlsLmNvbSIsImlhdCI6MTczMTk3NDU5NCwiZXhwIjoxNzM5MTc0NTk0fQ.WM1UAPYopSP2QJJy5A9diIpDZU2k6ObC08PcfDObkdCh7DWb57K-DrLNJv2btt1XIUIBVUXpNPL2X_jQZhnCLQ`,
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
