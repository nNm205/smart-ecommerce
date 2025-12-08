import { getOrderTotal } from "@/utils/orderUtils";
import ProductImage from "@/components/Orders/ProductImage";
import ProductInfo from "@/components/Orders/ProductInfo";
import OrderActions from "@/components/Orders/OrderActions";
import StatusBadge from "@/components/Orders/StatusBadge";

export default function OrderCard({ order }) {
  const total = getOrderTotal(order);

  return (
    <div className="bg-white rounded-md shadow-sm relative">
      <StatusBadge status={order.status} />

      <div className="px-4 py-4 grid grid-cols-[150px_1fr] gap-4 items-start">
        <ProductImage image={order.product.image} name={order.product.name} />
        <ProductInfo product={order.product} total={total} />
      </div>

      <OrderActions order={order} />
    </div>
  );
}
