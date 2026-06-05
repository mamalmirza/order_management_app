import { Order } from "./types";
import { LOCAL_STORAGE_ORDERS_KEY } from "./constants";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveOrder(order: Order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
}

// export function clearOrders() {
//   localStorage.removeItem(LOCAL_STORAGE_ORDERS_KEY);
// }
