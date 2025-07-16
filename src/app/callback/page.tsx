import { UserComponent } from "./ui/components/UserComponent";

export default function Callback({
  searchParams,
}: {
  searchParams: { accessToken?: string };
}) {
  const { accessToken } = searchParams;

  if (!accessToken) {
    return <div>Invalid callback. No access token provided.</div>;
  }

  return <UserComponent accessToken={accessToken} />;
}
