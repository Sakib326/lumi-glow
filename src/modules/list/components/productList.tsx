import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { useGetProductsQuery } from "../../../appStore/products/api";
import { useNavigate } from "react-router-dom";
import { AddToCart } from "../../../components/Cart";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// Helper function to get image URL with null safety
const getImageUrl = (path: string | undefined | null) => {
  if (!path)
    return "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_URL}api/v1/media/single/${path}`;
};

// Types
interface FilterParams {
  categoryId?: number;
  keyword?: string;
  isDiscounted?: boolean;
  limit?: number;
  page?: number;
  sort?: string;
}

interface FilterOption {
  value: string;
  label: string;
  checked: boolean;
}

interface Filter {
  id: string;
  name: string;
  options: FilterOption[];
}

interface ProductListProps {
  filterParams: FilterParams;
  selectedCategory: string | null;
  searchKeyword: string;
  activeFilters: Filter[];
}

export default function ProductList({
  filterParams,
  selectedCategory,
  searchKeyword,
  activeFilters,
}: ProductListProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchKeyword, activeFilters]);

  const handleAddToCart = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (product.stockStatus === "out_of_stock") return;

    AddToCart(product, 1);

    // Optional: Show success message
    // You can add a toast notification here
    console.log(`Added ${product.name} to cart`);
  };

  // Fetch products with current filters
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery({
    ...filterParams,
    page: currentPage,
  });

  const products = productsResponse?.data || [];
  const totalPages = Math.ceil(
    (productsResponse?.total || 0) / (filterParams.limit || 12)
  );

  // Handle product click
  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  // Calculate discount percentage
  const getDiscountPercentage = (
    price: string,
    discountPrice: string | null
  ) => {
    if (!discountPrice) return 0;
    const original = parseFloat(price);
    const discount = parseFloat(discountPrice);
    if (original > 0 && discount > 0) {
      return Math.round(((original - discount) / original) * 100);
    }
    return 0;
  };

  // Get active filter summary
  const getActiveFilterSummary = () => {
    const activeCount = activeFilters.reduce((count, section) => {
      return count + section.options.filter((option) => option.checked).length;
    }, 0);

    if (selectedCategory || searchKeyword || activeCount > 0) {
      return `${productsResponse?.total || 0} products found`;
    }
    return `${productsResponse?.total || 0} products`;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination numbers
  const getPaginationPages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis logic
      if (currentPage <= 3) {
        // Show first 3 pages + ellipsis + last page
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 3 pages
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // Show first + ellipsis + current-1, current, current+1 + ellipsis + last
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  // Loading state
  if (isLoading && currentPage === 1) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-sm text-red-600 mb-2">
                Failed to load products
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m0 0V4a1 1 0 00-1-1H5a1 1 0 00-1 1v1h0"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchKeyword
                  ? `No products match your search for "${searchKeyword}"`
                  : "Try adjusting your filters to see more products"}
              </p>
              <button
                onClick={() => (window.location.href = "/products")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View All Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        {/* Results summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
          <p className="text-sm text-gray-500">{getActiveFilterSummary()}</p>
          <div className="flex items-center space-x-4">
            {searchKeyword && (
              <p className="text-sm text-gray-700">
                Results for:{" "}
                <span className="font-medium">"{searchKeyword}"</span>
              </p>
            )}
            {totalPages > 1 && (
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>

        {/* Loading overlay for page changes */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        <h2 className="sr-only">Products</h2>

        <div
          className={`-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4 ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          {products.map((product) => {
            const discountPercentage = getDiscountPercentage(
              product.price,
              product.discountPrice
            );

            return (
              <div
                key={product.id}
                className="group relative border-r border-b border-gray-200 p-4 sm:p-6"
              >
                {/* Product Image */}
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                  <img
                    src={getImageUrl(product.featureImage?.path)}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                    }}
                  />

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      -{discountPercentage}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="pt-4 pb-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating Stars */}
                  <div className="mt-2 flex justify-center items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            4 > rating ? "text-yellow-400" : "text-gray-200",
                            "flex-shrink-0 h-4 w-4"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">(4.0)</p>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    {product.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">
                          ৳{product.discountPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ৳{product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ৳{product.price}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleProductClick(product.id)}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      View Details
                    </button>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stockStatus === "out_of_stock"}
                      className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {product.stockStatus === "out_of_stock"
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              {/* Mobile pagination */}
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * (filterParams.limit || 12) + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * (filterParams.limit || 12),
                      productsResponse?.total || 0
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {productsResponse?.total || 0}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  {/* Previous button */}
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Page numbers */}
                  {getPaginationPages().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNumber = page as number;
                    const isCurrentPage = pageNumber === currentPage;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={classNames(
                          isCurrentPage
                            ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        )}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
