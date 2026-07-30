"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

export type Category = {
  id: string;
  label: string;
};

interface CategoryManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onAdd: (label: string) => void;
  onRename: (id: string, newLabel: string) => void;
  onDelete: (id: string) => void;
}

export function CategoryManagerDialog({
  open,
  onOpenChange,
  categories,
  onAdd,
  onRename,
  onDelete,
}: CategoryManagerDialogProps) {
  // Local interaction states
  const [newCategoryLabel, setNewCategoryLabel] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editLabel, setEditLabel] = React.useState("");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Reset internal states when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setNewCategoryLabel("");
      setEditingId(null);
      setEditLabel("");
      setDeletingId(null);
    }
  }, [open]);

  // --- Handlers ---

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = newCategoryLabel.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setNewCategoryLabel("");
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditLabel(category.label);
    setDeletingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditLabel("");
  };

  const saveRename = (id: string) => {
    const trimmed = editLabel.trim();
    if (trimmed) {
      onRename(id, trimmed);
    }
    cancelEditing();
  };

  const confirmDelete = (id: string) => {
    onDelete(id);
    setDeletingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add, rename, or delete categories for your menu items.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <Input
              placeholder="New category name..."
              value={newCategoryLabel}
              onChange={(e) => setNewCategoryLabel(e.target.value)}
              className="h-9 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newCategoryLabel.trim()}
              className="h-9 shrink-0 gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </form>

          {/* Categories List */}
          <div className="max-h-[300px] overflow-y-auto divide-y rounded-md border border-border">
            {categories.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No categories created yet.
              </div>
            ) : (
              categories.map((category) => {
                const isEditing = editingId === category.id;
                const isDeleting = deletingId === category.id;

                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-2.5 text-sm transition-colors hover:bg-muted/40"
                  >
                    {/* Inline Edit Mode */}
                    {isEditing ? (
                      <div className="flex flex-1 items-center gap-2 pr-2">
                        <Input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(category.id);
                            if (e.key === "Escape") cancelEditing();
                          }}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={() => saveRename(category.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      </div>
                    ) : isDeleting ? (
                      /* Inline Delete Confirmation Mode */
                      <div className="flex w-full items-center justify-between">
                        <span className="text-xs font-medium text-destructive">
                          Delete "{category.label}"?
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="h-7 px-2 text-xs"
                            onClick={() => confirmDelete(category.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={() => setDeletingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Default Display Mode */
                      <>
                        <span className="font-medium text-foreground">
                          {category.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => startEditing(category)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Rename</span>
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeletingId(category.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
