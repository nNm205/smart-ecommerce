import { useMemo, useState } from "react";
import mockOrders from "@/data/orders";
import StatusFilter from "@/components/Orders/StatusFilter";
import OrderList from "@/components/Orders/OrderList";

export default function OrdersTab() {
  const [filter, setFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    if (filter === "All") return mockOrders;
    return mockOrders.filter((o) => o.status === filter);
  }, [filter]);

  return (
    <div>
      <h1 className="text-4xl text-center font-semibold mb-4">
        Đơn hàng của tôi
      </h1>

      <StatusFilter filter={filter} setFilter={setFilter} />
      <OrderList orders={filteredOrders} />
    </div>
  );
}
