import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  toPublicUser,
} from "@/features/auth/server/user-store";

describe("user store", () => {
  describe("findUserByEmail", () => {
    it("finds the seed user", () => {
      const user = findUserByEmail("demo@eaglebank.com");
      expect(user?.id).toBe("usr_demo_0001");
    });

    it("is case-insensitive", () => {
      expect(findUserByEmail("DEMO@EAGLEBANK.COM")?.id).toBe("usr_demo_0001");
      expect(findUserByEmail("  demo@eaglebank.com  ")?.id).toBe("usr_demo_0001");
    });

    it("returns undefined for an unknown email", () => {
      expect(findUserByEmail("nobody@example.com")).toBeUndefined();
    });
  });

  describe("findUserById", () => {
    it("finds the seed user", () => {
      expect(findUserById("usr_demo_0001")?.email).toBe("demo@eaglebank.com");
    });

    it("returns undefined for an unknown id", () => {
      expect(findUserById("usr_does_not_exist")).toBeUndefined();
    });
  });

  describe("createUser", () => {
    it("creates a user and makes them findable by email and id", () => {
      const created = createUser({
        fullName: "Test User",
        email: "new_unique_user_abc123@test.com",
        passwordHash: "hash",
      });

      expect(created.id).toBeTruthy();
      expect(created.email).toBe("new_unique_user_abc123@test.com");
      expect(created.passwordHash).toBe("hash");
      expect(created.createdAt).toBeTruthy();

      expect(findUserById(created.id)?.email).toBe(
        "new_unique_user_abc123@test.com",
      );
      expect(findUserByEmail("new_unique_user_abc123@test.com")?.id).toBe(
        created.id,
      );
    });
  });

  describe("updateUser", () => {
    it("updates fullName, email, phone, and avatarUrl", () => {
      const created = createUser({
        fullName: "Before Update",
        email: "before_update_xyz@test.com",
        passwordHash: "h",
      });

      const updated = updateUser(created.id, {
        fullName: "After Update",
        email: "after_update_xyz@test.com",
        phone: "+44 7700 000001",
        avatarUrl: "data:image/png;base64,abc",
      });

      expect(updated?.fullName).toBe("After Update");
      expect(updated?.email).toBe("after_update_xyz@test.com");
      expect(updated?.phone).toBe("+44 7700 000001");
      expect(updated?.avatarUrl).toBe("data:image/png;base64,abc");
    });

    it("only updates fields that are explicitly provided", () => {
      const created = createUser({
        fullName: "Partial Update",
        email: "partial_update_xyz@test.com",
        passwordHash: "h",
      });

      updateUser(created.id, { fullName: "Changed" });

      const found = findUserById(created.id);
      expect(found?.fullName).toBe("Changed");
      expect(found?.email).toBe("partial_update_xyz@test.com");
    });

    it("returns undefined for an unknown user id", () => {
      expect(updateUser("nonexistent_id", { fullName: "Ghost" })).toBeUndefined();
    });
  });

  describe("toPublicUser", () => {
    it("strips passwordHash and preserves all other fields", () => {
      const stored = createUser({
        fullName: "Public View",
        email: "public_view_xyz@test.com",
        phone: "+1 555 0000",
        passwordHash: "secret",
      });
      stored.avatarUrl = "data:image/png;base64,xyz";

      const pub = toPublicUser(stored);

      expect(pub.id).toBe(stored.id);
      expect(pub.fullName).toBe("Public View");
      expect(pub.email).toBe("public_view_xyz@test.com");
      expect(pub.phone).toBe("+1 555 0000");
      expect(pub.avatarUrl).toBe("data:image/png;base64,xyz");
      expect(pub.createdAt).toBe(stored.createdAt);
      expect("passwordHash" in pub).toBe(false);
    });
  });
});
