import ProductImages from "@/components/ProductDetailPage/ProductImages";
import ProductInfo from "@/components/ProductDetailPage/ProductInfo";
import ProductVariants from "@/components/ProductDetailPage/ProductVariants";
import AddToCartSection from "@/components/ProductDetailPage/AddToCartSection";
import ProductDescription from "@/components/ProductDetailPage/ProductDescription";
import ProductReviews from "@/components/ProductDetailPage/ProductReviews";
import RelatedProducts from "@/components/ProductDetailPage/RelatedProducts";
import VirtualTryOnModal from "@/components/VirtualTryOnModal";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast.jsx";
import { productService } from "@/services/productService";
import { reviewService } from "@/services/reviewService";
import { Loader2 } from "lucide-react";

import useCart from "@/contexts/useCart";
import useAuth from "@/contexts/useAuth";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  const [selected, setSelected] = useState({ size: null, color: null });
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { auth } = useAuth();
  const { showToast, ToastContainer } = useToast();

  // Fetch product và reviews
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await productService.getProductById(id);
        setProduct(productData);

        // Fetch reviews
        try {
          const reviewsData = await reviewService.getReviewsByProductId(id);
          console.log("Reviews data:", reviewsData);
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        } catch (reviewError) {
          console.error("Error fetching reviews:", reviewError);
          setReviews([]);
        }

        // Fetch related products
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Thêm review mới
  const handleAddReview = async (reviewData) => {
    if (!auth.isAuthenticated) {
      showToast("Vui lòng đăng nhập để đánh giá", "error");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return false;
    }

    try {
      setIsLoadingReview(true);
      console.log("Sending review data:", {
        userId: auth.userId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      const newReview = await reviewService.createReview(id, {
        userId: auth.userId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      console.log("New review created:", newReview);

      // Thêm review mới vào đầu danh sách
      setReviews([newReview, ...reviews]);

      // Cập nhật rating của sản phẩm
      const updatedProduct = { ...product };
      updatedProduct.reviewCount = (updatedProduct.reviewCount || 0) + 1;
      const totalRating =
        (updatedProduct.averageRating || 0) * (updatedProduct.reviewCount - 1);
      updatedProduct.averageRating =
        (totalRating + reviewData.rating) / updatedProduct.reviewCount;
      setProduct(updatedProduct);

      showToast("Đánh giá của bạn đã được gửi thành công!", "success");
      return true;
    } catch (error) {
      console.error("Error adding review:", error);

      // Xử lý error message từ backend
      let errorMessage = "Có lỗi xảy ra khi gửi đánh giá";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Bạn đã đánh giá sản phẩm này rồi";
      } else if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại";
      }

      showToast(errorMessage, "error");
      return false;
    } finally {
      setIsLoadingReview(false);
    }
  };

  // Cập nhật review
  const handleUpdateReview = async (reviewId, reviewData) => {
    if (!auth.isAuthenticated) {
      showToast("Vui lòng đăng nhập", "error");
      return false;
    }

    try {
      setIsLoadingReview(true);
      console.log("Updating review:", reviewId, reviewData);

      const updatedReview = await reviewService.updateReview(
        id,
        reviewId,
        reviewData
      );

      console.log("Review updated:", updatedReview);

      // Cập nhật review trong danh sách
      setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));

      // Tính lại rating trung bình
      const oldReview = reviews.find((r) => r.id === reviewId);
      if (oldReview && product.reviewCount > 0) {
        const totalRating = (product.averageRating || 0) * product.reviewCount;
        const newTotalRating =
          totalRating - oldReview.rating + reviewData.rating;
        const updatedProduct = { ...product };
        updatedProduct.averageRating = newTotalRating / product.reviewCount;
        setProduct(updatedProduct);
      }

      showToast("Đánh giá đã được cập nhật thành công", "success");
      return true;
    } catch (error) {
      console.error("Error updating review:", error);

      let errorMessage = "Có lỗi xảy ra khi cập nhật đánh giá";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại";
      } else if (error.response?.status === 403) {
        errorMessage = "Bạn không có quyền cập nhật đánh giá này";
      }

      showToast(errorMessage, "error");
      return false;
    } finally {
      setIsLoadingReview(false);
    }
  };

  // Xóa review
  const handleDeleteReview = async (reviewId) => {
    if (!auth.isAuthenticated) {
      showToast("Vui lòng đăng nhập", "error");
      return false;
    }

    try {
      setIsLoadingReview(true);
      console.log("Deleting review:", reviewId);

      await reviewService.deleteReview(id, reviewId);

      const deletedReview = reviews.find((r) => r.id === reviewId);

      // Xóa review khỏi danh sách
      setReviews(reviews.filter((r) => r.id !== reviewId));

      // Cập nhật rating
      if (deletedReview && product.reviewCount > 1) {
        const totalRating = (product.averageRating || 0) * product.reviewCount;
        const newTotalRating = totalRating - deletedReview.rating;
        const updatedProduct = { ...product };
        updatedProduct.reviewCount = product.reviewCount - 1;
        updatedProduct.averageRating =
          newTotalRating / updatedProduct.reviewCount;
        setProduct(updatedProduct);
      } else if (product.reviewCount === 1) {
        const updatedProduct = { ...product };
        updatedProduct.reviewCount = 0;
        updatedProduct.averageRating = 0;
        setProduct(updatedProduct);
      }

      showToast("Đánh giá đã được xóa thành công", "success");
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);

      let errorMessage = "Có lỗi xảy ra khi xóa đánh giá";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại";
      } else if (error.response?.status === 403) {
        errorMessage = "Bạn không có quyền xóa đánh giá này";
      }

      showToast(errorMessage, "error");
      return false;
    } finally {
      setIsLoadingReview(false);
    }
  };

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

  const handleTryOnSuccess = () => {
    showToast(
      "Thử đồ thành công! Bạn có thể thêm sản phẩm vào giỏ hàng.",
      "success"
    );
  };

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

  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : ["https://via.placeholder.com/400x400?text=No+Image"];

  const sizes = product.variants
    ? product.variants.filter((v) => v.quantity > 0).map((v) => v.size)
    : [];
  const colors = ["mặc định"];

  const productImageForTryOn = images[0];

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
                variants={product.variants}
              />
              <div className="mt-4 sm:mt-6 space-y-3">
                <button
                  onClick={() => setIsTryOnModalOpen(true)}
                  className="w-full py-3 px-6 rounded-lg font-semibold 
                    bg-gradient-to-r from-purple-600 to-pink-600 
                    hover:from-purple-700 hover:to-pink-700 
                    text-white shadow-lg hover:shadow-xl 
                    transition-all duration-200 
                    flex items-center justify-center gap-2
                    transform hover:scale-[1.02]"
                >
                  <span>Thử đồ ảo miễn phí</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    AI
                  </span>
                </button>

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
              reviews={reviews}
              currentUserId={auth.userId}
              isAuthenticated={auth.isAuthenticated}
              onAddReview={handleAddReview}
              onUpdateReview={handleUpdateReview}
              onDeleteReview={handleDeleteReview}
              isLoadingAction={isLoadingReview}
            />

            <RelatedProducts products={relatedProducts} />
          </div>
        </div>
      </main>

      <Footer />

      {/* VIRTUAL TRY-ON MODAL */}
      <VirtualTryOnModal
        isOpen={isTryOnModalOpen}
        onClose={() => setIsTryOnModalOpen(false)}
        productImage={productImageForTryOn}
        productName={product.name}
        onSuccess={handleTryOnSuccess}
      />
    </div>
  );
}

export default ProductDetailPage;
