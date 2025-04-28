import RolePermissionMatrix from "./RBACMatrix";
export default function RolePermissionsPage() {
  return (
    <div className="container mx-auto mt-10 px-4 py-8">
      <div className="m-6 mb-8">
        <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-primary">
          Role Permissions
        </h1>
      </div>
      <RolePermissionMatrix />
    </div>
  );
}
