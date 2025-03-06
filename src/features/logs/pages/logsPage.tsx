// app/logs/page.tsx
import LogTable from "../Table/LogTable";

export default function LogsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LogTable isSidebarOpen={true} />
    </div>
  );
}
