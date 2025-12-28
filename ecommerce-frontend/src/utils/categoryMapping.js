import { categoryService } from "@/services/categoryService";

let categoriesCache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000;

const getHardcodedCategories = () => {
  return [
    // Nhóm Áo nam
    { id: 1, name: "Áo thun", slug: "ao-thun", group: "ao-nam" },
    { id: 2, name: "Áo sơ mi", slug: "ao-so-mi", group: "ao-nam" },
    { id: 3, name: "Áo khoác", slug: "ao-khoac", group: "ao-nam" },
    { id: 4, name: "Áo polo", slug: "ao-polo", group: "ao-nam" },

    // Nhóm Quần nam
    { id: 5, name: "Quần tây", slug: "quan-tay", group: "quan-nam" },
    { id: 6, name: "Quần short", slug: "quan-short", group: "quan-nam" },
    { id: 7, name: "Quần jeans", slug: "quan-jeans", group: "quan-nam" },
    { id: 8, name: "Quần boxer", slug: "quan-boxer", group: "quan-nam" },
    { id: 9, name: "Quần jogger", slug: "quan-jogger", group: "quan-nam" },

    // Nhóm Giày & Phụ kiện
    { id: 10, name: "Giày & dép", slug: "giay-dep", group: "nhom-phu-kien" },
    { id: 11, name: "Nón", slug: "non", group: "nhom-phu-kien" },
    { id: 12, name: "Thắt lưng", slug: "that-lung", group: "nhom-phu-kien" },
    { id: 13, name: "Vớ", slug: "vo", group: "nhom-phu-kien" },
    { id: 14, name: "Mắt kính", slug: "mat-kinh", group: "nhom-phu-kien" },
  ];
};

export const categoryGroupNames = {
  "ao-nam": "Áo Nam",
  "quan-nam": "Quần Nam",
  "nhom-phu-kien": "Giày & Phụ kiện",
};

const generateSlug = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const determineGroup = (category) => {
  const name = category.name.toLowerCase();
  const id = category.id;

  if (id >= 1 && id <= 4) return "ao-nam";
  else if (id >= 5 && id <= 9) return "quan-nam";
  else if (id >= 10 && id <= 14) return "nhom-phu-kien";

  if (name.includes("áo") || name.includes("ao")) return "ao-nam";
  else if (name.includes("quần") || name.includes("quan")) return "quan-nam";
  else return "nhom-phu-kien";
};

export const fetchAllCategories = async () => {
  if (categoriesCache && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
    return categoriesCache;
  }

  try {
    const categories = await categoryService.getAllCategories();

    const categoriesWithSlug = categories.map((cat) => ({
      ...cat,
      slug: generateSlug(cat.name),
      group: determineGroup(cat),
    }));

    categoriesCache = categoriesWithSlug;
    cacheTime = Date.now();
    return categoriesWithSlug;
  } catch (error) {
    console.error("Error fetching categories:", error);

    if (categoriesCache) {
      return categoriesCache;
    }
    // Fallback về hardcoded categories
    return getHardcodedCategories();
  }
};

export const getCategoryIdBySlug = async (slug) => {
  try {
    const categories = await fetchAllCategories();
    const category = categories.find((cat) => cat.slug === slug);
    return category?.id || null;
  } catch (error) {
    console.error("Error getting category ID by slug:", error);
    return null;
  }
};

export const getCategoryNameBySlug = async (slug) => {
  try {
    const categories = await fetchAllCategories();
    const category = categories.find((cat) => cat.slug === slug);
    return category?.name || "";
  } catch (error) {
    console.error("Error getting category name by slug:", error);
    return "";
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const categories = await fetchAllCategories();
    return categories.find((cat) => cat.slug === slug) || null;
  } catch (error) {
    console.error("Error getting category by slug:", error);
    return null;
  }
};

export const getCategoriesByGroup = async (group) => {
  try {
    const categories = await fetchAllCategories();
    return categories.filter((cat) => cat.group === group);
  } catch (error) {
    console.error("Error getting categories by group:", error);
    return [];
  }
};

export const getCategoryIdsByGroup = async (group) => {
  try {
    const categories = await getCategoriesByGroup(group);
    return categories.map((cat) => cat.id);
  } catch (error) {
    console.error("Error getting category IDs by group:", error);
    return [];
  }
};

export const clearCategoriesCache = () => {
  categoriesCache = null;
  cacheTime = null;
};
