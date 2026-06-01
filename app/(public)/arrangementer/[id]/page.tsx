import { EventSignupForm } from "@/components/public/event-signup-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatOsloDateTime } from "@/lib/date";
import { getEventById } from "@/lib/public/events";
import { searchParam } from "@/lib/public/search-params";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ArrangementPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const påmeldt = searchParam(sp.påmeldt);
  const feil = searchParam(sp.feil);

  const { event, error } = await getEventById(id);

  if (error || !event) {
    notFound();
  }

  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/arrangementer"
        className="flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 [@media(hover:hover)]:hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Tilbake til arrangementer
      </Link>

      <header className="mt-6 border-b border-border pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {event.category ? <Badge>{event.category}</Badge> : null}
          <time
            dateTime={event.date}
            className="text-sm text-muted-foreground tabular-nums"
          >
            {formatOsloDateTime(event.date)}
          </time>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{event.title}</h1>
        {event.location ? (
          <p className="mt-2 text-muted-foreground">{event.location}</p>
        ) : null}
      </header>

      {event.description ? (
        <div className="mt-8 whitespace-pre-wrap leading-relaxed">
          {event.description}
        </div>
      ) : null}

      {isUpcoming ? (
        <Card className="mt-10 bg-card">
          <CardHeader>
            <CardTitle>Meld deg på</CardTitle>
            <CardDescription>
              Fyll inn navn og e-post. Du trenger ikke brukerkonto.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {påmeldt ? (
              <p
                className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-foreground"
                role="status"
              >
                Du er påmeldt. Vi gleder oss til å se deg!
              </p>
            ) : (
              <>
                <EventSignupForm eventId={event.id} />
                {feil ? (
                  <p
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    role="alert"
                  >
                    {feil}
                  </p>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="mt-10 text-sm text-muted-foreground">
          Dette arrangementet har allerede vært, og påmelding er stengt.
        </p>
      )}
    </article>
  );
}
