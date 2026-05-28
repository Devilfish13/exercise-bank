import { loginSchema, registerSchema, updateProfileSchema } from "@/features/auth/schemas";

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "demo@eaglebank.com",
      password: "Password123!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Password123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "demo@eaglebank.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    fullName: "Alex Morgan",
    email: "alex@eaglebank.com",
    phone: "",
    password: "Password123!",
    confirmPassword: "Password123!",
  };

  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a weak password missing an uppercase letter", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "password1",
      confirmPassword: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords on the confirmPassword field", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "Different123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes("confirmPassword"),
      );
      expect(issue?.message).toBe("Passwords do not match");
    }
  });
});

describe("updateProfileSchema", () => {
  const valid = {
    fullName: "Alex Morgan",
    email: "alex@eaglebank.com",
    phone: "+44 7700 900000",
  };

  it("accepts a valid profile update", () => {
    expect(updateProfileSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an optional avatarUrl", () => {
    const result = updateProfileSchema.safeParse({
      ...valid,
      avatarUrl: "data:image/png;base64,abc",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty phone (treated as optional)", () => {
    expect(
      updateProfileSchema.safeParse({ ...valid, phone: "" }).success,
    ).toBe(true);
  });

  it("rejects a name shorter than two characters", () => {
    const result = updateProfileSchema.safeParse({ ...valid, fullName: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = updateProfileSchema.safeParse({
      ...valid,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });
});
