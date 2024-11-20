'use client';

import { changeUserInfo, logout } from '@/app/actions/auth';

import { Button, Container, Input } from '@/app/ui/components';

import { useUserContext } from '@/context/user/context';
import { Text } from '@/utils/ui/Text';
import { useState } from 'react';
import { useFormState } from 'react-dom';

const initialValue = {
  id: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  success: false,
  errors: [],
}

export const ProfileSection = () => {
  const { user, setUser } = useUserContext();

  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [phone, setPhone] = useState(user?.phone);

  const [state, formAction] = useFormState(() => changeUserInfo({
    id: user?.id,
    firstName,
    lastName,
    phone,
  }), initialValue);

  const handleLogout = async () => {
    logout();
    localStorage.removeItem('userId');
    setUser(null);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case "firstName":
        setFirstName(e.target.value);
        break;
      case "lastName":
        setLastName(e.target.value);
        break;
      case "phone":
        setPhone(e.target.value);
        break;
      default:
        break;
    }
  }

  return (
    <Container>
      <div className='mb-4 space-y-4'>
        <Text.Header>Профіль</Text.Header>
        <Text.Subheader>{user?.email}</Text.Subheader>
      </div>

      <form action={formAction}>
        <div className='flex flex-col gap-2 max-w-96 mb-4'>
          <Input id='firstName' placeholder="Ім'я" type="text" value={firstName} onChange={onChange} />
          <Input id='lastName' placeholder="Прізвище" type="text" value={lastName} onChange={onChange} />
          <Input id='phone' placeholder="Номер телефону" type="text" value={phone} onChange={onChange} />
        </div>

        <Button type="submit">Зберегти</Button>
      </form>

      <form action={handleLogout} className='mt-10'>
        <Button variant='secondary' type="submit">Logout</Button>
      </form>
    </Container>
  )
}
