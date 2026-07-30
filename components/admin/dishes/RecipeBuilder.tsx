import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Utensils, X, AlertCircle } from "lucide-react";
import { Ingredient } from "@/types/Ingredients";

interface RecipeRow {
  ingredient_id: string;
  quantity: number;
}

interface RecipeBuilderProps {
  recipeRows: RecipeRow[];
  ingredients: Ingredient[];
  onUpdateRow: (index: number, updatedFields: Partial<RecipeRow>) => void;
  onRemoveRow: (index: number) => void;
  onAddRow: () => void;
}

export function RecipeBuilder({
  recipeRows,
  ingredients,
  onUpdateRow,
  onRemoveRow,
  onAddRow,
}: RecipeBuilderProps) {
  return (
    <div className="space-y-2.5 pt-2 border-t border-border/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Utensils className="size-3.5 text-muted-foreground" />
          <Label className="text-xs font-semibold">Recipe Breakdown</Label>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {recipeRows.length}{" "}
          {recipeRows.length === 1 ? "ingredient" : "ingredients"}
        </span>
      </div>

      <div className="space-y-2">
        {recipeRows.map((row, index) => {
          const ingredient = ingredients.find(
            (i) => i.id === row.ingredient_id,
          );

          // Check if current recipe usage exceeds total available inventory stock
          const isExceedingStock =
            ingredient && row.quantity > ingredient.stock;

          return (
            <div
              key={index}
              className={`p-2.5 rounded-lg border transition-colors space-y-2 ${
                isExceedingStock
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border/70 bg-muted/20 hover:border-border"
              }`}
            >
              {/* Select Row */}
              <div className="flex items-center gap-2">
                <select
                  value={row.ingredient_id}
                  onChange={(e) =>
                    onUpdateRow(index, { ingredient_id: e.target.value })
                  }
                  className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring text-foreground truncate"
                >
                  <option value="" disabled>
                    Select ingredient...
                  </option>
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({ing.stock} {ing.unit} in stock)
                    </option>
                  ))}
                </select>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveRow(index)}
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="size-3.5" />
                </Button>
              </div>

              {/* Quantity + Unit Row */}
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1.5 bg-background border border-input rounded-md px-2.5 h-8">
                  <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                    Qty:
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={row.quantity || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      // Prevent negative numbers
                      const safeValue = isNaN(val) ? 0 : Math.max(0, val);
                      onUpdateRow(index, { quantity: safeValue });
                    }}
                    className="w-full bg-transparent text-xs font-medium tabular-nums focus:outline-none"
                    min={0}
                    step="any"
                  />
                </div>

                <div className="w-24 h-8 flex items-center justify-center bg-muted/50 border border-border/60 rounded-md px-2 shrink-0">
                  <span className="text-xs font-medium text-muted-foreground truncate">
                    {ingredient?.unit ?? "Unit"}
                  </span>
                </div>
              </div>

              {/* Warning if recipe portion exceeds current stock */}
              {isExceedingStock && (
                <div className="flex items-center gap-1 text-[10px] text-destructive font-medium pt-0.5">
                  <AlertCircle className="size-3 shrink-0" />
                  <span>
                    Exceeds available stock ({ingredient.stock}{" "}
                    {ingredient.unit})
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddRow}
        className="w-full text-xs h-8 border-dashed mt-1 hover:bg-muted/50"
      >
        <Plus className="size-3.5 mr-1.5" />
        Add Ingredient
      </Button>
    </div>
  );
}
