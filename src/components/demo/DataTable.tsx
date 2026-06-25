import type { ReactNode } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@sybilion/uilib';

import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  /** Shown as a single spanning row when data is empty. For onboarding use EmptyState (P-04) instead. */
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

const alignClass = (align: Column<unknown>['align']) =>
  align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : undefined;

/** Thin, typed wrapper over the uilib Table — column defs in, rows out. */
export function DataTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = 'No data.',
  onRowClick,
}: DataTableProps<T>) {
  return (
    // overflow-x-auto: wide tables (many columns / long cells) scroll inside the
    // card instead of pushing the page past the viewport on narrow screens.
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={alignClass(column.align)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-8 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={String(row[keyField])}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer' : undefined}
              >
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className={cn(
                      alignClass(column.align),
                      column.align === 'right' && 'tabular-nums',
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
