import { hashPassword } from "./hashPassword";
import { isPasswordValid } from "./isPasswordValid";

describe("isPasswordValid", () => {
  it("should return true for a valid password", () => {
    const password = "password123";
    const storedPassword = hashPassword(password);
    expect(isPasswordValid(password, storedPassword)).toBe(true);
  });

  it("should return false for an invalid password", () => {
    const password = "password123";
    const storedPassword = hashPassword("differentPassword");
    expect(isPasswordValid(password, storedPassword)).toBe(false);
  });

  it("should return false for an empty password", () => {
    const password = "";
    const storedPassword = hashPassword("password123");
    expect(isPasswordValid(password, storedPassword)).toBe(false);
  });

  it("should handle common passwords correctly", () => {
    const commonPasswords = [
      "123456",
      "password",
      "123456789",
      "12345678",
      "12345",
    ];

    commonPasswords.forEach((password) => {
      const storedPassword = hashPassword(password);
      expect(isPasswordValid(password, storedPassword)).toBe(true);
    });

    // Check against wrong stored passwords
    commonPasswords.forEach((password, index) => {
      const wrongStoredPassword = hashPassword(
        commonPasswords[(index + 1) % commonPasswords.length],
      );
      expect(isPasswordValid(password, wrongStoredPassword)).toBe(false);
    });
  });
});
