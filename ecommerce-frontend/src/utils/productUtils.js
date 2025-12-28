export const isNewProduct = (product, days = 7) => {
  if (!product || !product.createdAt) return false;

  const now = new Date();
  const createdDate = new Date(product.createdAt);
  const diffTime = now - createdDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= days;
};

export const filterNewProducts = (products, days = 7) => {
  if (!Array.isArray(products)) return [];
  return products.filter((product) => isNewProduct(product, days));
};

export const formatPrice = (price) => {
  if (!price && price !== 0) return "Liên hệ";
  return price.toLocaleString("vi-VN") + "₫";
};

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN");
};

export const getDaysFromCreated = (createdAt) => {
  if (!createdAt) return 0;
  const now = new Date();
  const created = new Date(createdAt);
  const diffTime = now - created;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
