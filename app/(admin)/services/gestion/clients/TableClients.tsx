import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import {  EyeIcon, PencilIcon, TrashBinIcon } from "@/icons";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

// Define the table data using the interface
const tableData: Client[] = [
  {
    id: 1,
    name: "Lindsey Curtis",
    email: "lindsey.curtis@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    status: "Active",
  },
  {
    id: 2,
    name: "Kaiya George",
    email: "kaiya.george@example.com",
    phone: "987-654-3210",
    address: "456 Elm St, Othertown, USA",
    status: "Pending",
  },
  {
    id: 3,
    name: "Zain Geidt",
    email: "zain.geidt@example.com",
    phone: "555-555-5555",
    address: "789 Oak St, Sometown, USA",
    status: "Active",
  },
  {
    id: 4,
    name: "Abram Schleifer",
    email: "abram.schleifer@example.com",
    phone: "444-444-4444",
    address: "101 Pine St, Anycity, USA",
    status: "Cancel",
  },
  {
    id: 5,
    name: "Carla George",
    email: "carla.george@example.com",
    phone: "333-333-3333",
    address: "202 Maple St, Othercity, USA",
    status: "Active",
  },
];

export default function TableClients() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Address
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                  <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {client.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {client.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {client.phone}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {client.address}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        client.status === "Active"
                          ? "success"
                          : client.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                   <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex items-center gap-2">
                             <Button variant="outline" size="sm">
                                    <PencilIcon className="w-4 h-4 text-white" />
                            </Button>
                            <Button variant="outline" size="sm">
                                    <TrashBinIcon className="w-4 h-4 text-white" />
                            </Button>
                            <Button variant="outline" size="sm">
                                    <EyeIcon className="w-4 h-4 text-white" />
                            </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
