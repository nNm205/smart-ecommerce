import ProfileFormField from "@/components/Profile/ProfileFormField";
import { User, Mail, Phone } from "lucide-react";

export default function ProfileForm({ formData, onChange }) {
  return (
    <div className="space-y-5 max-w-xl mx-auto w-full">
      <ProfileFormField
        icon={User}
        label="Họ và tên"
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Nhập họ và tên"
      />

      <ProfileFormField
        icon={Mail}
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Nhập email"
      />

      <ProfileFormField
        icon={Phone}
        label="Số điện thoại"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={onChange}
        placeholder="Nhập số điện thoại"
      />
    </div>
  );
}
