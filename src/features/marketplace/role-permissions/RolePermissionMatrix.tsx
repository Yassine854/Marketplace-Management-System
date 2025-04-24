"use client";

import { useState, useEffect } from "react";
import { Role } from "@/types/role";
import { Permission } from "@/types/permission";
import { toast } from "react-hot-toast";
import { FiCheck, FiX } from "react-icons/fi";

interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  actions: string[];
  role: Role;
  permission: Permission;
}

export default function RolePermissionMatrix() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const availableActions = ["create", "read", "update", "delete"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permissionsRes, rolePermissionsRes] = await Promise.all([
        fetch("/api/marketplace/roles/getAll"),
        fetch("/api/marketplace/permissions/getAll"),
        fetch("/api/marketplace/role_permissions/getAll"),
      ]);

      const rolesData = await rolesRes.json();
      const permissionsData = await permissionsRes.json();
      const rolePermissionsData = await rolePermissionsRes.json();

      setRoles(rolesData.roles);
      setPermissions(permissionsData.permissions);
      setRolePermissions(rolePermissionsData.rolePermissions);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setIsLoading(false);
    }
  };

  const getRolePermission = (roleId: string, permissionId: string) => {
    return rolePermissions.find(
      (rp) => rp.roleId === roleId && rp.permissionId === permissionId,
    );
  };

  const handleActionToggle = async (
    roleId: string,
    permissionId: string,
    action: string,
    existingRolePermission?: RolePermission,
  ) => {
    try {
      let newActions: string[];
      let method: string;
      let url: string;
      let body: any;

      if (existingRolePermission) {
        newActions = existingRolePermission.actions.includes(action)
          ? existingRolePermission.actions.filter((a) => a !== action)
          : [...existingRolePermission.actions, action];

        method = "PATCH";
        url = `/api/marketplace/role_permissions/${existingRolePermission.id}`;
        body = {
          roleId,
          permissionId,
          actions: newActions,
        };
      } else {
        newActions = [action];
        method = "POST";
        url = "/api/marketplace/role_permissions/create";
        body = {
          roleId,
          permissionId,
          actions: newActions,
        };
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to update permissions");

      await fetchData();
      toast.success("Permissions updated successfully");
    } catch (err) {
      toast.error("Failed to update permissions");
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">
        <FiX className="mr-2 inline-block" />
        {error}
      </div>
    );

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-xl">
        <div className="min-w-max">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <th className="sticky left-0 z-10 border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                  <div className="text-left text-sm font-semibold text-gray-700">
                    Roles / Resources
                  </div>
                </th>
                {permissions.map((permission) => (
                  <th
                    key={permission.id}
                    className="border-b border-l px-6 py-4"
                  >
                    <div className="space-y-2 text-center">
                      <div className="text-sm font-semibold text-gray-700">
                        {permission.resource}
                      </div>
                      <div className="flex items-center justify-center space-x-4">
                        {availableActions.map((action) => (
                          <span
                            key={action}
                            className="text-xs font-medium uppercase text-gray-500"
                            style={{ transform: "rotate(-45deg)" }}
                          >
                            {action.charAt(0)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="sticky left-0 z-10 whitespace-nowrap border-r bg-white px-6 py-4 hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">
                      {role.name}
                    </div>
                  </td>
                  {permissions.map((permission) => {
                    const rolePermission = getRolePermission(
                      role.id,
                      permission.id,
                    );
                    return (
                      <td
                        key={`${role.id}-${permission.id}`}
                        className="border-l px-6 py-4"
                      >
                        <div className="flex items-center justify-center space-x-4">
                          {availableActions.map((action) => (
                            <label
                              key={action}
                              className="relative inline-block"
                              title={`${action} permission`}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  rolePermission?.actions.includes(action) ??
                                  false
                                }
                                onChange={() =>
                                  handleActionToggle(
                                    role.id,
                                    permission.id,
                                    action,
                                    rolePermission,
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 
                                         shadow-sm transition-all duration-150 
                                         ease-in-out hover:border-blue-400
                                         focus:border-blue-300 focus:ring focus:ring-blue-200
                                         focus:ring-opacity-50"
                              />
                              <span className="pointer-events-none absolute -top-1 bottom-0 left-0 right-0 flex items-center justify-center">
                                {rolePermission?.actions.includes(action) && (
                                  <FiCheck className="h-3 w-3 text-blue-600" />
                                )}
                              </span>
                            </label>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
