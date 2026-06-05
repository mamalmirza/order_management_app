"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OrdersTable from "@/components/orders-table"
import { getOrders, clearOrders } from "@/lib/local-orders"
import { Order } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  const handleClear = () => {
    clearOrders()
    setOrders([])
  }

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
            <OrdersTable orders={orders} />
          )}
          <div className="flex justify-between mt-4">
            <Button variant="ghost" onClick={() => router.push('/')}>Back to Order Form</Button>
<Button variant="destructive" className="min-h-14 text-base font-bold" onClick={handleClear}>Clear Local Orders</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
