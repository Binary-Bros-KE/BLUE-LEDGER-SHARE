"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-xs font-bold tracking-wide text-white transition hover:bg-navy-deep"
    >
      <Printer className="size-4" aria-hidden="true" />
      Print / Save as PDF
    </button>
  );
}
