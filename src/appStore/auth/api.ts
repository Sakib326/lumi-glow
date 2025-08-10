import { apiSlice } from "../api_slice";

// Common types
interface RoleEntity {
  id: number;
  name: string;
}

interface StatusEntity {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  photo: string;
  role: RoleEntity;
  status: StatusEntity;
  addresses: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  confirmationCode: string;
  confirmationCodeExpires: string;
  resetPasswordCode: string;
  resetPasswordCodeExpires: string;
}

// Login types
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
}

// Register types
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Email confirmation types
interface ConfirmEmailRequest {
  email: string;
  hash: string;
}

// Forgot password types
interface ForgotPasswordRequest {
  email: string;
}

// Reset password types
interface ResetPasswordRequest {
  password: string;
  hash: string;
}

// Update profile types
interface UpdateProfileRequest {
  photo?: File;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/v1/auth/email/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: build.mutation<void, RegisterRequest>({
      query: (userData) => ({
        url: "/api/v1/auth/email/register",
        method: "POST",
        body: userData,
      }),
    }),
    confirmEmail: build.mutation<void, ConfirmEmailRequest>({
      query: (data) => ({
        url: "/api/v1/auth/email/confirm",
        method: "POST",
        body: data,
      }),
    }),
    resendConfirmation: build.mutation<void, ConfirmEmailRequest>({
      query: (data) => ({
        url: "/api/v1/auth/email/confirm/new",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: build.mutation<void, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/api/v1/auth/forgot/password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: build.mutation<void, ResetPasswordRequest>({
      query: (data) => ({
        url: "/api/v1/auth/reset/password",
        method: "POST",
        body: data,
      }),
    }),
    getMe: build.query<User, void>({
      query: () => ({
        url: "/api/v1/auth/me",
        method: "GET",
      }),
    }),
    updateProfile: build.mutation<User, UpdateProfileRequest>({
      query: (data) => {
        const formData = new FormData();

        // Append all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === "photo" && value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, value as string);
            }
          }
        });

        return {
          url: "/api/v1/auth/me",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result) =>
        result ? [{ type: "User", id: result.id }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useConfirmEmailMutation,
  useResendConfirmationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useLazyGetMeQuery,
} = authApi;
