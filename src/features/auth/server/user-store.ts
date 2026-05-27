import seedUsers from "@/mocks/data/users.json";
import type { User } from "@/features/auth/types";

export type StoredUser = User & { passwordHash: string };

// In-memory store seeded from local JSON. New registrations live for the
// lifetime of the server process; the seed users always exist.
const users: StoredUser[] = (seedUsers as StoredUser[]).map((user) => ({
  ...user,
}));

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalized);
}

export function findUserById(id: string): StoredUser | undefined {
  return users.find((user) => user.id === id);
}

export function createUser(input: {
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
}): StoredUser {
  const user: StoredUser = {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

/** Project a stored user to the public shape, omitting the password hash. */
export function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  };
}
