import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "./components/ui/input";
import {
  ArrowUpDown,
  ChevronRight,
  FilterIcon,
  TableProperties,
} from "lucide-react";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

import { FraudData } from "./App";

import { useState } from "react";

let fraudSignalsData: FraudData[] = [];
const columns: ColumnDef<FraudData>[] = [
  {
    accessorKey: "signal",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className="text-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fraud <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("signal")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <StatusDropdown column={column} />,
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
];

function StatusDropdown({ column }: { column: ColumnDef<FraudData> }) {
  const uniqueStatuses = [
    ...new Set(fraudSignalsData.map((item) => item.status)),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Status
          <FilterIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-72">
        <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>
          <TableProperties /> All
        </DropdownMenuItem>
        {uniqueStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => column.setFilterValue(status)}
          >
            <ChevronRight /> {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FT({
  fraudData,
  loadingFraudData,
}: {
  fraudData: FraudData[];
  loadingFraudData: boolean;
}) {
  if (!loadingFraudData) fraudSignalsData = fraudData;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const table = useReactTable({
    data: fraudSignalsData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <div className="py-4 flex">
        <Input
          placeholder="Search fraud signals..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm w-full sm:max-w-xs"
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-center font-medium text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 text-center text-gray-600"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500 animate-pulse overflow-hidden"
                >
                  {loadingFraudData ? "Fetching..." : "No results found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FT;
