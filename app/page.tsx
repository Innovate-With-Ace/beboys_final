import Link from "next/link";
import { Anton, Caveat, Work_Sans } from "next/font/google";
import {
  Clock,
  MapPin,
  Phone,
  Soup,
  Leaf,
  Wallet,
  Banknote,
  CalendarX,
  Bike,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabaseAdmin } from "@/lib/supabase/server";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const chalk = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chalk",
});

const body = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const HOURS = [
  { day: "Monday – Saturday", time: "6:00 AM – 7:00 PM" },
  { day: "Sunday", time: "7:00 AM – 2:00 PM" },
];

const REASONS = [
  {
    icon: Soup,
    title: "Cooked once, every morning",
    body: "The first batch is out around 6am. When a dish is gone, it comes off the board — nothing sits reheating for the evening rush.",
  },
  {
    icon: Leaf,
    title: "Recipes that haven't changed",
    body: "Same adobo, sinigang, and sisig the family has made for years. No cut corners on the ingredients to stretch a batch further.",
  },
  {
    icon: Wallet,
    title: "Priced to eat here daily",
    body: "A rice meal stays affordable enough to be a weekday habit, not something saved for a special occasion.",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Walk up to the counter",
    body: "No app, no reservation — just come by during open hours.",
  },
  {
    title: "Point at what's on the board",
    body: "The board only lists what's actually cooked and left for today.",
  },
  {
    title: "Pay cash, get your summary",
    body: "We're not BIR-accredited yet, so you'll get an order summary rather than an official receipt.",
  },
  {
    title: "Eat in or take it to go",
    body: "Take your plate to a table, or have it packed up on your way out.",
  },
];

const FAQS = [
  {
    icon: Banknote,
    q: "Do you accept cards or e-wallets?",
    a: "Cash only for now.",
  },
  {
    icon: CalendarX,
    q: "Can I order ahead?",
    a: "Not yet — there's no online ordering, so it's first-come, first-served at the counter.",
  },
  {
    icon: Bike,
    q: "Do you deliver?",
    a: "No delivery. Walk-in only, at our one branch beside the barangay hall.",
  },
];

type DishRow = {
  id: string;
  name: string;
  price: number;
  servings_left: number;
  category_id: string | null;
};

type CategoryRow = { id: string; label: string };

async function getTodaysBoard() {
  try {
    const [{ data: dishes }, { data: categories }] = await Promise.all([
      supabaseAdmin
        .from("dishes")
        .select("id, name, price, servings_left, category_id")
        .eq("is_available", true)
        .order("name", { ascending: true }),
      supabaseAdmin.from("categories").select("id, label"),
    ]);

    const categoryLabels = new Map(
      ((categories as CategoryRow[] | null) ?? []).map((c) => [c.id, c.label]),
    );

    const groups = new Map<string, DishRow[]>();
    for (const dish of (dishes as DishRow[] | null) ?? []) {
      const label =
        categoryLabels.get(dish.category_id ?? "") ?? "Today's board";
      groups.set(label, [...(groups.get(label) ?? []), dish]);
    }

    return [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, items]) => ({ label, items }));
  } catch {
    return [];
  }
}

