import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import type { ChurnRecord } from "@/types";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface ChurnTableProps {
  data: ChurnRecord[];
}

const CHURN_THRESHOLD = 5;

const columnHelper = createColumnHelper<ChurnRecord>();

const columns = [
  columnHelper.accessor("month", {
    header: "Month",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("churnRate", {
    header: "Churn Rate",
    cell: (info) => `${info.getValue()}%`,
  }),
  columnHelper.accessor("retentionRate", {
    header: "Retention Rate",
    cell: (info) => `${info.getValue()}%`,
  }),
  columnHelper.accessor("churnedCustomers", {
    header: "Churned",
    cell: (info) => info.getValue().toLocaleString(),
  }),
];

export function ChurnTable({ data }: ChurnTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 transition-all duration-200 hover:border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          Churn & Retention
          <InfoTooltip text="Churn Rate is the % of customers who cancel each month. Retention Rate is the % who stay (100% minus churn). Lower churn = healthier business." />
        </h3>
        <span className="text-xs text-slate-500">
          Rows above {CHURN_THRESHOLD}% churn highlighted
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-700">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-slate-200 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isHighChurn = row.original.churnRate > CHURN_THRESHOLD;
              return (
                <tr
                  key={row.id}
                  className={`border-b border-slate-700/50 transition-colors hover:bg-slate-700/30 ${
                    isHighChurn ? "bg-rose-500/10" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-4 py-3 ${
                        isHighChurn &&
                        cell.column.id === "churnRate"
                          ? "text-rose-400 font-medium"
                          : "text-slate-300"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
