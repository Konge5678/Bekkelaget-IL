import Link from "next/link";
import type { ReactNode } from "react";

type HomeSectionProps = {
  title: string;
  href: string;
  linkLabel: string;
  children: ReactNode;
};

export function HomeSection({
  title,
  href,
  linkLabel,
  children,
}: HomeSectionProps) {
  return (
    <section className="py-10 sm:py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <Link
          href={href}
          className="text-sm font-medium text-primary underline-offset-4 [@media(hover:hover)]:hover:underline"
        >
          {linkLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}
