import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserCheckoutsQuery } from "../appStore/checkout/api";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const getAuthUser = (): User | null => {
  try {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user;
    }
    return null;
  } catch {
    return null;
  }
};

export default function Orders() {
  const navigate = useNavigate();
  const user = getAuthUser();

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/orders",
          message: "Please log in to view your orders",
        },
      });
    }
  }, [user, navigate]);

  const { data, isLoading, error } = useGetUserCheckoutsQuery(
    { page: 1, limit: 20 },
    { skip: !user }
  );

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {isLoading && <div>Loading orders...</div>}
      {error && (
        <div className="text-red-600 mb-4">
          Failed to load orders. Please try again.
        </div>
      )}
      {!isLoading && data?.total === 0 && (
        <div className="text-gray-500">You have no orders yet.</div>
      )}
      <div className="space-y-6">
        {data?.data?.map((order: any) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold">
                  Order #{order.orderNumber}
                </span>
                <span className="ml-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  order.status?.name === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : order.status?.name === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status?.name === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : order.status?.name === "PROCESSING"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status?.name || "UNKNOWN"}
              </span>
            </div>
            {/* <div className="mb-2">
              <span className="text-gray-700 font-medium">Total: </span>
              <span>৳{order.total}</span>
            </div> */}
            <div>
              <span className="text-gray-700 font-medium">Items:</span>
              <ul className="list-disc ml-6">
                {order.items?.map((item: any) => (
                  <li key={item.id} className="text-sm">
                    {item.productSnapshot?.name || "Product"} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
            {order.coupon?.code && (
              <div className="mt-2 text-xs text-gray-500">
                Coupon:{" "}
                <span className="font-semibold">{order.coupon.code}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
