import { MapPin } from "lucide-react";
import AddressCard from "@/components/Addresses/AddressCard";

export default function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MapPin size={48} className="mx-auto mb-3 opacity-30" />
        <p>Chưa có địa chỉ nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
}
