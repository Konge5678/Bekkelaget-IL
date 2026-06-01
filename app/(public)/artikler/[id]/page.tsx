import { getArticleById } from "@/lib/public/articles";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArtikkelPage({ params }: Props) {
  const { id } = await params;
  const { article, error } = await getArticleById(id);

  if (error || !article) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/artikler"
        className="flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 [@media(hover:hover)]:hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Tilbake til artikler
      </Link>

      <header className="mt-6 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
      </header>

      <div className="mt-8 whitespace-pre-wrap leading-relaxed">
        {article.content}
      </div>

      {article.contact_person || article.contact_email ? (
        <footer className="mt-10 rounded-xl border border-border bg-card p-4 text-sm">
          <p className="font-medium">Kontakt</p>
          {article.contact_person ? (
            <p className="mt-1 text-muted-foreground">{article.contact_person}</p>
          ) : null}
          {article.contact_email ? (
            <p className="mt-1">
              <a
                href={`mailto:${article.contact_email}`}
                className="text-primary underline-offset-4 [@media(hover:hover)]:hover:underline"
              >
                {article.contact_email}
              </a>
            </p>
          ) : null}
        </footer>
      ) : null}
    </article>
  );
}
