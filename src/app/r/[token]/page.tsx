import { AlertTriangle } from "lucide-react";
import { getSharedDocument } from "@/lib/api";
import { DocumentView } from "@/components/DocumentView";

export default async function SharedDocumentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const doc = await getSharedDocument(token);

  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="grid size-14 place-items-center rounded-full border border-dashed border-navy/25 text-navy/40">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </div>
        <p className="font-display text-lg text-navy">This link has expired or is no longer valid</p>
        <p className="max-w-xs text-sm text-navy/50">Ask the business to send you a new share link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-dark">
      <header className="no-print bg-navy px-4 py-4 text-center text-white">
        <span className="font-display text-sm">BLUE LEDGER</span>
      </header>
      <DocumentView doc={doc} />
    </div>
  );
}
