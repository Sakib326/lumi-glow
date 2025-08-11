import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Types
interface CartItem {
  id: number;
  name: string;
  price: string;
  discountPrice?: string;
  imageSrc: string;
  quantity: number;
  stockStatus?: string;
  totalStock?: number;
}

// Helper function to get image URL
const getImageUrl = (path: string | undefined | null) => {
  if (!path)
    return "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_URL}api/v1/media/single/${path}`;
};

// Cart utilities
const CART_STORAGE_KEY = "lumi_glow_cart";

export const getCartFromStorage = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    return [];
  }
};

export const saveCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
};

export const AddToCart = (product: any, quantity: number = 1) => {
  const cart = getCartFromStorage();

  const cartItem: CartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    discountPrice: product.discountPrice,
    imageSrc: getImageUrl(product.featureImage?.path),
    quantity,
    stockStatus: product.stockStatus,
    totalStock: product.totalStock,
  };

  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex > -1) {
    // Update quantity if item already exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push(cartItem);
  }

  saveCartToStorage(cart);
  return cart;
};

export const removeFromCart = (productId: number) => {
  const cart = getCartFromStorage();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCartToStorage(updatedCart);
  return updatedCart;
};

export const updateCartItemQuantity = (productId: number, quantity: number) => {
  const cart = getCartFromStorage();
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
  }

  saveCartToStorage(cart);
  return cart;
};

export const getCartTotal = (cart: CartItem[]) => {
  return cart.reduce((total, item) => {
    const price = parseFloat(item.discountPrice || item.price);
    return total + price * item.quantity;
  }, 0);
};

export const getCartItemCount = (cart: CartItem[]) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Cart Component
export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(getCartFromStorage());

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity(productId, newQuantity);
    setCart(updatedCart);
  };

  const handleRemoveItem = (productId: number) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
    setCart([]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    navigate("/checkout", {
      state: { cart },
    });
  };

  const total = getCartTotal(cart);
  const itemCount = getCartItemCount(cart);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5-6.5M16 21a2 2 0 11-4 0 2 2 0 014 0zM9 21a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to get started!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={() => navigate("/products")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Continue Shopping
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart items */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Cart Items ({itemCount} {itemCount === 1 ? "item" : "items"}
                    )
                  </h2>
                  {cart.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.map((item) => {
                  const itemPrice = parseFloat(
                    item.discountPrice || item.price
                  );
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
                          <img
                            src={`${item.imageSrc}`}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                {item.name}
                              </h3>

                              {/* Price */}
                              <div className="mt-1 flex items-center space-x-2">
                                <span className="text-lg font-bold text-gray-900">
                                  ৳{item.discountPrice || item.price}
                                </span>
                                {item.discountPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ৳{item.price}
                                  </span>
                                )}
                              </div>

                              {/* Stock Status */}
                              {item.stockStatus && (
                                <div className="mt-1 flex items-center space-x-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      item.stockStatus === "in_stock"
                                        ? "bg-green-500"
                                        : item.stockStatus === "low_stock"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                  ></div>
                                  <span
                                    className={`text-xs ${
                                      item.stockStatus === "in_stock"
                                        ? "text-green-700"
                                        : item.stockStatus === "low_stock"
                                        ? "text-yellow-700"
                                        : "text-red-700"
                                    }`}
                                  >
                                    {item.stockStatus === "in_stock"
                                      ? "In Stock"
                                      : item.stockStatus === "low_stock"
                                      ? "Low Stock"
                                      : "Out of Stock"}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ৳{itemTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={
                                  item.totalStock
                                    ? item.quantity >= item.totalStock
                                    : false
                                }
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white shadow rounded-lg sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-medium">৳{total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">৳0.00</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Proceed to Checkout
                </button>

                <div className="text-center">
                  <button
                    onClick={() => navigate("/products")}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
