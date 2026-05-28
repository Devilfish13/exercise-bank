export type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
};
