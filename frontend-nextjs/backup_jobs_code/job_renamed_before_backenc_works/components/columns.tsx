"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/registry/new-york/ui/checkbox";

import { labels, deadlines, placements } from "../data/data";
import { Job } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const columns: ColumnDef<Job>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job Id" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {row.getValue("company")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {row.getValue("location").join(", ")}
            {/* {row.getValue("location")} */}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "placement",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Placement" />
    ),
    cell: ({ row }) => {
      const placement = placements.find(
        (placement) => placement.value === row.getValue("placement")
      );

      if (!placement) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {placement.icon && (
            <placement.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{placement.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deadline" />
    ),
    cell: ({ row }) => {
      // const deadline = deadlines.find(
      //   (deadline) => deadline.value === row.getValue("deadline")
      // );

      const deadline = row.getValue("deadline");

      if (!deadline) {
        return null;
      }

      return (
        <div className="flex items-center">
          {deadline.icon && (
            <deadline.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{deadline.label}</span>
          <span>{deadline}</span>{" "}
          <span className="pl-1">
            <Badge variant={parseInt(dayjs(deadline).fromNow(true)) < 5? "destructive": "secondary"}>
              {dayjs(deadline).fromNow(true) + " left"}
            </Badge>
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
