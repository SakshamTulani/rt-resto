import { LiveOrdersView } from "@/modules/orders";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="container py-4 flex-none">
        <h1 className="text-2xl font-bold">Live Kitchen Board</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <LiveOrdersView />
      </div>
    </div>
  );
}
