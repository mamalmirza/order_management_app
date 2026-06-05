"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

import { DRINK_OPTIONS } from "@/lib/constants"
import { DrinkItem, Order, PaymentMethod } from "@/lib/types"
import { saveOrderToDb } from "@/app/actions"


export default function OrderForm() {
  // Current items in the order
  const [items, setItems] = useState<DrinkItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [otherDesc, setOtherDesc] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const addDrink = (drinkName: string, unitPrice: number) => {
    setItems(prev => {
      const found = prev.find(i => i.drinkName === drinkName)
      if (found) {
        return prev.map(i =>
          i.drinkName === drinkName ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { drinkName, unitPrice, quantity: 1 }]
    })
  }

  const removeItem = (drinkName: string) => {
    setItems(prev => prev.filter(i => i.drinkName !== drinkName))
  }

  const changeQuantity = (drinkName: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i =>
          i.drinkName === drinkName
            ? { ...i, quantity: Math.max(1, i.quantity + delta) }
            : i
        )
        .filter(i => i.quantity > 0)
    )
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)

  const resetOrder = () => {
    setItems([])
    setPaymentMethod("card")
    setOtherDesc("")
    setError(null)
    setSuccess(false)
  }

  const validate = () => {
    if (items.length === 0) return "Please add at least one drink to the order."
    if (!paymentMethod) return "Please select a payment method."
    if (paymentMethod === "other" && !otherDesc.trim())
      return "Please provide a description for the 'Other' payment method."
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      setSuccess(false);
      return;
    }
    const order: Order = {
      id: crypto.randomUUID(),
      items,
      totalItems,
      totalAmount,
      paymentMethod,
      otherPaymentDescription: paymentMethod === "other" ? otherDesc : undefined,
      createdAt: new Date().toISOString(),
    };
    const result = await saveOrderToDb(order);
    if (!result.success) {
      setError(result.error ?? 'Failed to save order');
      setSuccess(false);
    } else {
      setSuccess(true);
      setError(null);
      resetOrder();
    }
  }

  return (
    <Card className="w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Drink Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Order saved.</AlertDescription>
            </Alert>
          )}
          {/* Drink Buttons */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4 relative">
            {DRINK_OPTIONS.map(opt => (
              <Button
                type="button"
                key={opt.name}
                className={`min-h-20 w-full py-3 text-lg ${opt.color} text-gray-800 z-10 pointer-events-auto cursor-pointer touch-manipulation select-none active:scale-[0.98]`}
                onClick={() => addDrink(opt.name, opt.price)}
                onTouchStart={() => addDrink(opt.name, opt.price)}
              >
                {opt.name} - ${opt.price}
              </Button>
            ))}
          </div>
          {/* Order Preview */}
          {items.length > 0 && (
            <div className="border p-3 rounded mb-4">
              <h3 className="font-semibold mb-2">Current Order</h3>
              {items.map(i => (
                <div key={i.drinkName} className="flex justify-between items-center mb-2">
                  <span>{i.drinkName}</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      className="min-h-12 w-12 text-base"
                      variant="outline"
                      onClick={() => changeQuantity(i.drinkName, -1)}
                      onTouchStart={() => changeQuantity(i.drinkName, -1)}
                    >-</Button>
                    <span className="text-lg font-medium">{i.quantity}</span>
                    <Button
                      type="button"
                      className="min-h-12 w-12 text-base"
                      variant="outline"
                      onClick={() => changeQuantity(i.drinkName, 1)}
                      onTouchStart={() => changeQuantity(i.drinkName, 1)}
                    >+</Button>
                  </div>
                  <span className="text-lg font-medium">${i.quantity * i.unitPrice}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeItem(i.drinkName)}
                    onTouchStart={() => removeItem(i.drinkName)}
                  >✕</Button>
                </div>
              ))}
              <div className="border-t mt-2 pt-2">
                <p>Total Items: {totalItems}</p>
                <p>Total Amount: ${totalAmount}</p>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              className="min-h-14 text-base font-bold"
              variant={paymentMethod === "card" ? "default" : "outline"}
              onClick={() => setPaymentMethod("card")}
            >Card</Button>
            <Button
              type="button"
              className="min-h-14 text-base font-bold"
              variant={paymentMethod === "cash" ? "default" : "outline"}
              onClick={() => setPaymentMethod("cash")}
            >Cash</Button>
            <Button
              type="button"
              className="min-h-14 text-base font-bold"
              variant={paymentMethod === "other" ? "default" : "outline"}
              onClick={() => setPaymentMethod("other")}
            >Other</Button>
          </div>
        
        {paymentMethod === "other" && (
          <div className="mb-4">
            <Label htmlFor="otherDesc">Other Payment Description</Label>
            <Input
              id="otherDesc"
              value={otherDesc}
              onChange={e => setOtherDesc(e.target.value)}
              placeholder="Enter description"
              className="h-12 text-base"
            />
          </div>
        )}
        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button type="submit" className="min-h-14 text-base font-bold" onClick={handleSubmit}>
            Submit Order
          </Button>
          <Button type="button" variant="outline" onClick={resetOrder} className="min-h-14 text-base font-bold" >
            Reset Order
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/orders')} className="min-h-14 text-base font-bold" >
            View Orders
          </Button>
        </div>
        </form>
      </CardContent>
    </Card>
  )
}
