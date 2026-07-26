import { formatCents } from "@/lib/money";
import type { SharedStatement } from "@/lib/types";
import { DocumentActions } from "./DocumentActions";

const STATUS_TONE: Record<string, string> = {
  overdue: "border-red text-red",
  cancelled: "border-navy/30 text-navy/50",
  partially_paid: "border-gold text-gold-text",
  unpaid: "border-blue text-blue",
};

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatementView({ doc, token }: { doc: SharedStatement; token: string }) {
  const money = (cents: number) => formatCents(cents, doc.currency);
  const availableCreditCents = doc.creditLimitCents !== null ? Math.max(0, doc.creditLimitCents - doc.totalOutstandingCents) : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="print-doc rounded-lg border border-dashed border-navy/20 bg-white p-6 font-mono text-sm text-navy shadow-sm">
        <div className="text-center">
          <p className="text-base font-extrabold">{doc.businessName}</p>
          {doc.physicalAddress && <p className="text-xs text-navy/60">{doc.physicalAddress}</p>}
          {doc.primaryPhone && <p className="text-xs text-navy/60">{doc.primaryPhone}</p>}
        </div>

        <div className="my-3 flex items-center justify-between border-t border-dashed border-navy/20 pt-3">
          <span className="text-xs font-extrabold tracking-wide uppercase">Statement</span>
          <span className="text-xs text-navy/50">{new Date(doc.generatedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="text-xs leading-relaxed text-navy/70">
            <span className="font-bold text-navy">{doc.customerName}</span>
            <br />
            {doc.customerPhone}
            {doc.customerEmail && (
              <>
                <br />
                {doc.customerEmail}
              </>
            )}
          </p>
          {doc.creditLimitCents !== null && availableCreditCents !== null && (
            <p className="text-right text-xs leading-relaxed text-navy/70">
              Credit Limit
              <br />
              <span className="font-bold text-navy">{money(doc.creditLimitCents)}</span>
              <br />
              Available: {money(availableCreditCents)}
            </p>
          )}
        </div>

        <div className="my-3 border-t border-dashed border-navy/20" />
        <div className="space-y-2">
          {doc.invoices.length === 0 ? (
            <p className="text-center text-xs text-navy/50">No outstanding invoices</p>
          ) : (
            doc.invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-bold">{invoice.invoiceNumber ?? "-"}</p>
                  <p className="text-xs text-navy/50">
                    Due {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
                    {" · "}
                    <span className={`rounded-full border border-dashed px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${STATUS_TONE[invoice.paymentStatus] ?? "border-navy/30 text-navy/50"}`}>
                      {formatStatus(invoice.paymentStatus)}
                    </span>
                  </p>
                </div>
                <p className="flex-none font-bold">{money(invoice.balanceDueCents)}</p>
              </div>
            ))
          )}
        </div>

        <div className="my-3 border-t border-dashed border-navy/20" />
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Total Invoiced</span>
            <span>{money(doc.totalInvoicedCents)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Paid</span>
            <span>{money(doc.totalPaidCents)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold">
            <span>Total Outstanding</span>
            <span>{money(doc.totalOutstandingCents)}</span>
          </div>
        </div>
      </div>

      <DocumentActions token={token} />
    </div>
  );
}
