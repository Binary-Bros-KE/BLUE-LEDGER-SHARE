import { formatDocumentDate, formatDocumentDateTime } from "@/lib/date";
import { formatCents } from "@/lib/money";
import { taxBreakdownLabel } from "@/lib/tax";
import type { SharedDocument } from "@/lib/types";
import { DocumentActions } from "./DocumentActions";

const DOCUMENT_KIND_LABEL: Record<SharedDocument["documentKind"], string> = {
  receipt: "Receipt",
  invoice: "Invoice",
  quotation: "Quotation",
};

const STATUS_TONE: Record<string, string> = {
  paid: "border-green text-green",
  accepted: "border-green text-green",
  converted: "border-green text-green",
  overdue: "border-red text-red",
  rejected: "border-red text-red",
  expired: "border-red text-red",
  cancelled: "border-red text-red",
  partially_paid: "border-gold text-gold-text",
  sent: "border-blue text-blue",
};

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DocumentView({ doc, token }: { doc: SharedDocument; token: string }) {
  const money = (cents: number | null) => (cents === null ? "-" : formatCents(cents, doc.currency));
  const status = doc.paymentStatus ?? doc.quotationStatus;
  const statusTone = status ? (STATUS_TONE[status] ?? "border-navy/30 text-navy/50") : null;

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="print-doc rounded-lg border border-dashed border-navy/20 bg-white p-6 font-mono text-sm text-navy shadow-sm">
        <div className="text-center">
          <p className="text-base font-extrabold">{doc.businessName}</p>
          {doc.physicalAddress && <p className="text-xs text-navy/60">{doc.physicalAddress}</p>}
          {doc.primaryPhone && <p className="text-xs text-navy/60">{doc.primaryPhone}</p>}
          {doc.receiptHeader && <p className="mt-1 text-xs text-navy/60">{doc.receiptHeader}</p>}
        </div>

        <div className="my-3 flex items-center justify-between border-t border-dashed border-navy/20 pt-3">
          <span className="text-xs font-extrabold tracking-wide uppercase">{DOCUMENT_KIND_LABEL[doc.documentKind]}</span>
          {status && statusTone && (
            <span className={`rounded-full border border-dashed px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${statusTone}`}>
              {formatStatus(status)}
            </span>
          )}
        </div>

        <p className="text-xs leading-relaxed text-navy/70">
          {DOCUMENT_KIND_LABEL[doc.documentKind]}: {doc.documentNumber ?? "-"}
          <br />
          Date: {formatDocumentDateTime(doc.dateLabel)}
          <br />
          Served by: {doc.employeeName} · Branch: {doc.branchName}
          {doc.customerName && (
            <>
              <br />
              Customer: {doc.customerName}
            </>
          )}
          {doc.dueDate && (
            <>
              <br />
              Due: {formatDocumentDate(doc.dueDate)}
            </>
          )}
          {doc.validUntil && (
            <>
              <br />
              Valid until: {formatDocumentDate(doc.validUntil)}
            </>
          )}
        </p>

        <div className="my-3 border-t border-dashed border-navy/20" />
        <div className="space-y-2">
          {[...doc.items, ...doc.extraLines].map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-bold">{item.name}</p>
                <p className="text-xs text-navy/50">
                  {item.quantity} x {money(item.unitPriceCents)}
                </p>
              </div>
              <p className="flex-none font-bold">{money(item.lineTotalCents)}</p>
            </div>
          ))}
        </div>

        <div className="my-3 border-t border-dashed border-navy/20" />
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{money(doc.subtotalCents)}</span>
          </div>
          {doc.discountAmountCents > 0 && (
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-{money(doc.discountAmountCents)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-extrabold">
            <span>Total</span>
            <span>{money(doc.grandTotalCents)}</span>
          </div>
          {doc.balanceDueCents !== null && doc.balanceDueCents > 0 && (
            <div className="flex justify-between font-bold text-red">
              <span>Balance Due</span>
              <span>{money(doc.balanceDueCents)}</span>
            </div>
          )}
        </div>

        {doc.payments.length > 0 && (
          <>
            <div className="my-3 border-t border-dashed border-navy/20" />
            <p className="mb-1.5 text-[10px] font-extrabold tracking-wide text-navy/50 uppercase">Payments Made</p>
            <div className="space-y-2 text-xs">
              {doc.payments.map((payment, index) => (
                <div key={index} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold">{payment.paymentMethodName}</p>
                    <p className="text-navy/50">
                      {formatDocumentDate(payment.receivedAt)} · {payment.receivedByName}
                      {payment.reference && ` · Ref: ${payment.reference}`}
                    </p>
                  </div>
                  <p className="flex-none font-bold">{money(payment.amountCents)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {doc.taxBreakdown.length > 0 && (
          <>
            <div className="my-3 border-t border-dashed border-navy/20" />
            <p className="mb-1.5 text-[10px] font-extrabold tracking-wide text-navy/50 uppercase">Tax Breakdown</p>
            <div className="space-y-1 text-xs">
              {doc.taxBreakdown.map((entry) => (
                <div key={entry.taxType} className="flex justify-between gap-2">
                  <span className="font-bold">{taxBreakdownLabel(entry.taxType, doc.vatRatePercent)}</span>
                  <span className="text-navy/70">
                    Net {money(entry.netCents)} / Tax {money(entry.taxCents)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {(doc.paymentMethodName || doc.paymentReference || doc.amountReceivedCents !== null) && (
          <>
            <div className="my-3 border-t border-dashed border-navy/20" />
            <p className="text-xs leading-relaxed text-navy/70">
              Payment: {doc.paymentMethodName ?? "-"}
              {doc.paymentReference && (
                <>
                  <br />
                  Ref: {doc.paymentReference}
                </>
              )}
              {doc.amountReceivedCents !== null && (
                <>
                  <br />
                  Received: {money(doc.amountReceivedCents)}
                </>
              )}
              {doc.changeGivenCents !== null && doc.changeGivenCents > 0 && (
                <>
                  <br />
                  Change: {money(doc.changeGivenCents)}
                </>
              )}
            </p>
          </>
        )}

        <div className="my-3 border-t border-dashed border-navy/20" />
        <p className="text-center text-xs text-navy/50">{doc.receiptFooter ?? "Thank you for your business!"}</p>
      </div>

      <DocumentActions token={token} />
    </div>
  );
}
