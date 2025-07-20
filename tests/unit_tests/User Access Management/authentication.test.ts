// Place all mocks at the top!
jest.mock("@/clients/prisma/getUser", () => ({
  getUser: jest.fn(),
}));
jest.mock("@/clients/prisma/prismaClient", () => ({
  prismaClient: {
    partner: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock("@/utils/password/isPasswordValid", () => ({
  isPasswordValid: jest.fn(),
}));
jest.mock("@/utils/logError", () => ({
  logError: jest.fn(),
}));

import { handleAuthentication } from "../../../src/services/auth/handleAuthentication";
import jwt from "jsonwebtoken";

const { getUser } = require("@/clients/prisma/getUser");
const { prismaClient } = require("@/clients/prisma/prismaClient");
const { isPasswordValid } = require("@/utils/password/isPasswordValid");

describe("Authentication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user object for valid username and password", async () => {
    getUser.mockResolvedValue({ username: "intern", password: "hashed" });
    isPasswordValid.mockResolvedValue(true);

    const result = await handleAuthentication("intern", "intern");
    expect(result).not.toBeNull();
    expect(result).toHaveProperty("userType");
  });

  it("should return null for invalid username or password", async () => {
    getUser.mockResolvedValue(null);
    prismaClient.partner.findUnique.mockResolvedValue(null);

    const result = await handleAuthentication("wrong", "wrong");
    expect(result).toBeNull();
  });

  it("should reject an invalid token", () => {
    const invalidToken = "invalid.token.here";
    expect(() => jwt.verify(invalidToken, "your_jwt_secret")).toThrow();
  });
});
