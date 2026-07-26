"use client";

import { useRef, useState } from "react";
import { Download, Printer } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Download and Print are deliberately two separate actions now, not one "Print / Save as PDF"
 * button that opened the browser's print dialog for everything:
 * - Download hits SERVER's /share/:token/download directly — that route renders a real PDF
 *   (puppeteer) and serves it with Content-Disposition: attachment, so the browser just saves the
 *   file immediately under the right name, no dialog, no typing a filename.
 * - Print loads the same letterhead HTML DESKTOP itself would generate into a hidden same-origin
 *   iframe (via /api/print, so cross-origin restrictions on iframe.contentWindow.print() and
 *   SERVER's own frame-blocking headers don't apply — see that route's own comment) and prints
 *   just that frame, for an actual physical printer or a manual "save as PDF" via the print dialog.
 */
export function DocumentActions({ token }: { token: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  function handlePrint(): void {
    if (!ready) return;
    iframeRef.current?.contentWindow?.print();
  }

  function handleDownloadClick(): void {
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 5000);
  }

  return (
    <div className="no-print mt-4">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`${API_URL}/share/${token}/download`}
          onClick={handleDownloadClick}
          className="flex items-center justify-center gap-2 rounded-lg border border-navy/20 bg-white py-3 text-xs font-bold tracking-wide text-navy transition hover:bg-navy/5"
        >
          <Download className="size-4" aria-hidden="true" />
          Download
        </a>
        <button
          type="button"
          onClick={handlePrint}
          disabled={!ready}
          className="flex items-center justify-center gap-2 rounded-lg bg-navy py-3 text-xs font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Printer className="size-4" aria-hidden="true" />
          Print
        </button>
      </div>
      {downloaded && <p className="mt-2 text-center text-xs text-navy/50">Check your Downloads folder.</p>}
      <iframe ref={iframeRef} src={`/api/print/${token}`} onLoad={() => setReady(true)} className="hidden" title="Print" />
    </div>
  );
}
