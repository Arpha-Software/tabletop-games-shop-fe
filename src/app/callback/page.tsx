import { signup } from "../actions/auth";
import { UserComponent } from "./ui/components/UserComponent";

export default async function Callback({
  searchParams: {
    id,
    firstName,
    lastName,
    email,
    role,
    accessToken,
    accessTokenExpirationDate,
  }
}: any) {
  return (
    <UserComponent
      signup={signup}
      user={{
        id,
        firstName,
        lastName,
        email,
        role,
      }}
      accessToken={accessToken}
      accessTokenExpirationDate={accessTokenExpirationDate}
    />
  )
}
