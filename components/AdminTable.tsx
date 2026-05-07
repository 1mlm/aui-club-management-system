"use client";

import React, { useMemo } from "react";
import { IconBtn } from "@/components/IconBtn";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { cn } from "@/shadcn/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shadcn/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import type { Hugeicon } from "@/util/hugeicons";

export type TableColumn<T> = {
  key: keyof T;
  label: string;
  icon?: Hugeicon;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type AdminTableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  searchKeys?: (keyof T)[];
  onRowAction?: (row: T, action: string) => void;
  actionButtons?: (row: T) => {
    label: string;
    action: string;
    icon?: Hugeicon;
    className?: string;
  }[];
  title?: string;
};

const ACTION_ICON_MAP: Record<
  string,
  { icon: Hugeicon; className?: string }
> = {
  approve: { icon: ICON_MAP.actions.approve },
  reject: {
    icon: ICON_MAP.actions.reject,
    className: "text-destructive hover:text-destructive",
  },
  delete: {
    icon: ICON_MAP.actions.delete,
    className: "text-destructive hover:text-destructive",
  },
  edit_name: { icon: ICON_MAP.actions.edit },
  toggle_admin: { icon: ICON_MAP.actions.admin },
  change_status: { icon: ICON_MAP.actions.status },
};

export function AdminTable<T extends { id?: number | string }>({
  data,
  columns,
  searchKeys,
  onRowAction,
  actionButtons,
  title,
}: AdminTableProps<T>) {
  const [search, setSearch] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (search.trim() && searchKeys && searchKeys.length > 0) {
      const normalizedSearch = search.trim().toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const value = row[key];
          return String(value).toLowerCase().includes(normalizedSearch);
        }),
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = String(aVal).localeCompare(String(bVal), undefined, {
          numeric: true,
          sensitivity: "base",
        });

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, search, searchKeys, sortConfig]);

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
      )}

      {searchKeys && searchKeys.length > 0 && (
        <div>
          <InputGroup className="max-w-sm h-10">
            <InputGroupAddon>
              <Icon icon={ICON_MAP.misc.search} className="text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10"
            />
            <InputGroupAddon align="inline-end" className="pr-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded text-muted-foreground/70 tabular-nums">
                {processedData.length} {processedData.length === 1 ? "result" : "results"}
              </span>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className="py-3 px-4">
                  <button
                    type="button"
                    className="group flex items-center gap-2 cursor-pointer transition-colors w-full"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {col.icon && <Icon icon={col.icon} className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />}
                      <span className="truncate group-hover:text-foreground transition-colors font-semibold text-xs uppercase tracking-wider">{col.label}</span>
                    </div>
                    {sortConfig.key === col.key ? (
                      <Icon icon={sortConfig.direction === "asc" ? ICON_MAP.actions.up : ICON_MAP.actions.down} className="size-3 text-primary animate-in fade-in zoom-in duration-200" />
                    ) : (
                      <Icon icon={ICON_MAP.actions.up} className="size-3 text-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-all" />
                    )}
                  </button>
                </TableHead>
              ))}
              {actionButtons && <TableHead className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actionButtons ? 1 : 0)}
                  className="text-center py-12 text-muted-foreground"
                >
                  <Icon icon={ICON_MAP.status.empty} className="size-10 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No records found</p>
                  <p className="text-xs opacity-60">Try adjusting your search filters</p>
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((row) => (
                <TableRow key={row.id} className="group transition-colors hover:bg-muted/20">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="py-3 px-4">
                      {col.render
                        ? col.render(row[col.key], row)
                        : <span className="text-sm font-medium">{String(row[col.key])}</span>}
                    </TableCell>
                  ))}
                  {actionButtons && (
                    <TableCell className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {actionButtons(row).map((btn) => {
                          const mapped = ACTION_ICON_MAP[btn.action];
                          const icon = btn.icon ?? mapped?.icon ?? ICON_MAP.actions.edit;
                          return (
                            <IconBtn
                              key={btn.action}
                              tooltip={btn.label}
                              className={cn("size-8 rounded-lg", mapped?.className, btn.className)}
                              onClick={() => onRowAction?.(row, btn.action)}
                            >
                              <Icon icon={icon} className="size-3.5" />
                            </IconBtn>
                          );
                        })}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
