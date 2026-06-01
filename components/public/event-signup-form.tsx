import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerForEvent } from "@/app/(public)/arrangementer/actions";

type Props = {
  eventId: string;
};

export function EventSignupForm({ eventId }: Props) {
  return (
    <form action={registerForEvent} className="flex flex-col gap-4">
      <input type="hidden" name="event_id" value={eventId} />

      <FormField label="Navn">
        <Input name="name" placeholder="Ditt navn" required autoComplete="name" />
      </FormField>

      <FormField label="E-post">
        <Input
          name="email"
          type="email"
          placeholder="din@epost.no"
          required
          autoComplete="email"
        />
      </FormField>

      <FormField label="Telefon (valgfritt)">
        <Input
          name="phone"
          type="tel"
          placeholder="Telefonnummer"
          autoComplete="tel"
        />
      </FormField>

      <Button type="submit" variant="accent" className="w-full sm:w-auto">
        Send påmelding
      </Button>
    </form>
  );
}
