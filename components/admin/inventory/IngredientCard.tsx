// components/admin/ingredients/IngredientCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carrot, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useIngredientEditorStore } from "@/stores/IngredientEditorStore";
import { cn } from "@/lib/utils";
import { Ingredient } from "@/types/Ingredients";

type Props = {
  ingredient: Ingredient;
};

const IngredientCard = ({ ingredient }: Props) => {
  const openForEdit = useIngredientEditorStore((s) => s.openForEdit);

  const threshold = ingredient.low_stock_threshold || 1;
  const ratio = ingredient.stock / threshold;
  const isCritical = ratio <= 0.5;
  const isLow = !isCritical && ratio <= 1.0;

  // Standard status visual mapping
  const statusConfig = isCritical
    ? {
        label: "Critical",
        badgeStyle: "bg-destructive/15 text-destructive border-destructive/20",
        barStyle: "bg-destructive",
        icon: AlertCircle,
      }
    : isLow
      ? {
          label: "Low Stock",
          badgeStyle:
            "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
          barStyle: "bg-amber-500",
          icon: AlertTriangle,
        }
      : {
          label: "In Stock",
          badgeStyle:
            "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          barStyle: "bg-emerald-500",
          icon: CheckCircle2,
        };

  const StatusIcon = statusConfig.icon;

  // Calculate standard percentage representation capped at 100%
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((ingredient.stock / threshold) * 100)),
  );

  return (
    <Card
      onClick={() => openForEdit(ingredient)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/80 bg-card p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openForEdit(ingredient);
        }
      }}
    >
      <CardContent className="p-4 space-y-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "p-2 rounded-lg transition-transform duration-200 group-hover:scale-105",
              statusConfig.badgeStyle,
            )}
          >
            <Carrot className="size-4" />
          </div>

          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 gap-1 border shadow-2xs",
              statusConfig.badgeStyle,
            )}
          >
            <StatusIcon className="size-3 stroke-[2.5]" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Title & Stock Value */}
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {ingredient.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tracking-tight text-foreground">
              {ingredient.stock.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {ingredient.unit}
            </span>
          </div>
        </div>

        {/* Progress Metrics Bar */}
        <div className="space-y-1.5 pt-0.5">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                statusConfig.barStyle,
                isCritical && "animate-pulse",
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Threshold</span>
            <span className="font-medium text-foreground">
              {ingredient.low_stock_threshold} {ingredient.unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientCard;
