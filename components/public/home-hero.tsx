import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          Breddeidrett i Ottestad
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Velkommen til Bekkelaget IL
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
          Fotball, hockey, håndball, innebandy, sykling og mer.
          Her finner du nyheter, artikler og kommende arrangementer fra klubben.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="accent">
            <Link href="/arrangementer">Se arrangementer</Link>
          </Button>
          <Button asChild size="lg" variant="heroOutline">
            <Link href="/nyheter">Les nyheter</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
