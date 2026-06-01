export function searchParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}
