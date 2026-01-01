import { useState, useEffect } from "react";
import { reviewService } from "../services/reviewService";

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({
    productId: "",
    userId: "",
    rating: "",
  });

  const fetchReviews = async (page = 0) => {
    setLoading(true);
    try {
      const data = await reviewService.getReviews(page, filters);
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(data.number || 0);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      await fetchReviews(currentPage);
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const resetFilters = () => {
    setFilters({
      productId: "",
      userId: "",
      rating: "",
    });
    setCurrentPage(0);
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, filters]);

  return {
    reviews,
    loading,
    currentPage,
    totalPages,
    totalElements,
    filters,
    setFilters,
    fetchReviews,
    deleteReview,
    applyFilters,
    resetFilters,
    setCurrentPage,
  };
};
