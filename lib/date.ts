import { formatInTimeZone } from "date-fns-tz";

const OSLO_TZ = "Europe/Oslo";

export function formatOsloDateTime(iso: string | null | undefined) {
  if (!iso) return "-";
  return formatInTimeZone(new Date(iso), OSLO_TZ, "dd.MM.yyyy HH:mm");
}

export function isoToOsloDateAndTime(iso: string | null | undefined) {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  return {
    date: formatInTimeZone(d, OSLO_TZ, "yyyy-MM-dd"),
    time: formatInTimeZone(d, OSLO_TZ, "HH:mm"),
  };
}

export function generateTimeOptions(
  startHour = 6,
  endHour = 22,
  intervalMinutes = 15,
) {
  const options: string[] = [];
  const start = startHour * 60;
  const end = endHour * 60;

  for (let minutes = start; minutes <= end; minutes += intervalMinutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    options.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    );
  }

  return options;
}

export function withTimeOption(options: string[], time: string) {
  if (!time || options.includes(time)) return options;
  return [...options, time].sort();
}

