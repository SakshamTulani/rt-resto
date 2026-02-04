import { OrderHistoryView } from "@/modules/orders";
import { MainLayout } from "@/modules/shared";

export default function OrdersPage() {
  return (
    <MainLayout>
      <OrderHistoryView />
    </MainLayout>
  );
}
