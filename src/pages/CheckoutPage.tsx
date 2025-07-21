import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import { stripePromise } from "../config/stripe-config";

interface Product {
  name: string;
  price: number;
  imageSrc: string;
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const cart: Product[] = location.state?.cart || [];
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/", { replace: true });
      return;
    }

    createPaymentIntent();
  }, [cart, navigate]);

  const createPaymentIntent = async () => {
    try {
      // Make the actual API request (will fail in demo)
      let response;
      let data;

      try {
        response = await fetch(
          "http://[::1]:5080/api/v1/user/checkout/intent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: Math.round(total * 100), // Convert to cents
            }),
          }
        );

        data = await response.json();
      } catch (apiError) {
        console.warn("API request failed, using mock response:", apiError);
      }

      // Use mock response if API fails or doesn't return clientSecret
      if (!data?.clientSecret) {
        console.log("Using mock payment intent response");

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock successful Stripe PaymentIntent response
        data = {
          clientSecret:
            "pi_3QJmockPaymentIntent_secret_mockClientSecret123456789",
          paymentIntent: {
            id: `pi_mock_${Date.now()}`,
            amount: Math.round(total * 100),
            currency: "usd",
            status: "requires_payment_method",
          },
        };
      }

      setClientSecret(data.clientSecret);
      console.log("Payment intent created:", data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize payment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    const order = {
      items: cart,
      subtotal,
      tax,
      total,
      orderNumber: `ORDER-${Date.now()}`,
      paymentMethod: "card",
      status: "confirmed",
    };

    navigate("/thank-you", { state: { order } });
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#4f46e5",
    },
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading payment...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete your order securely with Stripe
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Order Summary */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="border-t border-gray-200 pt-6">
                <ul className="divide-y divide-gray-200">
                  {cart.map((product, index) => (
                    <li key={index} className="py-4 flex">
                      <div className="flex-shrink-0">
                        <img
                          src={product.imageSrc}
                          alt={product.name}
                          className="h-20 w-20 rounded-md object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/80x80?text=Product";
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-sm text-gray-500">Qty: 1</p>
                          <p className="text-sm font-medium text-gray-900">
                            ৳{product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>৳{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <p>Tax (10%)</p>
                  <p>৳{tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
                  <p>Total</p>
                  <p>৳{total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Payment Information
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance,
                  }}
                >
                  <PaymentForm
                    total={total}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
