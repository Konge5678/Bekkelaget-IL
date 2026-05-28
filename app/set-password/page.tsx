import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SetPasswordPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const errorRaw = sp.error;
  const errorMessage = typeof errorRaw === "string" ? errorRaw : null;

  async function setPassword(formData: FormData) {
    "use server";

    const password = String(formData.get("password") ?? "");

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      redirect(`/set-password?error=${encodeURIComponent(error.message)}`);
    }

    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <Card>
        <CardHeader>
          <CardTitle>Sett passord</CardTitle>
          <CardDescription>Velg et passord for kontoen din.</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
          <form action={setPassword} className="flex flex-col gap-3">
            <Input
              type="password"
              name="password"
              placeholder="Nytt passord"
              minLength={8}
              required
            />

            <Button type="submit" className="w-full">
              Lagre passord
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

