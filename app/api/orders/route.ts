import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Order } from '@/lib/types';

// POST /api/orders
export async function POST(req: Request) {
  try {
    const order: Order = await req.json();
    const client = await pool.connect();
    try {
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
    } finally {
      client.release();
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/orders error', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// GET /api/orders
export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`SELECT * FROM orders ORDER BY created_at DESC`);
      const orders: Order[] = rows.map((r) => ({
        id: r.id,
        items: JSON.parse(r.items),
        totalItems: Number(r.total_items),
        totalAmount: Number(r.total_amount),
        paymentMethod: r.payment_method,
        otherPaymentDescription: r.other_payment_description,
        createdAt: r.created_at,
      }));
      return NextResponse.json(orders);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('GET /api/orders error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
