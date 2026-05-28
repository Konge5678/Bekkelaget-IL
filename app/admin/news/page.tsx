import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminNewsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Nyheter</h1>
        <p className="text-sm text-muted-foreground">
          Her skal du kunne opprette, redigere og slette nyheter.
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="default">
          <Link href="/admin">Tilbake til dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

