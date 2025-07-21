import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Define TypeScript interfaces for the product and order data
interface Product {
  name: string;
  price: number;
  imageSrc: string;
}

interface Order {
  items: Product[];
  total: number;
  subtotal: number;
  tax: number;
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize with empty cart if no state is passed
  const cart: Product[] = location.state?.cart || [];
  
  // Calculate order totals
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/", { replace: true });
    }
  }, [cart, navigate]);

  const handleConfirmPayment = () => {
    // In a real app, you would integrate with a payment gateway here
    // For now, navigate to thank you page with order details
    const order: Order = {
      items: cart,
      subtotal,
      tax,
      total,
    };

    navigate("/thank-you", { state: { order } });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">
            Review your order before payment
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
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

            <div className="mt-8">
              <button
                onClick={handleConfirmPayment}
                className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}