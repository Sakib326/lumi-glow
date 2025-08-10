import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCategoriesQuery } from "../../appStore/products/api";
import ProductList from "./components/productList";

const sortOptions = [
  { name: "Most Popular", value: "popular", current: false },
  { name: "Best Rating", value: "rating", current: false },
  { name: "Newest", value: "newest", current: false },
  { name: "Price: Low to High", value: "price_asc", current: false },
  { name: "Price: High to Low", value: "price_desc", current: false },
];

// Default filters based on your API structure
const defaultFilters = [
  {
    id: "discount",
    name: "Discount",
    options: [{ value: "on-sale", label: "On Sale", checked: false }],
  },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ListPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("categoryId")
  );
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || "popular"
  );

  // Fetch categories with large limit
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({ limit: 100, page: 1 });

  // Process categories for display
  const categories = categoriesResponse?.data || [];

  const getFilterParams = () => {
    const params: any = {
      limit: 12, // Products per page
      page: 1,
    };

    // Add category filter
    if (selectedCategory) {
      params.categoryId = parseInt(selectedCategory);
    }

    // Add keyword search if exists
    if (searchParams.get("keyword")) {
      params.keyword = searchParams.get("keyword");
    }

    // Add discount filter
    const discountFilter = filters.find((f) => f.id === "discount");
    const hasDiscountFilter = discountFilter?.options.some(
      (opt) => opt.checked && opt.value === "on-sale"
    );
    if (hasDiscountFilter) {
      params.isDiscounted = true;
    }

    // Add sort parameter
    if (selectedSort !== "popular") {
      params.sort = selectedSort;
    }

    return params;
  };

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    if (selectedCategory) {
      newParams.set("categoryId", selectedCategory);
    } else {
      newParams.delete("categoryId");
    }

    if (selectedSort !== "popular") {
      newParams.set("sort", selectedSort);
    } else {
      newParams.delete("sort");
    }

    // Add active filters to URL
    filters.forEach((filterSection) => {
      const activeOptions = filterSection.options
        .filter((option) => option.checked)
        .map((option) => option.value);

      if (activeOptions.length > 0) {
        newParams.set(filterSection.id, activeOptions.join(","));
      } else {
        newParams.delete(filterSection.id);
      }
    });

    setSearchParams(newParams);
  }, [selectedCategory, selectedSort, filters, searchParams, setSearchParams]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  // Handle sort selection
  const handleSortSelect = (sortValue: string) => {
    setSelectedSort(sortValue);
  };

  // Handle filter change
  const handleFilterChange = (
    sectionId: string,
    optionValue: string,
    checked: boolean
  ) => {
    setFilters((prevFilters) =>
      prevFilters.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              options: section.options.map((option) =>
                option.value === optionValue ? { ...option, checked } : option
              ),
            }
          : section
      )
    );
  };

  // Get page title based on selected category
  const getPageTitle = () => {
    if (selectedCategory) {
      const category = categories.find(
        (cat) => cat.id.toString() === selectedCategory
      );
      return category?.name || "Products";
    }
    if (searchParams.get("keyword")) {
      return `Search results for "${searchParams.get("keyword")}"`;
    }
    return "All Products";
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return filters.reduce((count, section) => {
      return count + section.options.filter((option) => option.checked).length;
    }, 0);
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                      {getActiveFilterCount() > 0 && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {getActiveFilterCount()}
                        </span>
                      )}
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Mobile Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    {/* Categories */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="px-4 py-3 text-sm font-medium text-gray-900">
                        Categories
                        {isCategoriesLoading && (
                          <span className="ml-2 text-xs text-gray-500">
                            Loading...
                          </span>
                        )}
                      </h3>
                      <ul role="list" className="px-2 space-y-1">
                        <li>
                          <button
                            type="button"
                            onClick={() => handleCategorySelect(null)}
                            className={classNames(
                              !selectedCategory
                                ? "bg-indigo-50 text-indigo-700 font-medium"
                                : "text-gray-700 hover:text-gray-900",
                              "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200"
                            )}
                          >
                            All Categories
                          </button>
                        </li>
                        {categories.map((category) => (
                          <li key={category.id}>
                            <button
                              type="button"
                              onClick={() =>
                                handleCategorySelect(category.id.toString())
                              }
                              className={classNames(
                                selectedCategory === category.id.toString()
                                  ? "bg-indigo-50 text-indigo-700 font-medium"
                                  : "text-gray-700 hover:text-gray-900",
                                "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200"
                              )}
                            >
                              {category.name}
                              {category.productsCount && (
                                <span className="ml-2 text-xs text-gray-500">
                                  ({category.productsCount})
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Filter Sections */}
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-b border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      value={option.value}
                                      type="checkbox"
                                      checked={option.checked}
                                      onChange={(e) =>
                                        handleFilterChange(
                                          section.id,
                                          option.value,
                                          e.target.checked
                                        )
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {getPageTitle()}
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => handleSortSelect(option.value)}
                              className={classNames(
                                selectedSort === option.value
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block w-full text-left px-4 py-2 text-sm"
                              )}
                            >
                              {option.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Desktop Filters */}
              <form className="hidden lg:block">
                {/* Categories */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Categories
                    {isCategoriesLoading && (
                      <span className="ml-2 text-xs text-gray-500">
                        Loading...
                      </span>
                    )}
                  </h3>
                  <ul
                    role="list"
                    className="space-y-2 text-sm font-medium text-gray-900"
                  >
                    <li>
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(null)}
                        className={classNames(
                          !selectedCategory
                            ? "text-indigo-600 font-semibold"
                            : "text-gray-700 hover:text-gray-900",
                          "block w-full text-left transition-colors duration-200"
                        )}
                      >
                        All Categories
                      </button>
                    </li>
                    {categories.map((category) => (
                      <li key={category.id}>
                        <button
                          type="button"
                          onClick={() =>
                            handleCategorySelect(category.id.toString())
                          }
                          className={classNames(
                            selectedCategory === category.id.toString()
                              ? "text-indigo-600 font-semibold"
                              : "text-gray-700 hover:text-gray-900",
                            "block w-full text-left transition-colors duration-200"
                          )}
                        >
                          {category.name}
                          {category.productsCount && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({category.productsCount})
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Filter Sections */}
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  value={option.value}
                                  type="checkbox"
                                  checked={option.checked}
                                  onChange={(e) =>
                                    handleFilterChange(
                                      section.id,
                                      option.value,
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}

                {/* Clear Filters */}
                {getActiveFilterCount() > 0 && (
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setFilters(defaultFilters);
                        setSelectedCategory(null);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Clear all filters ({getActiveFilterCount()})
                    </button>
                  </div>
                )}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <ProductList
                  filterParams={getFilterParams()}
                  selectedCategory={selectedCategory}
                  searchKeyword={searchParams.get("keyword") || ""}
                  activeFilters={filters}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
