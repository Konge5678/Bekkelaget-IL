import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Kontaktinfo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Bekkelaget IL
            <br />
            Ottestad
            <br />
            E-post: post@bekkelaget-il.no
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Sosiale medier</h2>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Følg oss på Facebook
          </a>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">For redaktører</h2>
          <Link
            href="/admin"
            className="mt-2 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Gå til redaktørpanel
          </Link>
        </div>
      </div>
    </footer>
  );
}
