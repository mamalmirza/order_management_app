"use client"

import { Order } from "@/lib/types"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

export default function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date/Time</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Other Description</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const items = order.items ?? []
          return (
            <TableRow key={order.id}>
              <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
              <TableCell>{items.map(i => `${i.drinkName} x${i.quantity}`).join(", ")}</TableCell>
              <TableCell>{order.totalItems ?? items.reduce((sum, i) => sum + i.quantity, 0)}</TableCell>
              <TableCell>${order.totalAmount ?? items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>{order.otherPaymentDescription ?? "-"}</TableCell>
              <TableCell>{order.notes ?? "-"}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
