const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Same-origin proxy for SERVER's GET /share/:token/print. The document iframe (see
 * DocumentFrame.tsx) needs this to be same-origin with the SHARE app itself — calling
 * `.print()` on a cross-origin iframe's contentWindow throws a SecurityError, since `print` isn't
 * one of the handful of methods the WindowProxy spec allows cross-origin (postMessage/blur/
 * close/focus/location only). Proxying through this route keeps the iframe's origin as
 * localhost:3300 (this app) instead of SERVER's own origin, so same-origin print access just works. */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!API_URL) {
    return new Response("NEXT_PUBLIC_API_URL is not configured", { status: 500 });
  }

  const upstream = await fetch(`${API_URL}/share/${encodeURIComponent(token)}/print`, { cache: "no-store" });
  const html = await upstream.text();
  return new Response(html, {
    status: upstream.status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