export default async function Page() {
  const board = await getTodaysBoard();
  const dishCount = board.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div
      className={`${display.variable} ${chalk.variable} ${body.variable} lp-body overflow-x-hidden bg-background text-foreground`}
    >
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Soup className="h-4 w-4" />
            </div>
            <span className="lp-display text-xl tracking-wide">
              Beboy&apos;s
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#menu" className="transition-colors hover:text-primary">
              Today&apos;s board
            </a>
            <a href="#why" className="transition-colors hover:text-primary">
              Why us
            </a>
            <a href="#visit" className="transition-colors hover:text-primary">
              Hours &amp; location
            </a>
          </nav>
          <Button
            render={<Link href="/login" />}
            size="sm"
            variant="outline"
            className="rounded-full border-border hover:bg-muted"
          >
            Staff login
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-background pt-16 sm:pt-24 lg:pt-32">
          {/* Subtle Background Glow */}
          <div
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-brand-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-center">
              {/* Left Copy */}
              <div className="lp-ink max-w-xl lg:shrink-0 xl:max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                  </span>
                  First batch at 6am
                </div>
                <h1 className="lp-display mt-8 text-5xl tracking-tight sm:text-6xl lg:text-7xl">
                  Home-cooked ulam, <br />
                  <span className="text-brand-secondary">
                    written on the board.
                  </span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  Same corner by the barangay hall, same family recipes. We cook
                  once a day and serve until it runs out — no steam tables, no
                  shortcuts.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Button
                    render={<a href="#menu" />}
                    size="lg"
                    className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    See today&apos;s board
                  </Button>
                  <a
                    href="#visit"
                    className="group flex items-center gap-2 text-sm font-semibold leading-6 text-foreground transition-colors hover:text-primary"
                  >
                    Visit us{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>

              {/* Right: The Board Card */}
              <div id="menu" className="scroll-mt-32">
                <article className="relative rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8 lg:p-10">
                  <div className="flex items-center justify-between border-b border-border/50 pb-5 sm:pb-6">
                    <h2 className="lp-display text-xl sm:text-2xl">
                      Today&apos;s Lineup
                    </h2>
                    <span className="lp-chalk-hand text-lg text-muted-foreground rotate-2 sm:text-xl">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </span>
                  </div>

                  {dishCount === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Soup className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Still writing today&apos;s board.
                        <br />
                        Check back closer to opening.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-7 sm:space-y-8">
                      {board.map((group) => (
                        <div key={group.label}>
                          {board.length > 1 && (
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                              {group.label}
                            </h3>
                          )}
                          <ul className="space-y-3 sm:space-y-4">
                            {group.items.map((dish) => {
                              const soldOut = dish.servings_left <= 0;
                              const lowStock =
                                !soldOut && dish.servings_left <= 3;
                              return (
                                <li
                                  key={dish.id}
                                  className={`group flex items-center gap-3 rounded-xl transition-opacity sm:gap-4 ${
                                    soldOut ? "opacity-50" : ""
                                  }`}
                                >
                                  <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10"
                                    aria-hidden="true"
                                  >
                                    <Soup className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="lp-chalk-hand block truncate text-xl font-medium tracking-wide sm:text-2xl">
                                      {dish.name}
                                    </span>
                                    {lowStock && (
                                      <span className="text-xs font-semibold text-warning">
                                        Only {dish.servings_left} left
                                      </span>
                                    )}
                                  </div>
                                  <div className="hidden h-[1px] flex-1 bg-gradient-to-r from-border to-transparent opacity-50 sm:block" />
                                  {soldOut ? (
                                    <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                      Sold Out
                                    </span>
                                  ) : (
                                    <data
                                      value={dish.price}
                                      className="shrink-0 font-mono font-semibold text-brand-secondary"
                                    >
                                      {peso.format(dish.price)}
                                    </data>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-8 rounded-xl bg-muted/50 p-4 text-center">
                    <p className="text-xs font-medium text-muted-foreground">
                      First come, first served. The board updates as things sell
                      out.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mt-32 overflow-hidden sm:mt-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-3xl bg-muted px-6 py-16 sm:p-20 lg:flex lg:items-center lg:gap-x-20">
              <div className="lg:w-1/2">
                <p className="lp-chalk-hand text-2xl text-brand-secondary">
                  a little about us
                </p>
                <h2 className="lp-display mt-4 text-4xl sm:text-5xl">
                  One counter, one kitchen, no branches.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  We&apos;re a single-branch eatery beside the barangay hall,
                  run the same way a family kitchen is run: whoever&apos;s
                  cooking that morning decides what goes on the board, and it
                  stays that way until the pot&apos;s empty. No central kitchen,
                  no franchise recipes — just what&apos;s good that day.
                </p>
              </div>
              <div className="mt-12 lg:mt-0 lg:w-1/2">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="aspect-square rounded-2xl bg-border/50" />
                  <div className="aspect-square rounded-2xl bg-border/50 translate-y-8" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us - Grid Layout */}
        <section id="why" className="scroll-mt-24 mt-32 sm:mt-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="lp-display text-4xl sm:text-5xl">
                Why people come back
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We keep things simple so the food speaks for itself.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {REASONS.map((r) => (
                  <div
                    key={r.title}
                    className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <r.icon
                          className="h-6 w-6 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="lp-display tracking-wide">
                        {r.title}
                      </span>
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                      <p className="flex-auto">{r.body}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* How it works - Step Cards */}
        <section className="mt-32 sm:mt-40 border-t border-border bg-muted/30 pt-20 pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="lp-display text-center text-4xl sm:text-5xl">
              First time here?
            </h2>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-4">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.title} className="relative pl-6">
                  <div className="absolute left-0 top-0 text-6xl font-black text-border/40 select-none">
                    {i + 1}
                  </div>
                  <div className="relative pt-6">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hours & Location Bento Box */}
        <section id="visit" className="scroll-mt-24 mt-32 sm:mt-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="lp-display text-4xl sm:text-5xl mb-12">
              Come hungry
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Hours Card */}
              <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary/10">
                    <Clock className="h-6 w-6 text-brand-secondary" />
                  </div>
                  <h3 className="lp-display text-2xl">Operating Hours</h3>
                </div>
                <div className="space-y-6">
                  {HOURS.map((row) => (
                    <div
                      key={row.day}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4 last:border-0"
                    >
                      <span className="text-muted-foreground">{row.day}</span>
                      <span className="font-semibold text-lg">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Card */}
              <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="lp-display text-2xl">Find Us</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-8">
                  Beside the barangay hall — look for the green awning.
                </p>

                <div className="flex items-center gap-4 border-t border-border/50 pt-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Phone className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Call ahead
                    </p>
                    <p className="font-semibold text-lg">
                      (add contact number)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-32 sm:mt-40 mb-32">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="lp-display text-4xl sm:text-5xl text-center mb-16">
              Good to know
            </h2>
            <div className="space-y-6">
              {FAQS.map((f) => (
                <div
                  key={f.q}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex gap-4">
                    <f.icon
                      className="mt-1 h-6 w-6 shrink-0 text-primary"
                      aria-hidden
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{f.q}</h4>
                      <p className="mt-2 text-muted-foreground">{f.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative isolate overflow-hidden bg-primary px-6 py-24 text-center sm:py-32 lg:px-8">
          <h2 className="lp-display text-4xl text-primary-foreground sm:text-5xl">
            See you at the counter today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
            No reservations, no delivery — just walk in while it&apos;s still
            hot.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Button
              render={<a href="#menu" />}
              size="lg"
              variant="secondary"
              className="rounded-full bg-background text-foreground hover:bg-background/90"
            >
              Check the board again
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row lg:px-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Soup className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">
              Beboy&apos;s Kagawad&apos;s Best Eatery
            </span>
          </div>
          <span>Mon–Sat 6am–7pm · Sun 7am–2pm</span>
        </div>
      </footer>

      <style>{`
        .lp-body { font-family: var(--font-body), sans-serif; }
        .lp-display { font-family: var(--font-display), sans-serif; }
        .lp-chalk-hand { font-family: var(--font-chalk), cursive; }

        @media (prefers-reduced-motion: no-preference) {
          .lp-ink h1 {
            animation: lp-rise 0.6s ease-out forwards;
          }
        }
        @keyframes lp-rise {
          from { opacity: 0; transform: translateY(12px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}
