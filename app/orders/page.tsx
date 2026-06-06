"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OrdersTable from "@/components/orders-table"
// import removed: using API fetch
import { Order } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) {
          const text = await res.text();
          console.error('Fetch error status:', res.status, 'body:', text);
          throw new Error('Failed to fetch orders');
        }
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (e) {
        console.error('Error fetching orders:', e);
      }
    })();
  }, []);

  // Clear local orders functionality removed (no longer needed)
  // Compute summary totals
  const totalItems = orders.reduce((sum, o) => sum + (o.totalItems ?? 0), 0);
  const totalCard = orders.reduce((sum, o) => sum + (o.paymentMethod === 'card' ? (o.totalItems ?? 0) : 0), 0);
  const totalCash = orders.reduce((sum, o) => sum + (o.paymentMethod === 'cash' ? (o.totalItems ?? 0) : 0), 0);
  const totalOther = orders.reduce((sum, o) => sum + (o.paymentMethod === 'other' ? (o.totalItems ?? 0) : 0), 0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Orders Dataset</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length === 0 ? (
            <Alert variant="default">
              <AlertTitle>No orders</AlertTitle>
              <AlertDescription>No drink orders have been saved yet.</AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Summary Report */}
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <p>Total Items: {totalItems}</p>
                <p>Card Payments Items: {totalCard}</p>
                <p>Cash Payments Items: {totalCash}</p>
                <p>Other Payments Items: {totalOther}</p>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="ghost" onClick={() => router.push('/')}>Back to Order Form</Button>
              </div>
              <OrdersTable orders={orders} />
            </>
          )}
          <div className="flex justify-between mt-4">
            <Button variant="ghost" onClick={() => router.push('/')}>Back to Order Form</Button>
          {/* Clear Local Orders button removed – functionality no longer needed */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
