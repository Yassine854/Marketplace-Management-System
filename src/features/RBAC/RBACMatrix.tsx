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
      // toast.success('Permissions updated successfully');
    } catch (err) {
      //  toast.error('Failed to update permissions');
      console.error(err);
    }
  };
  const isAllActionsSelected = (roleId: string) => {
    return permissions.every((permission) =>
      availableActions.every((action) => {
        const rp = getRolePermission(roleId, permission.id);
        return rp?.actions.includes(action) ?? false;
      }),
    );
  };

  const handleSelectAllToggle = async (roleId: string) => {
    const allSelected = isAllActionsSelected(roleId);
    try {
      const updates = [];
      for (const permission of permissions) {
        for (const action of availableActions) {
          const rolePermission = getRolePermission(roleId, permission.id);
          const currentActions = rolePermission?.actions || [];
          const hasAction = currentActions.includes(action);

          if (!allSelected && !hasAction) {
            updates.push({
              roleId,
              permissionId: permission.id,
              action,
              rolePermission,
            });
          } else if (allSelected && hasAction) {
            updates.push({
              roleId,
              permissionId: permission.id,
              action,
              rolePermission,
            });
          }
        }
      }

      const requests = updates.map(
        ({ roleId, permissionId, action, rolePermission }) =>
          handleActionToggle(roleId, permissionId, action, rolePermission),
      );

      await Promise.all(requests);
      await fetchData();
      toast.success("Toutes les permissions ont été mises à jour");
    } catch (err) {
      toast.error("Échec de la mise à jour des permissions");
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
    <div className="m-3 p-6">
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-xl">
        <div className="min-w-max">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <th className="sticky left-0 z-10 border-b bg-primary px-6 py-4">
                  <div className="text-left text-sm font-semibold text-white">
                    Roles / Resources
                  </div>
                </th>
                {permissions.map((permission) => (
                  <th
                    key={permission.id}
                    colSpan={4}
                    className="border-b border-l bg-primary px-6 py-4"
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white">
                        {permission.resource}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th className="sticky left-0 bg-white"></th>
                {permissions.map((permission) =>
                  availableActions.map((action) => (
                    <th
                      key={`${permission.id}-${action}`}
                      className="border-l border-t border-gray-200 px-3 py-2 text-xs font-medium uppercase text-gray-500"
                    >
                      {action}
                    </th>
                  )),
                )}
                <th className="sticky right-0 bg-white"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="sticky left-0 z-10 whitespace-nowrap border-r bg-white px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {role.name}
                    </div>
                  </td>
                  {permissions.map((permission) =>
                    availableActions.map((action) => {
                      const rolePermission = getRolePermission(
                        role.id,
                        permission.id,
                      );
                      return (
                        <td
                          key={`${role.id}-${permission.id}-${action}`}
                          className="border-l px-3 py-2"
                        >
                          <label className="relative flex justify-center">
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
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 shadow-sm"
                            />
                            {rolePermission?.actions.includes(action) && (
                              <FiCheck className="absolute h-3 w-3 text-blue-600" />
                            )}
                          </label>
                        </td>
                      );
                    }),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
