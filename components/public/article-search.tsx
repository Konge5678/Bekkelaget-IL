"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  defaultQ: string;
};

function buildPath(q: string) {
  const trimmed = q.trim();
  return trimmed ? `/artikler?q=${encodeURIComponent(trimmed)}` : "/artikler";
}

export function ArticleSearch({ defaultQ }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);

  useEffect(() => {
    setQ(defaultQ);
  }, [defaultQ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = buildPath(q);
      if (next === buildPath(defaultQ)) return;
      router.replace(next);
    }, 300);

    return () => clearTimeout(timeout);
  }, [q, defaultQ, router]);

  return (
    <Input
      placeholder="Søk i artikler..."
      value={q}
      onChange={(e) => setQ(e.target.value)}
      aria-label="Søk i artikler"
      className="h-9 max-w-xl bg-background"
    />
  );
}
