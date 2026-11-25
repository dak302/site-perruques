import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="wrap" style={{ maxWidth: 420, paddingBlock: 80 }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Espace admin</h1>
      <LoginForm />
    </div>
  );
}
