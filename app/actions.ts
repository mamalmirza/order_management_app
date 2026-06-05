// app/actions.ts
"use server";

import { pool } from "@/lib/db";
import { Order } from "@/lib/types";

export async function saveOrderToDb(order: Order) {
  const client = await pool.connect();
  try {
    // Ensure the orders table exists before inserting
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        items JSONB NOT NULL,
        total_items INTEGER NOT NULL,
        total_amount NUMERIC NOT NULL,
        payment_method TEXT NOT NULL,
        other_payment_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    await client.query(
      `INSERT INTO orders (id, items, total_items, total_amount, payment_method, other_payment_description, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        order.id,
        JSON.stringify(order.items),
        order.totalItems,
        order.totalAmount,
        order.paymentMethod,
        order.otherPaymentDescription ?? null,
        order.createdAt,
      ]
    );
    return { success: true };
  } catch (err) {
    console.error("saveOrderToDb error", err);
    return { success: false, error: String(err) };
  } finally {
    client.release();
  }
}

export async function getOrdersFromDb(): Promise<Order[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<{
        id: string;
        items: string;
        total_items: number;
        total_amount: number;
        payment_method: string;
        other_payment_description: string | null;
        created_at: string;
      }>(`SELECT * FROM orders ORDER BY created_at DESC`);
      const rows = result.rows;
      return rows.map((r) => ({
        id: r.id,
        items: JSON.parse(r.items),
        totalItems: Number(r.total_items),
        totalAmount: Number(r.total_amount),
        paymentMethod: r.payment_method,
        otherPaymentDescription: r.other_payment_description,
        createdAt: r.created_at,
      }));
  } catch (err: any) {
    // If the orders table does not exist, create it and return empty list
    if (err.code === '42P01') {
      await client.query(`
        CREATE TABLE orders (
          id TEXT PRIMARY KEY,
          items JSONB NOT NULL,
          total_items INTEGER NOT NULL,
          total_amount NUMERIC NOT NULL,
          payment_method TEXT NOT NULL,
          other_payment_description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `);
      return [];
    }
    console.error('getOrdersFromDb error', err);
    throw err;
  } finally {
    client.release();
  }
}
