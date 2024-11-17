'use client';

import { logout } from "../actions";
import { Button } from "../ui/components";

export default function Profile() {
  return (
    <>
      <h1>Profile page</h1>

      <form action={logout}>
        <Button type="submit">Logout</Button>
      </form>
    </>
  );
}
