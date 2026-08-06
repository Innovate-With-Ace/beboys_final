"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon } from "lucide-react";

export function CustomDateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || "",
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  // Helper function to format "YYYY-MM-DD" into "August 7, 2026"
  const formatDateLabel = (dateString: string) => {
    if (!dateString) return "";
    // Append T00:00:00 to prevent timezone shift issues with local time
    const date = new Date(dateString + "T00:00:00");
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleApply = () => {
    if (!startDate || !endDate) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("range");
    params.set("startDate", startDate);
    params.set("endDate", endDate);

    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card border border-border/80 rounded-lg px-3 py-2 text-xs font-medium text-foreground shadow-xs cursor-pointer hover:bg-muted/30 transition-colors"
      >
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <span>
          {startDate && endDate
            ? `${formatDateLabel(startDate)} – ${formatDateLabel(endDate)}`
            : "Custom Range"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-4 bg-card border border-border rounded-xl shadow-xl z-50 w-80 space-y-4">
          <h4 className="text-xs font-semibold text-foreground">
            Select Custom Date Range
          </h4>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-muted-foreground">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-xs bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-xs bg-background text-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-xs text-muted-foreground hover:bg-muted rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md shadow-xs hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
