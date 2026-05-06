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

export function AdminTable<T extends { id?: number }>({
  data,
  columns,
  searchKeys,
  onRowAction,
  actionButtons,
  title,
}: AdminTableProps<T>) {
  const [search, setSearch] = React.useState("");

  const filteredData = useMemo(() => {
    if (!search.trim() || !searchKeys || searchKeys.length === 0) return data;
    const normalizedSearch = search.trim().toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const value = row[key];
        return String(value).toLowerCase().includes(normalizedSearch);
      }),
    );
  }, [data, search, searchKeys]);

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      )}

      {searchKeys && searchKeys.length > 0 && (
        <div>
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <Icon icon={ICON_MAP.misc.search} />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10"
            />
            <InputGroupAddon align="inline-end" className="text-xs text-muted-foreground tabular-nums px-3">
              {filteredData.length} {filteredData.length === 1 ? "result" : "results"}
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)}>
                  <div className="flex items-center gap-1.5">
                    {col.icon && <Icon icon={col.icon} className="size-3.5" />}
                    <span>{col.label}</span>
                  </div>
                </TableHead>
              ))}
              {actionButtons && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actionButtons ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Icon icon={ICON_MAP.status.empty} className="size-8 mx-auto mb-2" />
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.id} className="group">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </TableCell>
                  ))}
                  {actionButtons && (
                    <TableCell>
                      <div className="flex justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        {actionButtons(row).map((btn) => {
                          const mapped = ACTION_ICON_MAP[btn.action];
                          const icon = btn.icon ?? mapped?.icon ?? ICON_MAP.actions.edit;
                          return (
                            <IconBtn
                              key={btn.action}
                              tooltip={btn.label}
                              className={cn(mapped?.className, btn.className)}
                              onClick={() => onRowAction?.(row, btn.action)}
                            >
                              <Icon icon={icon} />
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
