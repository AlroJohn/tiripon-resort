import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

export default function AdminPage() {
  async function logout() {
    "use server";

    await signOut({
      redirectTo: "/login",
    });
  }

  return (
    <div>
      <form action={logout}>
        <Button type="submit">Logout</Button>
      </form>
    </div>
  );
}
