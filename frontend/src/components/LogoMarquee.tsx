"use client";

const logos = [
  "Nimbus Hotels",
  "Atlas Clinics",
  "Velvet Cafés",
  "Crest Realty",
  "Civic Office",
  "Pulse Telecom",
  "Nova Bank",
  "Cartwheel Retail",
  "Launch SaaS",
  "Bright Academy",
  "Stage Events",
  "Forma Fitness",
];

export default function LogoMarquee() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent dark:from-slate-900" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-slate-900" />
      <div className="flex gap-12">
        <MarqueeRow />
        <MarqueeRow offset={-15} ariaHidden />
      </div>
    </div>
  );
}

function MarqueeRow({ offset = 0, ariaHidden = false }: { offset?: number; ariaHidden?: boolean }) {
  return (
    <div
      className="flex min-w-max items-center gap-10 animate-marquee"
      style={{ animationDelay: `${offset}s` }}
      aria-hidden={ariaHidden}
    >
      {logos.map((logo) => (
        <span
          key={`${logo}-${offset}-${ariaHidden}`}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
        >
          {logo}
        </span>
      ))}
    </div>
  );
}

