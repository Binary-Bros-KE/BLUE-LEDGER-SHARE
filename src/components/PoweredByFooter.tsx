const MARKETING_SITE_URL = process.env.MARKETING_SITE_URL;

/** Deliberately quiet — this page's whole job is to show the SHARING business's own document, not
 * to sell Blue Ledger. Small muted text below the action buttons, not a banner, not a color, no
 * icon. `MARKETING_SITE_URL` is a plain (non-NEXT_PUBLIC_) server-only env var — this renders in a
 * Server Component, so the value just needs to exist at render time, not ship to the browser as JS —
 * set once in .env.local for now, swapped to the real domain at launch without touching code. */
export function PoweredByFooter() {
  return (
    <div className="no-print mx-auto max-w-md px-4 pb-8 text-center">
      <p className="text-[11px] text-navy/35">
        Powered by Blue Ledger POS
        {MARKETING_SITE_URL && (
          <>
            {" · "}
            <a href={MARKETING_SITE_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-navy/60">
              Get Blue Ledger
            </a>
          </>
        )}
      </p>
    </div>
  );
}
