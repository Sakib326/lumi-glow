import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface Product {
  name: string;
  price: number;
  imageSrc: string;
}

interface Order {
  items: Product[];
  subtotal: number;
  tax: number;
  total: number;
}

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order: Order | undefined = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/", { replace: true });
    }
  }, [order, navigate]);

  if (!order) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-white shadow rounded-lg overflow-hidden p-8">
          <div className="mb-6">
            <svg
              className="h-16 w-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank you for your order!
          </h1>
          <p className="text-gray-600 mb-8">
            Your order has been placed successfully.
          </p>

          <div className="border-t border-gray-200 pt-6 text-left">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h2>
            <ul className="divide-y divide-gray-200 mb-6">
              {order.items.map((item, index) => (
                <li key={index} className="py-4 flex">
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ৳{item.price.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Tax</span>
                <span>৳{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 mt-3">
                <span>Total</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="w-full md:w-auto bg-indigo-600 border border-transparent rounded-md py-2 px-6 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}