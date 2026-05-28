"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateTimeOptions, withTimeOption } from "@/lib/date";
import { useMemo, useState } from "react";

type Props = {
  name: string;
  defaultValue?: string;
  required?: boolean;
};

export function TimeSelect({
  name,
  defaultValue = "18:00",
  required = false,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  const options = useMemo(
    () => withTimeOption(generateTimeOptions(), defaultValue),
    [defaultValue],
  );

  return (
    <>
      <input type="hidden" name={name} value={value} required={required} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="h-9 w-full border-2">
          <SelectValue placeholder="Velg klokkeslett" />
        </SelectTrigger>
        <SelectContent position="popper" className="max-h-60">
          {options.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
