import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface UserSession {
  id: string;
  roleId: string;
  mRoleId: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  userType?: string;
}

/**
 * Get user's role information for both admin and partner users
 * @param user - The user session object
 * @returns The role object or null if not found
 */
export async function getUserRole(user: UserSession) {
  try {
    if (user.userType === "partner" && user.mRoleId) {
      // For partners, use mRoleId
      return await prisma.role.findUnique({
        where: { id: user.mRoleId },
      });
    } else if (user.userType === "admin") {
      // For admin users, check if they have KamiounAdminMaster role
      // Since admin users don't have mRoleId set, we need to handle this differently
      // For now, we'll check if the user has admin privileges by looking for KamiounAdminMaster role
      return await prisma.role.findFirst({
        where: { name: "KamiounAdminMaster" },
      });
    }

    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

/**
 * Check if user is KamiounAdminMaster
 * @param user - The user session object
 * @returns boolean indicating if user is KamiounAdminMaster
 */
export async function isKamiounAdminMaster(
  user: UserSession,
): Promise<boolean> {
  const userRole = await getUserRole(user);
  return userRole?.name === "KamiounAdminMaster";
}

/**
 * Get the appropriate role ID for permission checking
 * @param user - The user session object
 * @returns The role ID to use for permission checks
 */
export function getRoleIdForPermissions(user: UserSession): string | null {
  if (user.userType === "partner") {
    return user.mRoleId || null;
  } else if (user.userType === "admin") {
    // For admin users, we need to handle this differently
    // Since they don't have mRoleId, we might need to use a different approach
    // For now, return null and let the calling code handle it
    return null;
  }
  return null;
}
