import { Container } from "@/app/ui/components";
import { AdminPanel } from "./ui/sections/AdminPanel";
import { AdminNavigation } from "./ui/components/AdminNavigation/AdminNavigation";

export default async function AdminPage() {
  return (
    <Container className="py-8">
      <AdminNavigation />
      <AdminPanel />
    </Container>
  );
}
