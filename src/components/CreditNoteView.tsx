import { formatCents } from "@/lib/money";
import type { SharedCreditNote } from "@/lib/types";
import { DocumentActions } from "./DocumentActions";

/** A credit note: what was credited, against which invoice or receipt, and how the money was settled
 * (taken off what was owed first, then refunded). Same look as StatementView. */
export function CreditNoteView({ doc, token }: { doc: SharedCreditNote; token: string }) {
  const money = (cents: number) => formatCents(cents, doc.currency);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="print-doc rounded-lg border border-dashed border-navy/20 bg-white p-6 font-mono text-sm text-navy shadow-sm">
        <div className="text-center">
          <p className="text-base font-extrabold">{doc.businessName}</p>
          {doc.physicalAddress && <p className="text-xs text-navy/60">{doc.physicalAddress}</p>}
          {doc.primaryPhone && <p className="text-xs text-navy/60">{doc.primaryPhone}</p>}
        </div>

        <div className="my-3 flex items-center justify-between border-t border-dashed border-navy/20 pt-3">
          <span className="text-xs font-extrabold tracking-wide text-red uppercase">Credit Note</span>
          <span className="text-xs font-bold">{doc.creditNoteNumber}</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4 text-xs leading-relaxed text-navy/70">
          <p>
            <span className="font-bold text-navy">{doc.customerName ?? "Walk-in Customer"}</span>
            <br />
            {new Date(doc.issuedAt).toLocaleDateString()}
          </p>
          <p className="text-right">
            Against {doc.againstKind === "invoice" ? "Invoice" : "Receipt"}
            <br />
            <span className="font-bold text-navy">{doc.againstNumber ?? "-"}</span>
          </p>
        </div>

        <div className="my-3 border-t border-dashed border-navy/20" />
        <div className="space-y-2">
          {doc.items.map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="font-bold text-navy">{item.name}</p>
                <p className="text-navy/50">
                  {item.quantity} × {money(item.unitPriceCents)}
                </p>
              </div>
              <span className="flex-none font-bold">{money(item.lineTotalCents)}</span>
            </div>
          ))}
        </div>

        <div className="my-3 border-t border-dashed border-navy/20" />
        <div className="space-y-1 text-xs">
          <div className="flex justify-between font-extrabold text-navy">
            <span>Total Credited</span>
            <span>{money(doc.totalCents)}</span>
          </div>
          {doc.againstKind === "invoice" && (
            <div className="flex justify-between text-navy/70">
              <span>Taken Off Amount Owed</span>
              <span>{money(doc.balanceReductionCents)}</span>
            </div>
          )}
          <div className="flex justify-between text-navy/70">
            <span>Refunded</span>
            <span>{money(doc.refundCents)}</span>
          </div>
          {doc.invoiceBalanceCents !== null && (
            <div className="flex justify-between font-bold text-navy">
              <span>Invoice Balance Now</span>
              <span>{money(doc.invoiceBalanceCents)}</span>
            </div>
          )}
        </div>

        <div className="my-3 border-t border-dashed border-navy/20" />
        <p className="text-xs text-navy/70">
          <span className="font-bold text-navy">Reason:</span> {doc.reason}
          {doc.approvedByName && <span className="block text-navy/50">Approved by {doc.approvedByName}</span>}
        </p>
      </div>
      <DocumentActions token={token} />
    </div>
  );
}
