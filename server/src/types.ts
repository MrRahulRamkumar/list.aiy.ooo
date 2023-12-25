export interface ShoppingListItem {
  id: number;
  shoppingListId: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  createdById: string;
  completedById: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  completedBy: User | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
}
