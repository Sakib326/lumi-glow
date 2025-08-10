import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "../../appStore/products/api";

// Default categories for fallback
const defaultCategories = [
  {
    id: 1,
    name: "New Arrivals",
    description: "Latest makeup and beauty products",
    imageSrc: "https://m.media-amazon.com/images/I/41b-qJaxoSL.jpg",
  },
  {
    id: 2,
    name: "Accessories",
    description: "Beauty tools and accessories",
    imageSrc: "https://m.media-amazon.com/images/I/71mRPc2s5XL._AC_SL1500_.jpg",
  },
  {
    id: 3,
    name: "Skincare",
    description: "Premium skincare essentials",
    imageSrc:
      "https://www.objecttt.com/cdn/shop/products/STYLO-Desk-Organizer-Walnut-Objecttt_650x.jpg?v=1666559350",
  },
];

// Fallback products for Top Picks
const fallbackTopPicks = [
  {
    id: 1,
    name: "Premium Foundation",
    price: "45",
    discountPrice: "32",
    href: "/product/1",
    imageSrc:
      "https://cdn-img.prettylittlething.com/8/f/2/3/8f23ad3861b0f158f887a6b62064a9dc563eaceb_CMP1945_1_basic_black_cotton_blend_fitted_crew_neck_t_shirt.jpg?imwidth=600",
    imageAlt: "Premium foundation makeup product.",
  },
  {
    id: 2,
    name: "Luxury Lipstick Set",
    price: "28",
    discountPrice: "19",
    href: "/product/2",
    imageSrc:
      "https://yaya.eu/cdn/shop/files/oversized-fine-knitted-t-shirt-with-short-sleeves-1_c7cac59e-81a5-4440-a4d5-57c9e5115da3.jpg?v=1750858144&width=1400",
    imageAlt: "Luxury lipstick collection.",
  },
  {
    id: 3,
    name: "Eye Shadow Palette",
    price: "55",
    discountPrice: "39",
    href: "/product/3",
    imageSrc:
      "https://i.localised.com/img/ae/product/71a4a10d-772c-441f-b57d-4d48a536ec43_LARGE.jpg",
    imageAlt: "Professional eye shadow palette.",
  },
];

// Helper function to get image URL with null safety
const getImageUrl = (path: string | undefined | null) => {
  if (!path)
    return "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_URL}/uploads/${path}`;
};

