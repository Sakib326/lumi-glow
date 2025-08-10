import { apiSlice } from "../api_slice";

// Types for the product API
interface MediaEntity {
  path: string;
  __entity: "MediaEntity";
}

interface Product {
  id: number;
  name: string;
  price: string;
  discountPrice: string | null;
  featureImage: MediaEntity;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

interface GetProductsParams {
  categoryId?: number;
  keyword?: string;
  isDiscounted?: boolean;
  excludeProductId?: number;
  tagSlug?: string;
  limit?: number;
  page?: number;
}

// Types for single product API
interface StatusEntity {
  id: number;
  name: string;
  __entity: "StatusEntity";
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: StatusEntity;
  __entity: "CategoryEntity";
  productsCount?: number;
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: StatusEntity;
  createdAt: string;
  updatedAt: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: StatusEntity;
  isCondition: boolean;
}

interface AttributeValue {
  value: string;
}

interface Attribute {
  id: number;
  internalName: string;
  externalName: string;
  type: string;
  values: AttributeValue[];
  description: string;
  status: StatusEntity;
  createdAt: string;
  updatedAt: string;
}

interface Highlight {
  title: string;
  description: string;
}

interface SingleProduct {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  category: Category;
  brand: Brand;
  price: number;
  discountPrice: number;
  totalStock: number;
  stockStatus: string;
  featureImage: MediaEntity;
  galleryImages: MediaEntity[];
  tags: Tag[];
  attributes: Attribute[];
  highlights: Highlight[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Types for the category API
interface CategoriesResponse {
  data: Category[];
}

interface GetCategoriesParams {
  page?: number;
  limit?: number;
  filters?: string;
  sort?: string;
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductsResponse, GetProductsParams>({
      query: (params = {}) => {
        const { limit = 10, page = 1, ...restParams } = params;

        // Build query string
        const queryParams = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString(),
        });

        // Add optional parameters if they exist
        Object.entries(restParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });

        return {
          url: `/api/v1/product/frontend?${queryParams.toString()}`,
        };
      },
      providesTags: ["Product"],
    }),
    getProduct: build.query<SingleProduct, string | number>({
      query: (id) => ({
        url: `/api/v1/product/${id}`,
      }),
      providesTags: (_, __, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    getCategories: build.query<CategoriesResponse, GetCategoriesParams>({
      query: (params = {}) => {
        const { page = 1, limit = 10, ...restParams } = params;

        // Build query string
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        // Add optional parameters if they exist
        Object.entries(restParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });

        return {
          url: `/api/v1/category?${queryParams.toString()}`,
        };
      },
      providesTags: ["Category"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
} = productsApi;
