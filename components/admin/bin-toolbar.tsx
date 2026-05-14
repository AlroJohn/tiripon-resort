"use client";

import { Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Filter = "all" | "paid" | "unpaid";
type ViewMode = "table" | "cards";

export function BinToolbar({
  filter,
  selectedSize,
  selectedCount,
  onBulkDelete,
  viewMode,
  onViewModeChange,
}: {
  filter: Filter;
  selectedSize: number;
  selectedCount: number;
  onBulkDelete: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const href = (next: Filter) =>
    `/bin?page=1&size=${selectedSize}&filter=${next}`;

  return (
    <div className="flex w-full flex-nowrap items-center justify-between gap-2 overflow-x-auto">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" size="sm" variant="outline" className="h-9">
              Menu ({filter})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem asChild>
              <a href={href("all")}>All</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={href("paid")}>Paid</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={href("unpaid")}>Unpaid</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewModeChange("table")}
          className={`inline-flex h-9 items-center rounded-md border px-3 text-sm ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-background"}`}
        >
          Table
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("cards")}
          className={`inline-flex h-9 items-center rounded-md border px-3 text-sm ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-background"}`}
        >
          Cards
        </button>
        <button
          type="button"
          onClick={onBulkDelete}
          className="inline-flex gap-1 h-9 items-center justify-center rounded-md text-destructive bg-destructive/20 px-3 text-sm font-medium text-destructive-foreground"
        >
          <Trash className="w-4 h-4 text-destructive" /> ({selectedCount})
        </button>
      </div>
    </div>
  );
}