export default function HomePage() {
  // Fetch categories from API
  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery({ limit: 3, page: 1 });

  // Fetch discounted products for Top Picks
  const {
    data: discountedProductsResponse,
    isLoading: isProductsLoading,
    error: productsError,
  } = useGetProductsQuery({
    isDiscounted: true,
    limit: 3,
    page: 1,
  });

  // Process categories with null safety
  const getDisplayCategories = () => {
    if (isCategoriesLoading || categoriesError || !categoriesResponse?.data) {
      return defaultCategories;
    }

    const apiCategories = categoriesResponse.data.slice(0, 3);

    return apiCategories.map((category, index) => ({
      id: category?.id || index + 1,
      name: category?.name || defaultCategories[index]?.name || "Category",
      description:
        category?.description ||
        defaultCategories[index]?.description ||
        "Explore our collection",
      slug: category?.slug || "",
      imageSrc:
        defaultCategories[index]?.imageSrc ||
        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    }));
  };

  // Process discounted products with null safety
  const getTopPicksProducts = () => {
    if (
      isProductsLoading ||
      productsError ||
      !discountedProductsResponse?.data
    ) {
      return fallbackTopPicks;
    }

    const discountedProducts = discountedProductsResponse.data.slice(0, 3);

    return discountedProducts.map((product, index) => {
      const originalPrice = parseFloat(product?.price || "0");
      const discountPrice = parseFloat(product?.discountPrice || "0");
      const discountPercentage =
        originalPrice > 0 && discountPrice > 0
          ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
          : 0;

      return {
        id: product?.id || index + 1,
        name: product?.name || fallbackTopPicks[index]?.name || "Product",
        price: product?.price || fallbackTopPicks[index]?.price || "0",
        discountPrice: product?.discountPrice || null,
        discountPercentage,
        href: `/products/${product?.id || index + 1}`,
        imageSrc: product?.featureImage?.path
          ? getImageUrl(product.featureImage.path)
          : fallbackTopPicks[index]?.imageSrc ||
            "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
        imageAlt: `${product?.name || "Product"} - ${
          discountPercentage > 0
            ? `${discountPercentage}% off`
            : "special offer"
        }`,
      };
    });
  };

  const displayCategories = getDisplayCategories();
  const topPicksProducts = getTopPicksProducts();

  return (
    <div className="bg-white">
      <header className="relative overflow-hidden">
        {/* Hero section */}
        <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <h1 className="font text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                #1 makeup brand
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                This year, our new summer collection will shelter you from the
                harsh elements of a world that doesn't care if you live or die.
              </p>
            </div>
            <div>
              <div className="mt-10">
                {/* Decorative image grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                >
                  <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT59MXojrpdEzsep9bNUqh6zY8P1mbEBPi6Zw&s"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://images.ctfassets.net/wlke2cbybljx/53NlK2ehZ0fzsJpqzvJhz8/fef26ff44238f6c9c77e89b01c4a1d88/ME_200_CT_PILLOWTALK_ECOM_KAYLEIGH_PEACHPOP_AFTER_2189_V2_RGB.jpg"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqNp3k3pmDvE7D9ruTB5vqVXZ5mJXQSYBJVw&s"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt-8-AjsdacihZZmt0AJQBR4GAibbypdYD-w&s"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGId33zYxlJs0lAU6V6qlHhOOlE2PALkmtI_iuBYOICE1NaspUh9KNExHfDO9B_3Ip-FQ&usqp=CAU"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQaiFd0JpxGTSmFeRkrihfDyJ56UpiZgSrvA&s"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIz8BXfS5rSkLEtf7grCOqtmb-Olfs5sxhXA&s"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="#"
                  className="inline-block rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-center font-medium text-white hover:bg-indigo-700"
                >
                  Shop Collection
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Category section */}
        <section aria-labelledby="category-heading" className="bg-gray-50">
          <div className="mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-baseline sm:justify-between">
              <h2
                id="category-heading"
                className="text-2xl font-bold tracking-tight text-gray-900"
              >
                {isCategoriesLoading
                  ? "Loading Categories..."
                  : "Grab the chance"}
              </h2>
              <a
                href="/products"
                className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
              >
                Browse all categories
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            {/* Show loading state */}
            {isCategoriesLoading && (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {/* Show error state with fallback */}
            {categoriesError && (
              <div className="mt-6 text-center text-gray-500">
                <p>Unable to load categories. Showing default categories.</p>
              </div>
            )}

            {/* Categories Grid */}
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
              {/* First category - takes 2 rows on larger screens */}
              {displayCategories[0] && (
                <div className="group aspect-w-2 aspect-h-1 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2">
                  <img
                    src={displayCategories[0].imageSrc}
                    alt={`${displayCategories[0].name} category`}
                    className="object-cover object-center group-hover:opacity-75"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="bg-gradient-to-b from-transparent to-black opacity-50"
                  />
                  <div className="flex items-end p-6">
                    <div>
                      <h3 className="font-semibold text-white">
                        <a href={`/category/${displayCategories[0].id}`}>
                          <span className="absolute inset-0" />
                          {displayCategories[0].name}
                        </a>
                      </h3>
                      <p aria-hidden="true" className="mt-1 text-sm text-white">
                        {displayCategories[0].description || "Shop now"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Second category */}
              {displayCategories[1] && (
                <div className="group aspect-w-2 aspect-h-1 overflow-hidden rounded-lg sm:aspect-none sm:relative sm:h-full">
                  <img
                    src={displayCategories[1].imageSrc}
                    alt={`${displayCategories[1].name} category`}
                    className="object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
                  />
                  <div className="flex items-end p-6 sm:absolute sm:inset-0">
                    <div>
                      <h3 className="font-semibold text-white">
                        <a href={`/category/${displayCategories[1].id}`}>
                          <span className="absolute inset-0" />
                          {displayCategories[1].name}
                        </a>
                      </h3>
                      <p aria-hidden="true" className="mt-1 text-sm text-white">
                        {displayCategories[1].description || "Shop now"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Third category */}
              {displayCategories[2] && (
                <div className="group aspect-w-2 aspect-h-1 overflow-hidden rounded-lg sm:aspect-none sm:relative sm:h-full">
                  <img
                    src={displayCategories[2].imageSrc}
                    alt={`${displayCategories[2].name} category`}
                    className="object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
                  />
                  <div className="flex items-end p-6 sm:absolute sm:inset-0">
                    <div>
                      <h3 className="font-semibold text-white">
                        <a href={`/category/${displayCategories[2].id}`}>
                          <span className="absolute inset-0" />
                          {displayCategories[2].name}
                        </a>
                      </h3>
                      <p aria-hidden="true" className="mt-1 text-sm text-white">
                        {displayCategories[2].description || "Shop now"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 sm:hidden">
              <a
                href="/products"
                className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Browse all categories
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* Rest of your existing sections remain the same... */}
        {/* Featured section */}
        <section aria-labelledby="cause-heading">
          <div className="relative bg-gray-800 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://tailwindui.com/img/ecommerce-images/home-page-03-feature-section-full-width.jpg"
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gray-900 bg-opacity-50"
            />
            <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
              <h2
                id="cause-heading"
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                "Future Focus"
              </h2>
              <p className="mt-3 text-xl text-white">
                We're committed to responsible, sustainable, and ethical
                manufacturing. Our small-scale approach allows us to focus on
                quality and reduce our impact. We're doing our best to delay the
                inevitable heat-death of the universe.
              </p>
              <a
                href="#"
                className="mt-8 block w-full rounded-md border border-transparent bg-white py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
              >
                Read our story
              </a>
            </div>
          </div>
        </section>

        {/* Top Picks - Discounted Products section */}
        <section aria-labelledby="favorites-heading">
          <div className="mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-baseline sm:justify-between">
              <h2
                id="favorites-heading"
                className="text-2xl font-bold tracking-tight text-gray-900"
              >
                {isProductsLoading
                  ? "Loading Top Picks..."
                  : "Top Picks - On Sale!"}
              </h2>
              <a
                href="/products?isDiscounted=true"
                className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
              >
                Browse all sale items
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            {/* Show loading state for products */}
            {isProductsLoading && (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {/* Show error state for products with fallback */}
            {productsError && (
              <div className="mt-6 text-center text-gray-500">
                <p>Unable to load sale products. Showing featured items.</p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-y-0 sm:gap-x-6 lg:gap-x-8">
              {topPicksProducts.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="h-96 w-full overflow-hidden rounded-lg group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-3 sm:h-auto">
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                      }}
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">
                    <a href={product.href}>
                      <span className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <div className="mt-1 flex items-center space-x-2">
                    {product.discountPrice ? (
                      <>
                        <p className="text-lg font-bold text-gray-900">
                          ৳{product.discountPrice}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          ৳{product.price}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-gray-900">
                        ৳{product.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:hidden">
              <a
                href="/products?isDiscounted=true"
                className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Browse all sale items
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section aria-labelledby="sale-heading">
          <div className="overflow-hidden pt-32 sm:pt-14">
            <div className="bg-gray-800">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative pt-48 pb-16 sm:pb-24">
                  <div>
                    <h2
                      id="sale-heading"
                      className="text-4xl font-bold tracking-tight text-white md:text-5xl"
                    >
                      "Going Fast – Final Stock!"
                      <br />
                      Up to 30% off.
                    </h2>
                    <div className="mt-6 text-base">
                      <a href="#" className="font-semibold text-white">
                        Shop the sale
                        <span aria-hidden="true"> &rarr;</span>
                      </a>
                    </div>
                  </div>

                  <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                    <div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                      <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                        <div className="flex-shrink-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://cdn2.mageplaza.com/media/general/OnWj0is.png"
                            alt="NEW IDEAL ITEM"
                          />
                        </div>

                        <div className="mt-6 flex-shrink-0 sm:mt-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://nonizbeauty.com/cdn/shop/files/beige_minimalist_makeup_promotion_Banner_1080_x_1080px_4.png?v=1691164089&width=1500"
                            alt="Sale products"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                        <div className="flex-shrink-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://essencemakeup.com/cdn/shop/files/20250410_Essence4286_wide_banner.jpg?v=1751487142"
                            alt="beauty products on sale"
                          />
                        </div>

                        <div className="mt-6 flex-shrink-0 sm:mt-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://img.freepik.com/premium-vector/sets-cosmetics-white-background_43605-1474.jpg"
                            alt="product sale"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                        <div className="flex-shrink-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg"
                            alt=""
                          />
                        </div>

                        <div className="mt-6 flex-shrink-0 sm:mt-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
