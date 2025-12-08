import OrderCard from "@/components/Orders/OrderCard";
import EmptyState from "@/components/Orders/EmptyState";

export default function OrderList({ orders }) {
  const useScroll = orders.length > 5;

  return (
    <div
      className={`space-y-4 ${
        useScroll ? "max-h-[800px] overflow-y-auto pr-2" : ""
      }`}
    >
      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}
