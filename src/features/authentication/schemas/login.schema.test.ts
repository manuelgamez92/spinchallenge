import { describe, expect, it } from "vitest";

import { loginSchema } from "@/src/features/authentication/schemas/login.schema";

describe("loginSchema", () => {
  it("accepts the allowed email", () => {
    const result = loginSchema.safeParse({ identifier: "test.user@spin.com" });

    expect(result.success).toBe(true);
  });

  it("accepts the allowed phone number", () => {
    const result = loginSchema.safeParse({ identifier: "52 66 2298 5745" });

    expect(result.success).toBe(true);
  });

  it("rejects non-allowed email domains", () => {
    const result = loginSchema.safeParse({ identifier: "test.user@spin.dev" });

    expect(result.success).toBe(false);
  });

  it("rejects phone numbers different from the allowed one", () => {
    const result = loginSchema.safeParse({ identifier: "52 66 2298 5744" });

    expect(result.success).toBe(false);
  });
});