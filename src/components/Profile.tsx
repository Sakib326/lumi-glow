import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery, useUpdateProfileMutation } from "../appStore/auth/api";

export default function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetMeQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    oldPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        oldPassword: "",
      });
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (error && "status" in error && error.status === 401) {
      navigate("/login", {
        state: {
          from: "/profile",
          message: "Please log in to view your profile",
        },
      });
    }
  }, [error, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");
    try {
      const payload: any = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      };
      if (form.password) {
        payload.password = form.password;
        payload.oldPassword = form.oldPassword;
      }
      await updateProfile(payload).unwrap();
      setSuccess("Profile updated successfully.");
      setForm((prev) => ({ ...prev, password: "", oldPassword: "" }));
    } catch (err: any) {
      setFormError(
        err?.data?.message ||
          "Failed to update profile. Please check your input."
      );
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded p-2 text-sm">
            {formError}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded p-2 text-sm">
            {success}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            disabled
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            autoComplete="new-password"
            placeholder="Leave blank to keep current password"
          />
        </div>
        {form.password && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              autoComplete="current-password"
              required={!!form.password}
              placeholder="Enter your current password"
            />
          </div>
        )}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
