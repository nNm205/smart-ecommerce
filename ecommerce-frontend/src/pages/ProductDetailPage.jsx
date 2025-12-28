import ProductImages from "@/components/ProductDetailPage/ProductImages";
import ProductInfo from "@/components/ProductDetailPage/ProductInfo";
import ProductVariants from "@/components/ProductDetailPage/ProductVariants";
import AddToCartSection from "@/components/ProductDetailPage/AddToCartSection";
import ProductDescription from "@/components/ProductDetailPage/ProductDescription";
import ProductReviews from "@/components/ProductDetailPage/ProductReviews";
import RelatedProducts from "@/components/ProductDetailPage/RelatedProducts";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast.jsx";
import { productService } from "@/services/productService";
import { Loader2 } from "lucide-react";

import useCart from "@/contexts/useCart";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState({ size: null, color: null });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await productService.getProductById(id);
        setProduct(productData);

        if (productData.category && productData.category.id) {
          const relatedData = await productService.getAllProducts({
            categoryId: productData.category.id,
            page: 0,
            size: 10,
          });

          const filtered = (relatedData.content || []).filter(
            (p) => p.id !== productData.id
          );
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching product detail:", error);
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // Scroll về đầu trang khi id thay đổi
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <span className="text-gray-600">
              Đang tải thông tin sản phẩm...
            </span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-10 text-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {error || "Không tìm thấy sản phẩm"}
            </h2>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = async (quantity, buyNow = false) => {
    if (!selected.size) {
      showToast("Vui lòng chọn size trước khi thêm vào giỏ hàng.", "error");
      return;
    }

    const selectedVariant = product.variants?.find(
      (v) => v.size === selected.size
    );
    if (!selectedVariant) {
      showToast("Size này không tồn tại", "error");
      return;
    }

    if (selectedVariant.quantity < quantity) {
      showToast(
        `Size này chỉ còn ${selectedVariant.quantity} sản phẩm`,
        "error"
      );
      return;
    }

    if (selectedVariant.quantity === 0) {
      showToast("Size này đã hết hàng", "error");
      return;
    }

    const color = "mặc định";
    try {
      setIsAddingToCart(true);

      const result = await addToCart(
        product,
        {
          size: selected.size,
          color: color,
        },
        quantity
      );

      if (result.success) {
        showToast(result.message, "success");

        if (buyNow) {
          setTimeout(() => {
            navigate("/checkout");
          }, 500);
        }
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      showToast("Có lỗi xảy ra, vui lòng thử lại!", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : ["https://via.placeholder.com/400x400?text=No+Image"];

  const sizes = product.variants
    ? product.variants.filter((v) => v.quantity > 0).map((v) => v.size)
    : [];
  const colors = ["mặc định"];

  return (
    <div className="w-full flex flex-col bg-white min-h-screen">
      <ToastContainer />
      <Navbar />

      <main className="w-full flex-1 flex justify-center bg-white">
        <div
          className="w-full max-w-[1200px] 
            lg:max-w-[1400px] xl:max-w-[1700px]
            px-3 sm:px-4 md:px-8 lg:px-12
            py-8 md:py-12
            grid grid-cols-1 md:grid-cols-2
            gap-8 md:gap-12 xl:gap-16"
        >
          <div className="flex justify-center md:justify-start items-start">
            <ProductImages images={images} />
          </div>

          <div className="flex flex-col justify-start items-start space-y-4">
            <ProductInfo
              name={product.name}
              price={product.price}
              rating={product.averageRating || 0}
              reviewCount={product.reviewCount || 0}
              stock={product.totalQuantity || 0}
            />
            <div className="mt-4 w-full">
              <ProductVariants
                sizes={sizes}
                colors={colors}
                selected={selected}
                onChange={setSelected}
                variants={product.variants} // Truyền variants để hiển thị số lượng còn lại
              />
              <div className="mt-4 sm:mt-6">
                <AddToCartSection
                  onAddToCart={(quantity) => handleAddToCart(quantity, false)}
                  onBuyNow={(quantity) => handleAddToCart(quantity, true)}
                  isLoading={isAddingToCart}
                  disabled={!selected.size || sizes.length === 0}
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-8 md:mt-10 space-y-8 md:space-y-10">
            <ProductDescription
              description={product.description || "Chưa có mô tả"}
            />
            <ProductReviews
              rating={product.averageRating || 0}
              reviewCount={product.reviewCount || 0}
              reviews={[]}
            />
            <RelatedProducts products={relatedProducts} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetailPage;
