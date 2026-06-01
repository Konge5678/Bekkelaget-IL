export function uniqueCategories(
  rows: { category: string | null }[] | null | undefined,
) {
  return [
    ...new Set(
      (rows ?? [])
        .map((row) => row.category?.trim())
        .filter((c): c is string => Boolean(c)),
    ),
  ].sort((a, b) => a.localeCompare(b, "nb"));
}

export function sanitizeSearch(q?: string) {
  const trimmed = q?.trim().replace(/[%_,]/g, "");
  return trimmed || "";
}
