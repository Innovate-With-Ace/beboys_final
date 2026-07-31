"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderCog } from "lucide-react";
import { Categories } from "@/types/Categories";
import { CategoryManagerDialog } from "./CategoryManagerDialog";

type Props = {
  selectedCategoryId?: string;
  onSelectCategory?: (categoryId: string) => void;
  categories?: Categories[];
  showAllOption?: boolean; // Set to true for filters, false for dish forms
  onAddCategory?: (label: string) => void;
  onRenameCategory?: (id: string, label: string) => void;
  onDeleteCategory?: (id: string) => void;
  disable?: boolean;
};

const CategoriesSelect = ({
  selectedCategoryId,
  onSelectCategory,
  categories = [],
  showAllOption = false,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  disable,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5 w-full">
      {/* Native Select styled to match shadcn/ui inputs */}
      <select
        disabled={disable}
        value={selectedCategoryId ?? ""}
        onChange={(e) => onSelectCategory?.(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground truncate cursor-pointer"
      >
        <option value="" disabled={!showAllOption}>
          {showAllOption ? "All Categories" : "Select a category"}
        </option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Manage Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="h-9 px-2.5 text-xs gap-1.5 shrink-0"
        title="Manage Categories"
      >
        <FolderCog className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Manage</span>
      </Button>

      {/* Category Manager Dialog */}
      <CategoryManagerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        onAdd={(label) => onAddCategory?.(label)}
        onRename={(id, label) => onRenameCategory?.(id, label)}
        onDelete={(id) => onDeleteCategory?.(id)}
      />
    </div>
  );
};

export default CategoriesSelect;
