import { apiSlice } from "../api_slice";

// Product snapshot for order items
export interface ProductSnapshot {
  id: number;
  name: string;
  sku: string;
  image: string;
  category: number;
}

// Order item for user checkouts
export interface UserCheckoutItem {
  id: number;
  quantity: number;
  price: string;
  total: string;
  productSnapshot: ProductSnapshot;
  __entity: string;
}

// Status for user checkouts
export interface CheckoutStatus {
  id: number;
  name: string;
  __entity: string;
}

// Coupon for user checkouts
export interface CheckoutCoupon {
  code: string;
  __entity: string;
}

// User checkout/order type
export interface UserCheckout {
  id: number;
  orderNumber: string;
  shipping: string;
  discount: string;
  total: string;
  createdAt: string;
  items: UserCheckoutItem[];
  status: CheckoutStatus;
  coupon?: CheckoutCoupon;
  __entity: string;
}

// Response for getUserCheckouts
export interface GetUserCheckoutsResponse {
  data: UserCheckout[];
  total: number;
}

// Params for getUserCheckouts
export interface GetUserCheckoutsParams {
  limit?: number;
  page?: number;
}

// --- Existing types for other endpoints (shortened for brevity) ---
interface CheckoutItem {
  productId: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: string;
  discountPrice?: string;
  featureImage?: {
    path: string;
  };
  stockStatus: string;
  totalStock?: number;
}

interface Address {
  id: number;
  type: "home" | "office" | "other";
  fullName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  region: string;
  landmark?: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  notes?: string;
}

interface ShippingMethod {
  id: number;
  name: string;
  description?: string;
  price: number;
  estimatedDays: number;
  isActive: boolean;
}

interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minimumAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

interface CheckoutItemWithProduct extends CheckoutItem {
  product: Product;
  subtotal: number;
}

interface CreateCheckoutRequest {
  items: CheckoutItem[];
  billingAddressId: number;
  shippingAddressId: number;
  shippingMethodId: number;
  paymentMethod: "cash" | "stripe";
  couponCode?: string;
  notes?: string;
}

interface Checkout {
  id: number;
  userId: number;
  items: CheckoutItemWithProduct[];
  billingAddress: Address;
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: "cash" | "card";
  coupon?: Coupon;
  couponCode?: string;
  notes?: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "expired";
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCheckoutResponse {
  checkout: Checkout;
  message: string;
}

interface GetCheckoutResponse {
  checkout: Checkout;
}

interface CreateCheckoutFromCartResponse {
  checkout: Checkout;
  message: string;
}

interface ValidateCouponResponse {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}

interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  checkoutId?: number;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

interface CheckoutErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export const checkoutApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create checkout
    createCheckout: build.mutation<
      CreateCheckoutResponse,
      CreateCheckoutRequest
    >({
      query: (checkoutData) => ({
        url: "/api/v1/user/checkout",
        method: "POST",
        body: checkoutData,
      }),
      invalidatesTags: ["Checkout"],
    }),

    // Get user checkouts with pagination (NEW TYPE)
    getUserCheckouts: build.query<
      GetUserCheckoutsResponse,
      GetUserCheckoutsParams
    >({
      query: (params = {}) => {
        const { limit = 10, page = 1 } = params;

        return {
          url: "/api/v1/user/checkout/user-checkouts",
          method: "GET",
          params: {
            limit,
            page,
          },
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Checkout" as const,
                id,
              })),
              { type: "Checkout", id: "LIST" },
            ]
          : [{ type: "Checkout", id: "LIST" }],
    }),

    // Create checkout from cart
    createCheckoutFromCart: build.mutation<
      CreateCheckoutFromCartResponse,
      Omit<CreateCheckoutRequest, "items">
    >({
      query: (checkoutData) => ({
        url: "/api/v1/user/checkout/cart",
        method: "POST",
        body: checkoutData,
      }),
      invalidatesTags: ["Checkout"],
    }),

    // Get checkout by ID
    getCheckoutById: build.query<GetCheckoutResponse, number>({
      query: (id) => ({
        url: `/api/v1/user/checkout/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Checkout", id }],
    }),

    // Validate coupon for checkout
    validateCoupon: build.mutation<
      ValidateCouponResponse,
      { checkoutId: number; couponId: number }
    >({
      query: ({ checkoutId, couponId }) => ({
        url: `/api/v1/user/checkout/${checkoutId}/validate-coupon/${couponId}`,
        method: "POST",
      }),
    }),

    // Create Stripe payment intent
    createPaymentIntent: build.mutation<
      CreatePaymentIntentResponse,
      CreatePaymentIntentRequest
    >({
      query: (intentData) => ({
        url: "/api/v1/user/checkout/intent",
        method: "POST",
        body: intentData,
      }),
    }),

    // Apply coupon to checkout
    applyCoupon: build.mutation<
      ValidateCouponResponse,
      { checkoutId: number; couponCode: string }
    >({
      query: ({ checkoutId, couponCode }) => ({
        url: `/api/v1/user/checkout/${checkoutId}/apply-coupon`,
        method: "POST",
        body: { couponCode },
      }),
      invalidatesTags: (_, __, { checkoutId }) => [
        { type: "Checkout", id: checkoutId },
      ],
    }),

    // Remove coupon from checkout
    removeCoupon: build.mutation<{ message: string }, number>({
      query: (checkoutId) => ({
        url: `/api/v1/user/checkout/${checkoutId}/remove-coupon`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, checkoutId) => [
        { type: "Checkout", id: checkoutId },
      ],
    }),

    // Update checkout
    updateCheckout: build.mutation<
      CreateCheckoutResponse,
      { id: number; data: Partial<CreateCheckoutRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/user/checkout/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Checkout", id },
        { type: "Checkout", id: "LIST" },
      ],
    }),

    // Cancel checkout
    cancelCheckout: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/v1/user/checkout/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Checkout", id },
        { type: "Checkout", id: "LIST" },
      ],
    }),

    // Confirm checkout (place order)
    confirmCheckout: build.mutation<
      { order: any; message: string },
      { checkoutId: number; paymentDetails?: any }
    >({
      query: ({ checkoutId, paymentDetails }) => ({
        url: `/api/v1/user/checkout/${checkoutId}/confirm`,
        method: "POST",
        body: { paymentDetails },
      }),
      invalidatesTags: (_, __, { checkoutId }) => [
        { type: "Checkout", id: checkoutId },
        { type: "Checkout", id: "LIST" },
        "Order",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCheckoutMutation,
  useGetUserCheckoutsQuery,
  useCreateCheckoutFromCartMutation,
  useGetCheckoutByIdQuery,
  useValidateCouponMutation,
  useCreatePaymentIntentMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useUpdateCheckoutMutation,
  useCancelCheckoutMutation,
  useConfirmCheckoutMutation,
  useLazyGetUserCheckoutsQuery,
  useLazyGetCheckoutByIdQuery,
} = checkoutApi;

// Export types for use in components
export type {
  CheckoutItem,
  Product,
  Address,
  ShippingMethod,
  Coupon,
  CheckoutItemWithProduct,
  CreateCheckoutRequest,
  Checkout,
  CreateCheckoutResponse,
  GetCheckoutResponse,
  CreateCheckoutFromCartResponse,
  ValidateCouponResponse,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  CheckoutErrorResponse,
};
