import { hashPassword } from "./index";

describe("hashPassword", () => {
  it("should return a consistent hash for the same input", () => {
    const password = "password123";
    const hashedPassword1 = hashPassword(password);
    const hashedPassword2 = hashPassword(password);
    expect(hashedPassword1).toBe(hashedPassword2);
  });

  it("should return different hashes for different inputs", () => {
    const password1 = "password123";
    const password2 = "differentPassword";
    const hashedPassword1 = hashPassword(password1);
    const hashedPassword2 = hashPassword(password2);
    expect(hashedPassword1).not.toBe(hashedPassword2);
  });

  it("should handle empty string", () => {
    const password = "";
    const hashedPassword = hashPassword(password);
    expect(hashedPassword).toBe("0");
  });

  it("should handle common passwords correctly", () => {
    const commonPasswords = [
      "123456",
      "password",
      "123456789",
      "12345678",
      "12345",
    ];
    const hashedPasswords = commonPasswords.map(hashPassword);

    // Ensure that hashes are consistent and unique
    for (let i = 0; i < commonPasswords.length; i++) {
      expect(hashedPasswords[i]).toBe(hashPassword(commonPasswords[i]));
      for (let j = i + 1; j < commonPasswords.length; j++) {
        expect(hashedPasswords[i]).not.toBe(hashedPasswords[j]);
      }
    }
  });
});
