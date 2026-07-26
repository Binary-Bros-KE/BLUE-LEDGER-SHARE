import { AlertTriangle, RefreshCw } from "lucide-react";
import { getSharedDocument } from "@/lib/api";
import { DeliveryNoteView } from "@/components/DeliveryNoteView";
import { DocumentView } from "@/components/DocumentView";
import { PoweredByFooter } from "@/components/PoweredByFooter";
import { StatementView } from "@/components/StatementView";

const ERROR_COPY = {
  expired: {
    title: "This link has expired or is no longer valid",
    body: "Ask the business to send you a new share link.",
  },
  not_found: {
    title: "This document is no longer available",
    body: "It may have been removed. Ask the business to send you a new share link.",
  },
  error: {
    title: "Something went wrong loading this document",
    body: "This is likely temporary — please try again in a moment.",
  },
} as const;

export default async function SharedDocumentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const outcome = await getSharedDocument(token);

  if (outcome.status !== "ok") {
    const copy = ERROR_COPY[outcome.status];
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="grid size-14 place-items-center rounded-full border border-dashed border-navy/25 text-navy/40">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </div>
        <p className="font-display text-lg text-navy">{copy.title}</p>
        <p className="max-w-xs text-sm text-navy/50">{copy.body}</p>
        {outcome.status === "error" && (
          <a
            href={`/r/${token}`}
            className="mt-1 flex items-center gap-1.5 rounded-lg border border-navy/20 px-3 py-1.5 text-xs font-bold text-navy hover:bg-navy/5"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Try again
          </a>
        )}
        <div className="mt-6">
          <PoweredByFooter />
        </div>
      </div>
    );
  }

  const { doc } = outcome;

  return (
    <div className="min-h-screen bg-cream-dark">
      <header className="no-print bg-navy px-4 py-4 text-center text-white">
        <span className="font-display text-sm">BLUE LEDGER POS</span>
      </header>
      {doc.documentKind === "delivery_note" ? (
        <DeliveryNoteView doc={doc} token={token} />
      ) : doc.documentKind === "statement" ? (
        <StatementView doc={doc} token={token} />
      ) : (
        <DocumentView doc={doc} token={token} />
      )}
      <PoweredByFooter />
    </div>
  );
}
