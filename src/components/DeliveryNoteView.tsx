import type { SharedDeliveryNote } from "@/lib/types";
import { DocumentActions } from "./DocumentActions";

export function DeliveryNoteView({ doc, token }: { doc: SharedDeliveryNote; token: string }) {
  const townCountry = [doc.town, doc.country].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="print-doc rounded-lg border border-dashed border-navy/20 bg-white p-6 font-mono text-sm text-navy shadow-sm">
        <div className="text-center">
          <p className="text-base font-extrabold">{doc.businessName}</p>
          {doc.physicalAddress && <p className="text-xs text-navy/60">{doc.physicalAddress}</p>}
          {doc.primaryPhone && <p className="text-xs text-navy/60">{doc.primaryPhone}</p>}
        </div>

        <div className="my-3 flex items-center justify-between border-t border-dashed border-navy/20 pt-3">
          <span className="text-xs font-extrabold tracking-wide uppercase">Delivery Note</span>
          <span
            className={`rounded-full border border-dashed px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${
              doc.isDelivered ? "border-green text-green" : "border-gold text-gold-text"
            }`}
          >
            {doc.isDelivered ? "Delivered" : "Pending"}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-navy/70">
          Delivery Note: {doc.deliveryNoteNumber}
          <br />
          {doc.sourceDocumentLabel}: {doc.sourceDocumentNumber ?? "-"}
          <br />
          Date: {new Date(doc.dateLabel).toLocaleString()}
        </p>

        <div className="my-3 border-t border-dashed border-navy/20" />
        <p className="text-[11px] font-extrabold tracking-wide uppercase text-navy/50">Deliver To</p>
        <p className="mt-1 text-xs leading-relaxed text-navy/70">
          <span className="font-bold text-navy">{doc.recipientName}</span>
          <br />
          {doc.deliveryAddress}
          {townCountry && (
            <>
              <br />
              {townCountry}
            </>
          )}
          {doc.deliveryNotes && (
            <>
              <br />
              Notes: {doc.deliveryNotes}
            </>
          )}
        </p>

        {doc.riderName && (
          <>
            <div className="my-3 border-t border-dashed border-navy/20" />
            <p className="text-[11px] font-extrabold tracking-wide uppercase text-navy/50">Rider</p>
            <p className="mt-1 text-xs leading-relaxed text-navy/70">
              <span className="font-bold text-navy">{doc.riderName}</span>
              {doc.riderPhone && (
                <>
                  <br />
                  {doc.riderPhone}
                </>
              )}
              {doc.riderCompany && (
                <>
                  <br />
                  {doc.riderCompany}
                </>
              )}
              {doc.riderVehicleDescription && (
                <>
                  <br />
                  {doc.riderVehicleDescription}
                </>
              )}
            </p>
          </>
        )}

        <div className="my-3 border-t border-dashed border-navy/20" />
        <p className="text-center text-xs text-navy/50">No pricing shown — see the {doc.sourceDocumentLabel.toLowerCase()} for payment details.</p>
      </div>

      <DocumentActions token={token} />
    </div>
  );
}
