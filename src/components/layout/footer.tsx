import Link from "next/link"

import { SITE } from "@/lib/constants"
import { Container } from "@/components/layout/container"
import { Logo } from "@/components/layout/logo"
import { Separator } from "@/components/ui/separator"

const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { href: "/build", label: "Build a Box" },
      { href: "/#featured", label: "Featured boxes" },
      { href: "/#occasions", label: "Occasions" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#stories", label: "Stories" },
      { href: `mailto:${SITE.email}`, label: "Corporate gifts" },
    ],
  },
] as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <Container className="py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <Logo variant="lockup" />
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {SITE.tagline}
            </p>
            <p className="text-xs text-zinc-400">{SITE.deliveryNote}</p>
            <div className="space-y-1 pt-2 text-sm text-zinc-500">
              <p>
                <a className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </p>
              <p>{SITE.phone}</p>
              <p>{SITE.city}</p>
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex flex-col gap-2 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Premium personalized gift boxes.
          </p>
          <p>PayHere · Surprise-safe checkout · Island-wide on request</p>
        </div>
      </Container>
    </footer>
  )
}
