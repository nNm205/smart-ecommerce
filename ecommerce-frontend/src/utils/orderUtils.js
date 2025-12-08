export function formatVnd(num) {
  return Number(num).toLocaleString() + "₫";
}

export function getOrderTotal(order) {
  const p = order.product;
  return Number(p.qty) * Number(p.unitPrice || 0);
}

export function getActionConfig(status) {
  const deliveredStatuses = ["Delivered", "Rated", "Unrated"];
  const cancelableStatuses = ["Processing", "AwaitingPickup", "Shipping"];

  if (deliveredStatuses.includes(status)) {
    return {
      label: "Mua lại",
      bgColor: "bg-blue-600",
      textColor: "text-white",
    };
  }

  if (cancelableStatuses.includes(status)) {
    return {
      label: "Hủy đơn",
      bgColor: "bg-red-600",
      textColor: "text-white",
    };
  }

  return {
    label: "Xem chi tiết",
    bgColor: "bg-gray-200",
    textColor: "text-gray-800",
  };
}

export function getStatusBadgeClass(status) {
  const statusStyles = {
    Processing: "bg-yellow-100 text-yellow-800",
    AwaitingPickup: "bg-orange-100 text-orange-800",
    Shipping: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Canceled: "bg-gray-100 text-gray-800",
    Returned: "bg-red-100 text-red-800",
    Rated: "bg-indigo-100 text-indigo-800",
    Unrated: "bg-indigo-100 text-indigo-800",
  };

  return statusStyles[status] || "bg-gray-100 text-gray-800";
}
