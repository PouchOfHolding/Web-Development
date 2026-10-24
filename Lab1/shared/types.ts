// TODO: Declarar o enum SupplementCategory contendo pelo menos 5 categorias
export enum SupplementCategory {
  Vitamins = "Vitamins",
  Probiotics = "Probiotics",
  Minerals = "Minerals",
  Antioxidants = "Antioxidants",
  Creatine = "Creatine",
  Protein = 'protein',
  Sports = 'sports',
  Omega3 = 'omega3',
}
// TODO: Definir interface Book com os campos:
export interface Supplement {
  id: string;
  name: string;
  laboratory: string;
  price: number;
  category: SupplementCategory;
  stock: number;
  description?: string;
}
// TODO: Definir o tipo UserRole usando Union Types com literais ('admin' |'customer')
export type UserRole = "admin" | "customer";
// TODO: Definir o tipo PaymentStatus usando Union Types com literais

export type PaymentStatus = "pending" | "paid" | "failed"; // Substitui 'any' pelo teu Union Type
// TODO: Definir a interface Order contendo: orderId (string), items (array de objetos com bookId e quantity), totalAmount (number), status (PaymentStatus) e createdAt (Date)
export interface Order {
  orderId: string;
  items: { supplementId: string; quantity: number }[];
  totalAmount: number;
  status: PaymentStatus;
  createdAt: Date;
}
