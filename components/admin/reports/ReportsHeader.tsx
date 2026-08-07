// components/admin/reports/ReportsHeader.tsx
"use client";

import React, { useState } from "react";
import {
  Download,
  Calendar,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Table,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomDateRangePicker } from "./CustomDateRangePicker";

interface ReportsHeaderProps {
  currentRange: string;
}

export function ReportsHeader({ currentRange }: ReportsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const options = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "This Year", value: "this_year" },
  ];

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("startDate");
    params.delete("endDate");
    params.set("range", value);

    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    try {
      setIsExporting(true);
      setIsExportOpen(false);

      // Pass along any active query filters (range, startDate, endDate) to your backend export route
      const queryParams = searchParams.toString();
      const response = await fetch(
        `/api/reports/export?format=${format}&${queryParams}`,
      );

      if (!response.ok) {
        throw new Error("Failed to generate export file.");
      }

      // Convert response to a downloadable blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Determine proper file extension
      const extensionMap = {
        csv: "csv",
        excel: "xlsx",
        pdf: "pdf",
      };
      a.download = `reports-analytics-${currentRange || "custom"}.${extensionMap[format]}`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Something went wrong while exporting the report.");
    } finally {
      setIsExporting(false);
    }
  };

  const selectedLabel =
    options.find((opt) => opt.value === currentRange)?.label || "This Month";
  const hasCustomDates =
    searchParams.has("startDate") && searchParams.has("endDate");

  return (
    <div>
      <div className="pb-4 border-b border-border/60 relative">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gain insights into sales performance, inventory levels, and
            operational metrics.
          </p>
        </div>

        {/* Responsive flex-wrap container keeps controls neat on all screens */}
        <div className="flex flex-wrap items-center gap-2.5 mt-4">
          {/* 1. Preset Dropdown */}
          <div className="relative">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-card border border-border/80 rounded-lg px-3 py-2 text-xs font-medium text-foreground shadow-xs cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{hasCustomDates ? "Custom Range" : selectedLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
            </div>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors ${
                      !hasCustomDates && currentRange === opt.value
                        ? "text-primary font-bold bg-primary/5"
                        : "text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Custom Date Range Picker Component */}
          <CustomDateRangePicker />

          {/* 3. Multi-Format Export Dropdown */}
          <div className="relative">
            <div
              onClick={() => !isExporting && setIsExportOpen(!isExportOpen)}
              className={`inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-3.5 py-2 rounded-lg shadow-sm transition-opacity ${
                isExporting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:opacity-95"
              }`}
            >
              <Download
                className={`h-4 w-4 ${isExporting ? "animate-bounce" : ""}`}
              />
              <span>{isExporting ? "Exporting..." : "Export Report"}</span>
              <ChevronDown className="h-3.5 w-3.5 ml-0.5 opacity-80" />
            </div>

            {isExportOpen && !isExporting && (
              <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Table className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Export as Excel</span>
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <FileText className="h-3.5 w-3.5 text-rose-600" />
                  <span>Export as PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
