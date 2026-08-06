import React from "react";
import { Download, Calendar } from "lucide-react";

export function ReportsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reports & Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gain insights into sales performance, inventory levels, and
          operational metrics.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-card border border-border/80 rounded-lg px-3 py-2 text-xs font-medium text-foreground shadow-xs cursor-pointer">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>This Month</span>
        </div>

        <button className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-3.5 py-2 rounded-lg shadow-sm hover:opacity-95 transition-opacity">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
