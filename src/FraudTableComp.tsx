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

import { useMemo, useState } from "react";

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
  const pro = true;

  fraudSignalsData = useMemo(() => {
    if (!loadingFraudData) {
      return pro ? fraudData : fraudData.slice(0, 5);
    } else {
      return fraudData;
    }
  }, [fraudData, loadingFraudData, pro]);

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
      <div className="rounded-md border overflow-hidden">
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
                  {row.getVisibleCells().map((cell, i: number) => (
                    <td
                      key={cell.id || i}
                      className="px-4 py-2 text-center text-gray-900"
                      style={{ fontWeight: `${i === 0 ? "bold" : "normal"}` }}
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

// ------------------------------ Fraud Table Section --------------------------

// function FraudTable({
//   fraudData,
//   loadingFraudData,
// }: {
//   fraudData: FraudData[];
//   loadingFraudData: boolean;
// }) {
//   const chosenOnes = new Set(fraudData.map((f) => f.status));
//   console.log(chosenOnes);

//   return (
//     <Table className="w-full">
//       <TableHeader>
//         <TableRow>
//           <TableHead className="text-center" key="fraud">
//             Fraud
//           </TableHead>
//           <TableHead className="text-center" key="status">
//             Status
//           </TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {fraudData &&
//           fraudData.map((fraud) => (
//             <TableRow key={fraud.id}>
//               <TableCell className="font-medium text-center">
//                 {fraud.signal}
//               </TableCell>
//               <TableCell className="text-center">{fraud.status}</TableCell>
//             </TableRow>
//           ))}
//         {loadingFraudData &&
//           Array.from({ length: 5 }, (_, i: number) => (
//             <TableRow key={i}>
//               <TableCell className="font-medium text-center">
//                 <Skeleton className="w-full p-3 h-6 rounded-full " />
//               </TableCell>
//               <TableCell className="text-center">
//                 <Skeleton className="w-full p-2 h-6 rounded-full" />
//               </TableCell>
//             </TableRow>
//           ))}
//       </TableBody>
//     </Table>
//   );
// }
