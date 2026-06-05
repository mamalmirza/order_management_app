export type DrinkItem = {
  drinkName: string;
  unitPrice: number;
  quantity: number;
};

export type PaymentMethod = "card" | "cash" | "other";

export type Order = {
  id: string;
  items: DrinkItem[];
  totalItems: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  otherPaymentDescription?: string;
  notes?: string;
  createdAt: string;
};
