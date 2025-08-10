import { apiSlice } from "../api_slice";

// Address types
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
  userId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Create address request
interface CreateAddressRequest {
  type: "home" | "office" | "other";
  fullName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  region: string;
  landmark?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  notes?: string;
}

// Update address request
interface UpdateAddressRequest {
  type?: "home" | "office" | "other";
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  region?: string;
  landmark?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  notes?: string;
}

// API response types
interface CreateAddressResponse {
  address: Address;
  message: string;
}

interface GetAddressesResponse {
  addresses: Address[];
  total: number;
}

interface GetAddressResponse {
  address: Address;
}

interface UpdateAddressResponse {
  address: Address;
  message: string;
}

interface SetDefaultAddressResponse {
  message: string;
  address: Address;
}

// Default address types
type DefaultAddressType = "shipping" | "billing";

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create a new address
    createAddress: build.mutation<CreateAddressResponse, CreateAddressRequest>({
      query: (addressData) => ({
        url: "/api/v1/address",
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: ["Address"],
    }),

    // Get all addresses for the authenticated user
    getAddresses: build.query<GetAddressesResponse, void>({
      query: () => ({
        url: "/api/v1/address",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.addresses
          ? [
              ...result.addresses.map(({ id }) => ({
                type: "Address" as const,
                id,
              })),
              { type: "Address", id: "LIST" },
            ]
          : [{ type: "Address", id: "LIST" }],
    }),

    // Get address by ID
    getAddressById: build.query<GetAddressResponse, number>({
      query: (id) => ({
        url: `/api/v1/address/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Address", id }],
    }),

    // Update address by ID
    updateAddress: build.mutation<
      UpdateAddressResponse,
      { id: number; data: UpdateAddressRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/address/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
      ],
    }),

    // Delete address by ID
    deleteAddress: build.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
      ],
    }),

    // Set address as default shipping or billing
    setDefaultAddress: build.mutation<
      SetDefaultAddressResponse,
      { id: number; type: DefaultAddressType }
    >({
      query: ({ id, type }) => ({
        url: `/api/v1/address/${id}/${type}/default`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
      ],
    }),

    // Get default shipping address
    getDefaultShippingAddress: build.query<Address | null, void>({
      query: () => ({
        url: "/api/v1/address",
        method: "GET",
      }),
      transformResponse: (response: GetAddressesResponse) => {
        return (
          response.addresses.find((addr) => addr.isDefaultShipping) || null
        );
      },
      providesTags: [{ type: "Address", id: "DEFAULT_SHIPPING" }],
    }),

    // Get default billing address
    getDefaultBillingAddress: build.query<Address | null, void>({
      query: () => ({
        url: "/api/v1/address",
        method: "GET",
      }),
      transformResponse: (response: GetAddressesResponse) => {
        return response.addresses.find((addr) => addr.isDefaultBilling) || null;
      },
      providesTags: [{ type: "Address", id: "DEFAULT_BILLING" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateAddressMutation,
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  useGetDefaultShippingAddressQuery,
  useGetDefaultBillingAddressQuery,
  useLazyGetAddressesQuery,
  useLazyGetAddressByIdQuery,
  useLazyGetDefaultShippingAddressQuery,
  useLazyGetDefaultBillingAddressQuery,
} = addressApi;

// Export types for use in components
export type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  CreateAddressResponse,
  GetAddressesResponse,
  GetAddressResponse,
  UpdateAddressResponse,
  SetDefaultAddressResponse,
  DefaultAddressType,
};
