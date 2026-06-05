export const DRINK_OPTIONS = [
  { name: "Orange Blossom", price: 5, color: "bg-pink-100 hover:bg-pink-200" },
  { name: "Saffron Elixir", price: 5, color: "bg-amber-100 hover:bg-amber-200" },
  { name: "Silk Road Drink", price: 5, color: "bg-green-100 hover:bg-green-200" },
] as const;

export const PAYMENT_METHODS = [
  { label: "Card", value: "card" },
  { label: "Cash", value: "cash" },
  { label: "Other", value: "other" },
] as const;

export const LOCAL_STORAGE_ORDERS_KEY = "drink-orders";
