export type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
};
