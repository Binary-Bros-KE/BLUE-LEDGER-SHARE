export type PricedDocumentKind = "receipt" | "invoice" | "quotation";

export type SharedLineItem = { name: string; quantity: number; unitPriceCents: number; lineTotalCents: number };

export type TaxType = "vat" | "exempted" | "zero_rated";

export type TaxBreakdownEntry = {
  taxType: TaxType;
  netCents: number;
  taxCents: number;
  grossCents: number;
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
  taxBreakdown: TaxBreakdownEntry[];
  vatRatePercent: number;
  grandTotalCents: number;
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
