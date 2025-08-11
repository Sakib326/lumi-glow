import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCartFromStorage, getCartTotal, saveCartToStorage } from "./Cart";

// Import address API
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
  type Address,
  type CreateAddressRequest,
  type UpdateAddressRequest,
} from "../appStore/addresses/api";

// Import checkout API (no shipping methods endpoint)
import {
  useCreateCheckoutMutation,
  type CreateCheckoutRequest,
} from "../appStore/checkout/api";

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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface AddressFormData {
  type: "home" | "office" | "other";
  fullName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  region: string;
  landmark: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  notes: string;
}

// Helper function to get user from localStorage
const getAuthUser = (): User | null => {
  try {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user;
    }
    return null;
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return null;
  }
};

// Hardcoded shipping methods (since no API endpoint)
const SHIPPING_METHODS = [
  {
    id: 1,
    name: "Standard Delivery",
    description: "Delivered within 3-5 business days",
    price: 60,
    estimatedDays: 3,
    isActive: true,
  },
  {
    id: 2,
    name: "Express Delivery",
    description: "Delivered within 1-2 business days",
    price: 120,
    estimatedDays: 1,
    isActive: false,
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuthUser();

  // Cart and checkout states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Address management states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<
    number | null
  >(null);

  // Checkout form states
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<
    number | null
  >(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");
  const [notes, setNotes] = useState("");

  const [appliedCoupon, _] = useState<any>(null);

  // Address form state
  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    type: "home",
    fullName:
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : "",
    phoneNumber: user?.phone || "",
    email: user?.email || "",
    addressLine1: "",
    addressLine2: "",
    region: "",
    landmark: "",
    isDefaultShipping: false,
    isDefaultBilling: false,
    notes: "",
  });

  // API hooks for addresses - Using list API with pagination
  const { data: addressesResponse, isLoading: addressesLoading } =
    useGetAddressesQuery();
  const [createAddress, { isLoading: isCreatingAddress }] =
    useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] =
    useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeletingAddress }] =
    useDeleteAddressMutation();

  // API hooks for checkout
  const [createCheckout] = useCreateCheckoutMutation();
  // const [createPaymentIntent] = useCreatePaymentIntentMutation();

  const addresses: any = addressesResponse || [];
  const shippingMethods = SHIPPING_METHODS;

  // Check authentication and cart on component mount
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/checkout",
          message: "Please log in to continue with your purchase",
        },
      });
      return;
    }

    const cartData = location.state?.cart || getCartFromStorage();

    if (!cartData || cartData.length === 0) {
      navigate("/cart");
      return;
    }

    setCart(cartData);
  }, [user, navigate, location]);

  // Set default shipping address
  useEffect(() => {
    if (addresses.length > 0 && !selectedShippingAddressId) {
      const defaultAddress =
        addresses.find((addr: any) => addr.isDefaultShipping) || addresses[0];
      setSelectedShippingAddressId(defaultAddress.id);
    }
  }, [addresses, selectedShippingAddressId]);

  // Set default shipping method
  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethodId) {
      const defaultMethod =
        shippingMethods.find((m) => m.isActive) || shippingMethods[0];
      setSelectedShippingMethodId(defaultMethod.id);
    }
  }, [shippingMethods, selectedShippingMethodId]);

  // Calculate totals
  const subtotal = getCartTotal(cart);
  const selectedShippingMethod = shippingMethods.find(
    (m) => m.id === selectedShippingMethodId
  );
  const shippingCost = selectedShippingMethod?.price || 0;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const tax = 0; // No tax for now
  const total = subtotal + shippingCost + tax - discountAmount;

  // Address form functions
  const resetAddressForm = () => {
    setAddressFormData({
      type: "home",
      fullName:
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : "",
      phoneNumber: user?.phone || "",
      email: user?.email || "",
      addressLine1: "",
      addressLine2: "",
      region: "",
      landmark: "",
      isDefaultShipping: false,
      isDefaultBilling: false,
      notes: "",
    });
    setEditingAddress(null);
    setErrors({});
  };

  const handleAddNewAddress = () => {
    resetAddressForm();
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setAddressFormData({
      type: address.type,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      email: address.email,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      region: address.region,
      landmark: address.landmark || "",
      isDefaultShipping: address.isDefaultShipping,
      isDefaultBilling: address.isDefaultBilling,
      notes: address.notes || "",
    });
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleAddressInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setAddressFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setAddressFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateAddressForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!addressFormData.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!addressFormData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!addressFormData.email.trim()) newErrors.email = "Email is required";
    if (!addressFormData.addressLine1.trim())
      newErrors.addressLine1 = "Address line 1 is required";
    if (!addressFormData.region.trim()) newErrors.region = "Region is required";

    if (addressFormData.email && !/\S+@\S+\.\S+/.test(addressFormData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAddressForm()) return;

    try {
      const addressData = {
        type: addressFormData.type,
        fullName: addressFormData.fullName,
        phoneNumber: addressFormData.phoneNumber,
        email: addressFormData.email,
        addressLine1: addressFormData.addressLine1,
        addressLine2: addressFormData.addressLine2 || undefined,
        region: addressFormData.region,
        landmark: addressFormData.landmark || undefined,
        isDefaultShipping: addressFormData.isDefaultShipping,
        isDefaultBilling: addressFormData.isDefaultBilling,
        notes: addressFormData.notes || undefined,
      };

      if (editingAddress) {
        await updateAddress({
          id: editingAddress.id,
          data: addressData as UpdateAddressRequest,
        }).unwrap();
      } else {
        const result = await createAddress(
          addressData as CreateAddressRequest
        ).unwrap();
        if (addresses.length === 0) {
          setSelectedShippingAddressId(result.address.id);
        }
      }

      setIsAddressModalOpen(false);
      resetAddressForm();
    } catch (error) {
      console.error("Error saving address:", error);
      setErrors({ general: "Failed to save address. Please try again." });
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id).unwrap();
        if (selectedShippingAddressId === id) {
          setSelectedShippingAddressId(null);
        }
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
  };

  // Validate checkout form
  const validateCheckoutForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedShippingAddressId) {
      newErrors.shippingAddress = "Please select a shipping address";
    }

    if (!selectedShippingMethodId) {
      newErrors.shippingMethod = "Please select a shipping method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validateCheckoutForm()) return;

    setIsLoading(true);

    try {
      // Prepare items for checkout
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const checkoutData: CreateCheckoutRequest = {
        items,
        billingAddressId: selectedShippingAddressId!,
        shippingAddressId: selectedShippingAddressId!,
        shippingMethodId: selectedShippingMethodId!,
        paymentMethod,
        couponCode: appliedCoupon?.coupon?.code,
        notes: notes || undefined,
      };

      const checkoutResult = await createCheckout(checkoutData).unwrap();
      console.log("Checkout created:", checkoutResult);

      if (paymentMethod === "stripe") {
        // const paymentIntent = await createPaymentIntent({
        //   amount: Math.round(total * 100),
        //   checkoutId: checkoutResult.checkout.id,
        // }).unwrap();
        // paymentDetails = {
        //   paymentIntentId: paymentIntent.paymentIntentId,
        //   clientSecret: paymentIntent.clientSecret,
        // };
      }

      saveCartToStorage([]);

      // Show success message and navigate to products
      alert("Order placed successfully! Thank you for your purchase.");
      navigate("/products");
    } catch (error: any) {
      console.error("Error placing order:", error);
      setErrors({
        general:
          error.data?.message || "Failed to place order. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if not authenticated or no cart
  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete your order below
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {/* User Info */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Logged in as: {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Management */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Delivery Address
                  </h2>
                  <button
                    onClick={handleAddNewAddress}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add New
                  </button>
                </div>

                {addressesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No addresses found</p>
                    <button
                      onClick={handleAddNewAddress}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address: any) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedShippingAddressId === address.id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedShippingAddressId(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center flex-1">
                            <input
                              type="radio"
                              checked={selectedShippingAddressId === address.id}
                              onChange={() =>
                                setSelectedShippingAddressId(address.id)
                              }
                              className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <div className="text-sm flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium">
                                  {address.fullName}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                                  {address.type}
                                </span>
                                {address.isDefaultShipping && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600">
                                {address.addressLine1}
                              </p>
                              {address.addressLine2 && (
                                <p className="text-gray-600">
                                  {address.addressLine2}
                                </p>
                              )}
                              <p className="text-gray-600">{address.region}</p>
                              <p className="text-gray-600">
                                {address.phoneNumber}
                              </p>
                              {address.landmark && (
                                <p className="text-gray-500 text-sm">
                                  Landmark: {address.landmark}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAddress(address);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit address"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                              disabled={isDeletingAddress}
                              title="Delete address"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errors.shippingAddress && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.shippingAddress}
                  </p>
                )}

                {/* Note about billing address */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                    <div className="ml-2">
                      <p className="text-sm text-blue-800">
                        Your billing address will be set the same as your
                        delivery address.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method Selection */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Shipping Method
                </h2>

                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedShippingMethodId === method.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedShippingMethodId(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={selectedShippingMethodId === method.id}
                            onChange={() =>
                              setSelectedShippingMethodId(method.id)
                            }
                            className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {method.name}
                            </p>
                            {method.description && (
                              <p className="text-sm text-gray-600">
                                {method.description}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Estimated delivery: {method.estimatedDays} days
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {method.price === 0 ? "Free" : `৳${method.price}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.shippingMethod && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.shippingMethod}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      value: "cash",
                      label: "Cash on Delivery (COD)",
                      description: "Pay when your order arrives",
                    },
                    {
                      value: "stripe",
                      label: "Stripe",
                      description: "Pay securely with stripe",
                    },
                  ].map((method) => (
                    <div key={method.value} className="flex items-center">
                      <input
                        id={method.value}
                        name="payment"
                        type="radio"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as any)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor={method.value} className="ml-3 block">
                        <span className="text-sm font-medium text-gray-700">
                          {method.label}
                        </span>
                        <p className="text-xs text-gray-500">
                          {method.description}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Notes (Optional)
                </h2>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Any special instructions for your order..."
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white shadow rounded-lg sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="px-6 py-4">
                {/* Cart Items */}
                <div className="flow-root mb-6">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {cart.map((item) => (
                      <li key={item.id} className="py-6 flex">
                        <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                          <img
                            src={item.imageSrc}
                            alt={item.name}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3 className="text-sm line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="ml-4">
                                ৳
                                {(
                                  parseFloat(item.discountPrice || item.price) *
                                  item.quantity
                                ).toFixed(2)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              ৳{item.discountPrice || item.price} ×{" "}
                              {item.quantity}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `৳${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -৳{discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">৳{tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    isLoading ||
                    !selectedShippingAddressId ||
                    !selectedShippingMethodId
                  }
                  className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order - ৳${total.toFixed(2)}`
                  )}
                </button>

                <div className="text-center mt-4">
                  <button
                    onClick={() => navigate("/cart")}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    ← Back to Cart
                  </button>
                </div>

                {/* Security Note */}
                <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                  <InformationCircleIcon className="h-4 w-4 mr-1" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      <Transition appear show={isAddressModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsAddressModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </Dialog.Title>

                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    {/* Address Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address Type
                      </label>
                      <select
                        name="type"
                        value={addressFormData.type}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={addressFormData.fullName}
                        onChange={handleAddressInputChange}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                          errors.fullName ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Phone and Email */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={addressFormData.phoneNumber}
                          onChange={handleAddressInputChange}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.phoneNumber
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={addressFormData.email}
                          onChange={handleAddressInputChange}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.email ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address Lines */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={addressFormData.addressLine1}
                        onChange={handleAddressInputChange}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                          errors.addressLine1
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.addressLine1 && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.addressLine1}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={addressFormData.addressLine2}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* Region and Landmark */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Region *
                        </label>
                        <input
                          type="text"
                          name="region"
                          value={addressFormData.region}
                          onChange={handleAddressInputChange}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.region ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                        {errors.region && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.region}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Landmark
                        </label>
                        <input
                          type="text"
                          name="landmark"
                          value={addressFormData.landmark}
                          onChange={handleAddressInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Delivery Notes
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        value={addressFormData.notes}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., Leave at the reception"
                      />
                    </div>

                    {/* Default Options */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="isDefaultShipping"
                          name="isDefaultShipping"
                          type="checkbox"
                          checked={addressFormData.isDefaultShipping}
                          onChange={handleAddressInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="isDefaultShipping"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Set as default address
                        </label>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCreatingAddress || isUpdatingAddress}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isCreatingAddress || isUpdatingAddress ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </div>
                        ) : editingAddress ? (
                          "Update Address"
                        ) : (
                          "Add Address"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
