import type { SharedDocument } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Runs server-side (this page is a Server Component) — no auth header, no token storage, the
 * token in the URL IS the whole request. `cache: "no-store"`: every visit must see the document's
 * current state, never a stale cached copy. Returns null for anything that isn't a clean 200
 * (expired, tampered, or genuinely missing) — the page shows one generic "link no longer valid"
 * state for all of them, deliberately not distinguishing which, same as any other share-link
 * product (no reason to help someone probe why a token failed). */
export async function getSharedDocument(token: string): Promise<SharedDocument | null> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  const res = await fetch(`${API_URL}/share/${encodeURIComponent(token)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as SharedDocument;
}
