"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStockAdjustments } from "@/hooks/useStockAdjustments";
import { History, ArrowUp, ArrowDown } from "lucide-react";

const reasonLabels: Record<string, string> = {
  manual_adjustment: "Manual edit",
  dish_batch_deduction: "Batch cooked",
};

interface StockAuditTrailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredientId?: string;
  ingredientName?: string;
}

export default function StockAuditTrailDialog({
  open,
  onOpenChange,
  ingredientId,
  ingredientName,
}: StockAuditTrailDialogProps) {
  const { data: adjustments = [], isLoading } =
    useStockAdjustments(ingredientId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 gap-0 overflow-hidden shadow-lg">
        <DialogHeader className="px-6 py-5 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <History className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              {ingredientName
                ? `Stock History — ${ingredientName}`
                : "Stock Audit Trail"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {ingredientName
              ? `Every change to ${ingredientName}'s stock — manual edits and automatic batch-cook deductions — most recent first.`
              : "Every change to ingredient stock — manual edits and automatic batch-cook deductions — most recent first."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-xs text-muted-foreground">Loading...</div>
          ) : adjustments.length === 0 ? (
            <div className="p-6 text-xs text-muted-foreground text-center">
              No stock changes recorded yet.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="py-2.5 px-6 font-semibold">Ingredient</th>
                  <th className="py-2.5 font-semibold">Change</th>
                  <th className="py-2.5 font-semibold">Reason</th>
                  <th className="py-2.5 px-6 font-semibold text-right">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {adjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-muted/20">
                    <td className="py-2.5 px-6 font-medium text-foreground">
                      {adj.ingredient_name}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          adj.change >= 0
                            ? "text-emerald-600"
                            : "text-destructive"
                        }`}
                      >
                        {adj.change >= 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(adj.change)}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ({adj.previous_stock} → {adj.new_stock})
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {reasonLabels[adj.reason] ?? adj.reason}
                    </td>
                    <td className="py-2.5 px-6 text-right text-muted-foreground">
                      {new Date(adj.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
