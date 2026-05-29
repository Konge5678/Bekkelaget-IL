"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  defaultValue: string;
};

export function MembersSearch({ defaultValue }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const q = value.trim();
      const currentQ = new URLSearchParams(window.location.search).get("q") ?? "";

      if (q === currentQ.trim()) return;

      if (q) {
        router.replace(`/admin/members?q=${encodeURIComponent(q)}`);
      } else {
        router.replace("/admin/members");
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, router]);

  return (
    <Input
      placeholder="Søk på navn, e-post eller telefon..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
