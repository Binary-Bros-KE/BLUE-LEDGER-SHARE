import type { SharedResult } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** SERVER hands back a distinct status per real cause (see share-service.ts): 410 means the
 * ShareLink row itself is gone or past its expiresAt, 404 means the link is fine but the document it
 * points to no longer exists (e.g. a sale was deleted), anything else is treated as a transient
 * failure worth retrying once — a dev-server restart or a momentary network blip shouldn't read to
 * the visitor as "get a new link", which is what collapsing every non-OK response into one generic
 * `null` used to do. */
export type SharedDocumentOutcome =
  | { status: "ok"; doc: SharedResult }
  | { status: "expired" }
  | { status: "not_found" }
  | { status: "error" };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Runs server-side (this page is a Server Component) — no auth header, no token storage, the token
 * in the URL IS the whole request. `cache: "no-store"`: every visit must see the document's current
 * state, never a stale cached copy. One retry after a short delay covers the "request landed exactly
 * while the API was restarting" case without making a genuinely expired/missing link look retryable. */
export async function getSharedDocument(token: string): Promise<SharedDocumentOutcome> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${API_URL}/share/${encodeURIComponent(token)}`, { cache: "no-store" });
      if (res.status === 410) return { status: "expired" };
      if (res.status === 404) return { status: "not_found" };
      if (res.ok) return { status: "ok", doc: (await res.json()) as SharedResult };
      // Any other status (5xx, rate limiting, etc.) — worth one retry before giving up.
    } catch {
      // A thrown fetch (connection refused, timeout) — same retry treatment.
    }
    if (attempt === 0) await sleep(600);
  }

  return { status: "error" };
}
