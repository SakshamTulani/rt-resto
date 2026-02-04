export default function AdminDashboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Live Orders</h2>
          <p className="text-muted-foreground">0 Active Orders</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Menu Items</h2>
          <p className="text-muted-foreground">Manage your food and drinks</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Revenue</h2>
          <p className="text-muted-foreground">$0.00 Today</p>
        </div>
      </div>
    </div>
  );
}
