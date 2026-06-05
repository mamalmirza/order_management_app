"use client";

import OrderForm from "@/components/order-form";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <h1 className="mb-6 text-3xl font-bold">Drink Order Tracker</h1>
      <p className="mb-4 text-lg text-center">Record shop drink orders quickly.</p>
      <OrderForm />
    </div>
  );
}
