"use client";

import { SearchIcon, X } from "@hugeicons/core-free-icons";
import React, { useMemo } from "react";
import { Icon } from "@/shadcn/cpns/Icon";
import { Button } from "@/shadcn/ui/button";
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
  actionButtons?: (row: T) => { label: string; action: string }[];
  title?: string;
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
    <div className="w-full">
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}

      {searchKeys && searchKeys.length > 0 && (
        <div className="mb-4">
          <InputGroup className="max-w-sm shadow-[0_0_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <InputGroupAddon>
              <Icon icon={SearchIcon} />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10"
            />
          </InputGroup>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)}>
                  {col.icon && (
                    <Icon icon={col.icon} className="size-4 mr-2 float-left self-center place-items-center" />
                  )}
                  {col.label}
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
                  <Icon icon={X} className="size-8 mx-auto mb-2" />
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </TableCell>
                  ))}
                  {actionButtons && (
                    <TableCell>
                      <div className="flex gap-2">
                        {actionButtons(row).map((btn) => (
                          <Button
                            key={btn.action}
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              onRowAction && onRowAction(row, btn.action)
                            }
                          >
                            {btn.label}
                          </Button>
                        ))}
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
