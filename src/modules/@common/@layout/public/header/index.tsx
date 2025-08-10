import { Menu, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

// Helper function to get user from localStorage
const getAuthUser = () => {
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

// Helper function to get profile image URL
const getProfileImageUrl = (imagePath: string | undefined | null) => {
  if (!imagePath) return null;
  return imagePath.startsWith("http")
    ? imagePath
    : `${import.meta.env.VITE_API_URL}/uploads/${imagePath}`;
};

// Helper function to get user initials
const getUserInitials = (firstName: string = "", lastName: string = "") => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const user = getAuthUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
    window.location.reload(); // Force refresh to update auth state
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const userProfileImage = getProfileImageUrl(user?.profileImage);
  const userInitials = getUserInitials(user?.firstName, user?.lastName);

  return (
    <Popover className="relative bg-white shadow-sm">
      <div className="relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-4 px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="sr-only">Lumi Glow</span>
              <div className="text-2xl font-bold text-indigo-600 sm:text-3xl">
                Lumi Glow
              </div>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:ml-10">
            {/* Navigation Links */}
            <nav className="flex space-x-8">
              <a
                href="/"
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Home
              </a>
              <a
                href="/products"
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Products
              </a>

              <a
                href="/about"
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                <span className="sr-only">View cart</span>
                <ShoppingCartIcon className="h-6 w-6" />
                {/* Cart badge - you can add cart count here */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* User Authentication */}
              {user ? (
                /* Logged in user dropdown */
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    {userProfileImage ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={userProfileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium ${
                        userProfileImage ? "hidden" : ""
                      }`}
                    >
                      {userInitials || "U"}
                    </div>
                    <span className="hidden lg:block text-gray-700 font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/orders"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Orders
                          </a>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/settings"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-100" />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                /* Not logged in */
                <div className="flex items-center space-x-4">
                  <a
                    href="/login"
                    className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Sign in
                  </a>
                  <a
                    href="/register"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    Sign up
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 z-30 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-indigo-600">
                  Lumi Glow
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              {/* Mobile Search */}
              <div className="mt-6">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </form>
              </div>

              {/* Mobile Navigation */}
              <div className="mt-6">
                <nav className="grid gap-y-4">
                  <a
                    href="/"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    Home
                  </a>
                  <a
                    href="/products"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    Products
                  </a>
                  <a
                    href="/categories"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    Categories
                  </a>
                  <a
                    href="/about"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    About
                  </a>
                  <a
                    href="/contact"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    Contact
                  </a>
                  <button
                    onClick={handleCartClick}
                    className="flex items-center text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Cart (0)
                  </button>
                </nav>
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="py-6 px-5">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {userProfileImage ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={userProfileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                        {userInitials || "U"}
                      </div>
                    )}
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <a
                      href="/profile"
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                    >
                      Profile
                    </a>
                    <a
                      href="/orders"
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                    >
                      Orders
                    </a>

                    <button
                      onClick={handleLogout}
                      className="text-left text-base font-medium text-red-600 hover:text-red-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <a
                    href="/register"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Sign up
                  </a>
                  <p className="text-center text-base font-medium text-gray-500">
                    Existing customer?{" "}
                    <a
                      href="/login"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
