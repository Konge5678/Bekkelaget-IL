import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatOsloDateTime } from "@/lib/date";
import { cn, truncateText } from "@/lib/utils";
import Link from "next/link";

const cardInteractive =
  "[@media(hover:hover)]:hover:shadow-md [@media(hover:hover)]:hover:ring-primary/15";
const cardLink =
  "text-sm font-medium text-primary underline-offset-4 [@media(hover:hover)]:hover:underline";

function EmptyMessage({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

type NewsItem = {
  id: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  created_at: string;
};

export function HomeNewsFeed({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return <EmptyMessage>Ingen nyheter publisert ennå.</EmptyMessage>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <Card className={cn("h-full bg-card transition-shadow", cardInteractive)}>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {item.category ? (
                  <Badge className="justify-self-start">{item.category}</Badge>
                ) : null}
                <time
                  dateTime={item.created_at}
                  className="text-xs text-muted-foreground tabular-nums"
                >
                  {formatOsloDateTime(item.created_at)}
                </time>
              </div>
              <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
              {item.excerpt ? (
                <CardDescription className="line-clamp-3">
                  {item.excerpt}
                </CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="pt-0">
              <Link href={`/nyheter/${item.id}`} className={cardLink}>
                Les mer
              </Link>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

type ArticleItem = {
  id: string;
  title: string;
  content: string | null;
};

export function HomeArticlesFeed({ items }: { items: ArticleItem[] }) {
  if (items.length === 0) {
    return <EmptyMessage>Ingen artikler publisert ennå.</EmptyMessage>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const preview = truncateText(item.content);

        return (
        <li key={item.id}>
          <Card
            className={cn(
              "flex h-full flex-col justify-between bg-card transition-shadow",
              cardInteractive,
            )}
          >
            <CardHeader className="gap-2">
              <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
              {preview ? (
                <CardDescription className="line-clamp-3">{preview}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="pt-0">
              <Link href={`/artikler/${item.id}`} className={cardLink}>
                Les artikkel
              </Link>
            </CardContent>
          </Card>
        </li>
        );
      })}
    </ul>
  );
}

type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  category: string | null;
};

export function HomeEventsFeed({ items }: { items: EventItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyMessage>
        Ingen kommende arrangementer akkurat nå. Sjekk igjen senere.
      </EmptyMessage>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.id}>
          <Card
            className={cn(
              "flex flex-col gap-4 bg-card sm:flex-row sm:items-center sm:justify-between",
              cardInteractive,
            )}
          >
            <CardHeader className="flex-1 gap-3 pb-0 sm:pb-4">
              {item.category ? (
                <Badge className="justify-self-start">{item.category}</Badge>
              ) : null}
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription className="space-y-0.5 text-sm">
                <time dateTime={item.date} className="block tabular-nums">
                  {formatOsloDateTime(item.date)}
                </time>
                {item.location ? <span className="block">{item.location}</span> : null}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 sm:pr-6 sm:pb-4">
              <Button asChild variant="accent" className="w-full sm:w-auto">
                <Link href={`/arrangementer/${item.id}`}>Meld deg på</Link>
              </Button>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
