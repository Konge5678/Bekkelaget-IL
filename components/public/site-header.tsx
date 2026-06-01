"use client";

import { publicNavLinks } from "@/components/public/nav-links";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function useIsActive(href: string) {
  const pathname = usePathname();
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function DesktopNavLink({ href, label }: { href: string; label: string }) {
  const isActive = useIsActive(href);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-primary-foreground hover:bg-accent/20 hover:text-accent",
      )}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  const isActive = useIsActive(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "block w-full rounded-lg px-4 py-3.5 text-base font-medium transition-colors",
        isActive
          ? "bg-accent text-accent-foreground shadow-sm"
          : "text-primary-foreground",
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="border-b border-accent/30 bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight md:hover:text-accent"
          onClick={closeMenu}
        >
          Bekkelaget IL
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Hovedmeny">
          {publicNavLinks.map((link) => (
            <DesktopNavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-10 shrink-0 md:hidden",
            open
              ? "bg-accent text-accent-foreground"
              : "text-primary-foreground",
          )}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Lukk meny" : "Åpne meny"}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-accent/25 bg-primary px-4 pb-5 pt-3 md:hidden"
          aria-label="Mobilmeny"
        >
          <ul className="flex flex-col gap-2">
            {publicNavLinks.map((link) => (
              <li key={link.href} className="w-full">
                <MobileNavLink
                  href={link.href}
                  label={link.label}
                  onNavigate={closeMenu}
                />
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
