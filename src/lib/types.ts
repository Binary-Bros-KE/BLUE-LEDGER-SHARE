export type PricedDocumentKind = "receipt" | "invoice" | "quotation";

export type SharedLineItem = {
  name: string;
  quantity: number;
  unitPriceCents: number;
  discountAmountCents: number;
  lineTotalCents: number;
};

export type TaxType = "vat" | "exempted" | "zero_rated";

export type TaxPricingMode = "inclusive" | "exclusive";

export type TaxBreakdownEntry = {
  taxType: TaxType;
  /** Which pricing mode this row's lines used — "vat" splits into a separate row per mode present.
   * Always null for exempted/zero-rated. */
  pricingMode: TaxPricingMode | null;
  netCents: number;
  taxCents: number;
  grossCents: number;
};

/** Full payment history — only invoices populate this as a table; receipts/quotations leave it
 * empty and keep using the single-payment fields below (paymentMethodName/amountReceivedCents/etc). */
export type SharedPayment = {
  receivedAt: string;
  paymentMethodName: string;
  reference: string | null;
  receivedByName: string;
  amountCents: number;
};

export type SharedDocument = {
  documentKind: PricedDocumentKind;
  businessName: string;
  physicalAddress: string | null;
  primaryPhone: string | null;
  receiptHeader: string | null;
  receiptFooter: string | null;
  currency: string;
  documentNumber: string | null;
  dateLabel: string;
  employeeName: string;
  branchName: string;
  customerName: string | null;
  items: SharedLineItem[];
  extraLines: SharedLineItem[];
  subtotalCents: number;
  discountAmountCents: number;
  taxAmountCents: number;
  /** The subset of taxAmountCents actually ADDED to reach grandTotalCents (exclusive-priced lines
   * only) — what the "Total Tax" summary row shows, computed once server-side. */
  addedTaxCents: number;
  taxBreakdown: TaxBreakdownEntry[];
  /** Whether the Tax Breakdown section should actually render on this document — see SERVER's
   * Sale/Quotation Prisma model doc comment for the same field. taxBreakdown itself is always
   * present regardless. */
  includeTaxBreakdown: boolean;
  /** Whether this document shows ANY shop identity — see SERVER's Sale/Quotation Prisma model doc
   * comment for the same field. When false, businessName/etc. already come through as a generic
   * heading with everything else null/empty — this flag itself isn't needed by any render logic
   * here, just carried through for type parity with SERVER's SharedDocumentResult. */
  includeBusinessInfo: boolean;
  vatRatePercent: number;
  grandTotalCents: number;
  payments: SharedPayment[];
  paymentMethodName: string | null;
  paymentReference: string | null;
  amountReceivedCents: number | null;
  changeGivenCents: number | null;
  dueDate: string | null;
  balanceDueCents: number | null;
  paymentStatus: string | null;
  validUntil: string | null;
  quotationStatus: string | null;
};

/** Mirrors SERVER's SharedDeliveryNoteResult — deliberately carries no fee/cost figures, same as
 * DESKTOP's own DeliveryNoteViewModel. */
export type SharedDeliveryNote = {
  documentKind: "delivery_note";
  businessName: string;
  physicalAddress: string | null;
  primaryPhone: string | null;
  deliveryNoteNumber: string;
  sourceDocumentLabel: string;
  sourceDocumentNumber: string | null;
  dateLabel: string;
  recipientName: string;
  country: string | null;
  town: string | null;
  deliveryAddress: string;
  deliveryNotes: string | null;
  riderName: string | null;
  riderPhone: string | null;
  riderCompany: string | null;
  riderVehicleDescription: string | null;
  isDelivered: boolean;
  deliveredAt: string | null;
};

export type SharedStatementInvoiceLine = {
  id: string;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  grandTotalCents: number;
  amountPaidCents: number;
  balanceDueCents: number;
  paymentStatus: string;
};

/** Mirrors SERVER's SharedStatementResult — every invoice a customer hasn't fully paid off yet,
 * recomputed live, no table of its own. Not tied to one storefront (a customer's invoices can span
 * several), so businessName/etc. are always the tenant-wide default. */
export type SharedStatement = {
  documentKind: "statement";
  businessName: string;
  physicalAddress: string | null;
  primaryPhone: string | null;
  currency: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  creditLimitCents: number | null;
  generatedAt: string;
  invoices: SharedStatementInvoiceLine[];
  totalInvoicedCents: number;
  totalPaidCents: number;
  totalOutstandingCents: number;
};

export type SharedResult = SharedDocument | SharedDeliveryNote | SharedStatement;
