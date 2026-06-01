import { Badge } from "@/components/ui/badge";
import { formatOsloDateTime } from "@/lib/date";
import { getNewsById } from "@/lib/public/news";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NyhetPage({ params }: Props) {
  const { id } = await params;
  const { news, error } = await getNewsById(id);

  if (error || !news) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/nyheter"
        className="text-sm flex items-center gap-2 font-medium text-primary underline-offset-4 [@media(hover:hover)]:hover:underline"
      >
        <ArrowLeftIcon className="size-4" /> Tilbake til nyheter
      </Link>

      <header className="mt-6 border-b border-border pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {news.category ? <Badge>{news.category}</Badge> : <span />}
          <time
            dateTime={news.created_at}
            className="text-sm text-muted-foreground tabular-nums"
          >
            {formatOsloDateTime(news.created_at)}
          </time>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{news.title}</h1>
        {news.excerpt ? (
          <p className="mt-3 text-lg text-muted-foreground">{news.excerpt}</p>
        ) : null}
      </header>

      <div className="mt-8 whitespace-pre-wrap leading-relaxed">
        {news.content}
      </div>
    </article>
  );
}
