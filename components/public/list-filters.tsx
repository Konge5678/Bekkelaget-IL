"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ALL_CATEGORIES = "alle";

type Props = {
  basePath: string;
  searchPlaceholder: string;
  searchLabel: string;
  defaultQ: string;
  defaultKategori?: string;
  categories?: string[];
};

function buildPath(basePath: string, q: string, kategori: string) {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (kategori) params.set("kategori", kategori);
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function ListFilters({
  basePath,
  searchPlaceholder,
  searchLabel,
  defaultQ,
  defaultKategori = "",
  categories = [],
}: Props) {
  const showCategory = categories.length > 0;
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);
  const [kategori, setKategori] = useState(defaultKategori);

  useEffect(() => {
    setQ(defaultQ);
    setKategori(defaultKategori);
  }, [defaultQ, defaultKategori]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = buildPath(basePath, q, kategori);
      if (next === buildPath(basePath, defaultQ, defaultKategori)) return;
      router.replace(next);
    }, 300);

    return () => clearTimeout(timeout);
  }, [q, kategori, basePath, defaultQ, defaultKategori, router]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder={searchPlaceholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label={searchLabel}
        className={showCategory ? "h-9 bg-background sm:flex-1" : "h-9 max-w-xl bg-background"}
      />
      {showCategory ? (
        <Select
          value={kategori || ALL_CATEGORIES}
          onValueChange={(value) =>
            setKategori(value === ALL_CATEGORIES ? "" : value)
          }
        >
          <SelectTrigger
            className="h-9 w-full border-2 bg-background sm:w-52"
            aria-label="Filtrer på kategori"
          >
            <SelectValue placeholder="Alle kategorier" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value={ALL_CATEGORIES}>Alle kategorier</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
}
