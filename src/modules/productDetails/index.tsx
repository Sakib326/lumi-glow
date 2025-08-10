import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { Tab } from "@headlessui/react";
import { useGetProductQuery } from "../../appStore/products/api";

const reviews = {
  average: 4,
  featured: [
    {
      id: 1,
      rating: 5,
      content: `
        <p>This product is exactly what I needed for my skincare routine. It works perfectly for my skin type!</p>
      `,
      date: "July 16, 2021",
      datetime: "2021-07-16",
      author: "Emily Selman",
      avatarSrc:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    },
    {
      id: 2,
      rating: 5,
      content: `
        <p>I'm amazed by how effective this product is. It has transformed my skin in just two weeks of regular use.</p>
      `,
      date: "July 12, 2021",
      datetime: "2021-07-12",
      author: "Hector Gibbons",
      avatarSrc:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    },
  ],
};

const faqs = [
  {
    question: "How should I use this product?",
    answer:
      "Apply a small amount to clean skin twice daily, morning and night.",
  },
  {
    question: "Is this product suitable for sensitive skin?",
    answer:
      "Yes, this product is dermatologically tested and suitable for all skin types.",
  },
  {
    question: "What are the main ingredients?",
    answer:
      "This product contains natural ingredients specifically formulated for effective skincare.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Most customers notice improvements within 2-4 weeks of consistent use.",
  },
];

const license = {
  href: "#",
  summary: "For personal use only. Not for resale.",
  content: `
    <h4>Usage Guidelines</h4>
    <p>This product is intended for personal use only.</p>
    <p>Please read all instructions and ingredients before use.</p>
  `,
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// Helper function to get image URL with null safety
const getImageUrl = (path: string | undefined | null) => {
  if (!path) return "/placeholder-product.jpg";
  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_URL}/uploads/${path}`;
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const parseAndTruncateHTML = (
    htmlString: string,
    maxLength: number = 200
  ) => {
    if (!htmlString) return { truncated: "", full: "", shouldTruncate: false };

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // Get text content without HTML tags
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    const shouldTruncate = textContent.length > maxLength;
    const truncated = shouldTruncate
      ? textContent.substring(0, maxLength) + "..."
      : textContent;

    return {
      truncated,
      full: textContent,
      shouldTruncate,
      hasHTML: htmlString !== textContent, // Check if original content had HTML
    };
  };

  const EnhancedDescription = ({ description }: { description: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const descriptionRef = useRef<HTMLDivElement>(null);

    const { truncated, full, shouldTruncate, hasHTML } = parseAndTruncateHTML(
      description,
      150
    );

    const toggleExpanded = () => {
      setIsExpanded(!isExpanded);

      // Smooth scroll to description when expanding
      if (!isExpanded && descriptionRef.current) {
        setTimeout(() => {
          descriptionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
          });
        }, 100);
      }
    };

    if (!shouldTruncate) {
      return (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Description
          </h3>
          <div className="text-gray-700 leading-relaxed">
            {hasHTML ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p>{full}</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div ref={descriptionRef} className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
        <div className="relative">
          <div
            className={`text-gray-700 leading-relaxed transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-none" : "max-h-20 overflow-hidden"
            }`}
          >
            {hasHTML ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: isExpanded ? description : truncated,
                }}
              />
            ) : (
              <p className="whitespace-pre-wrap">
                {isExpanded ? full : truncated}
              </p>
            )}
          </div>

          {/* Gradient overlay when collapsed */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}

          {/* Read More/Less Button */}
          <button
            onClick={toggleExpanded}
            className="mt-3 flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200 group"
          >
            <span>{isExpanded ? "Show Less" : "Read More"}</span>
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform duration-200" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>
    );
  };

  const { data: product, isLoading, error } = useGetProductQuery(id || "");

  const handleAddToCart = () => {
    if (!product) return;

    const imageUrl = product.featureImage?.path
      ? getImageUrl(product.featureImage.path)
      : "/placeholder-product.jpg";

    navigate("/checkout", {
      state: {
        cart: [
          {
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            imageSrc: imageUrl,
            quantity: 1,
          },
        ],
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  // Safe feature image URL
  const featureImageUrl = product.featureImage?.path
    ? getImageUrl(product.featureImage.path)
    : "/placeholder-product.jpg";

  return (
    <div className="bg-white">
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={featureImageUrl}
                alt={product.name || "Product image"}
                className="object-cover object-center w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-product.jpg";
                }}
              />
            </div>

            {/* Gallery Images */}
            {product.galleryImages && product.galleryImages.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {product.galleryImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100"
                  >
                    <img
                      src={getImageUrl(image?.path)}
                      alt={`${product.name} ${index + 1}`}
                      className="object-cover object-center w-full h-full cursor-pointer hover:opacity-75"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {product.name || "Unnamed Product"}
                </h1>
                <h2 id="information-heading" className="sr-only">
                  Product information
                </h2>

                {/* Brand and Category */}
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                  {product.brand?.name && (
                    <>
                      <span>
                        Brand:{" "}
                        <span className="font-medium text-gray-700">
                          {product.brand.name}
                        </span>
                      </span>
                      <span>•</span>
                    </>
                  )}
                  {product.category?.name && (
                    <span>
                      Category:{" "}
                      <span className="font-medium text-gray-700">
                        {product.category.name}
                      </span>
                    </span>
                  )}
                </div>

                {/* SKU */}
                {product.sku && (
                  <p className="mt-1 text-sm text-gray-500">
                    SKU: {product.sku}
                  </p>
                )}
              </div>

              <div>
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating
                          ? "text-yellow-400"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
              </div>
            </div>

            {/* Price */}
            <div className="mt-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ৳{product.discountPrice || product.price || 0}
                </span>
                {product.discountPrice && product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ৳{product.price}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stockStatus === "in_stock"
                      ? "bg-green-500"
                      : product.stockStatus === "low_stock"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    product.stockStatus === "in_stock"
                      ? "text-green-700"
                      : product.stockStatus === "low_stock"
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {product.stockStatus === "in_stock"
                    ? "In Stock"
                    : product.stockStatus === "low_stock"
                    ? "Low Stock"
                    : "Out of Stock"}
                </span>
                <span className="text-sm text-gray-500">
                  ({product.totalStock || 0} available)
                </span>
              </div>
            </div>

            {product.description && (
              <EnhancedDescription description={product.description} />
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">
                  Specifications
                </h3>
                <div className="mt-2 space-y-2">
                  {product.attributes.map((attr) => (
                    <div key={attr.id} className="flex">
                      <span className="text-sm font-medium text-gray-700 w-1/3">
                        {attr.externalName}:
                      </span>
                      <span className="text-sm text-gray-500 w-2/3">
                        {attr.values?.map((v) => v.value).join(", ") || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stockStatus === "out_of_stock"}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {product.stockStatus === "out_of_stock"
                  ? "Out of Stock"
                  : `Add to Cart - ৳${
                      product.discountPrice || product.price || 0
                    }`}
              </button>

             
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Highlights
                </h3>
                <div className="prose prose-sm mt-4 text-gray-500">
                  <ul role="list">
                    {product.highlights.map((highlight, index) => (
                      <li key={index}>
                        <strong>{highlight.title}:</strong>{" "}
                        {highlight.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">License</h3>
              <p className="mt-4 text-sm text-gray-500">
                {license.summary}{" "}
                <a
                  href={license.href}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Read full license
                </a>
              </p>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">Share</h3>
              <ul role="list" className="mt-4 flex items-center space-x-6">
                <li>
                  <a
                    href="#"
                    className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Share on Facebook</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Share on Instagram</span>
                    <svg
                      className="h-6 w-6"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
            <Tab.Group as="div">
              <div className="border-b border-gray-200">
                <Tab.List className="-mb-px flex space-x-8">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                        "whitespace-nowrap border-b-2 py-6 text-sm font-medium"
                      )
                    }
                  >
                    Customer Reviews
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                        "whitespace-nowrap border-b-2 py-6 text-sm font-medium"
                      )
                    }
                  >
                    FAQ
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                        "whitespace-nowrap border-b-2 py-6 text-sm font-medium"
                      )
                    }
                  >
                    License
                  </Tab>
                </Tab.List>
              </div>
              <Tab.Panels as={Fragment}>
                <Tab.Panel className="-mb-10">
                  <h3 className="sr-only">Customer Reviews</h3>
                  {reviews.featured.map((review, reviewIdx) => (
                    <div
                      key={review.id}
                      className="flex space-x-4 text-sm text-gray-500"
                    >
                      <div className="flex-none py-10">
                        <img
                          src={review.avatarSrc}
                          alt=""
                          className="h-10 w-10 rounded-full bg-gray-100"
                        />
                      </div>
                      <div
                        className={classNames(
                          reviewIdx === 0 ? "" : "border-t border-gray-200",
                          "py-10"
                        )}
                      >
                        <h3 className="font-medium text-gray-900">
                          {review.author}
                        </h3>
                        <p>
                          <time dateTime={review.datetime}>{review.date}</time>
                        </p>
                        <div className="mt-4 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                review.rating > rating
                                  ? "text-yellow-400"
                                  : "text-gray-300",
                                "h-5 w-5 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <div
                          className="prose prose-sm mt-4 max-w-none text-gray-500"
                          dangerouslySetInnerHTML={{ __html: review.content }}
                        />
                      </div>
                    </div>
                  ))}
                </Tab.Panel>

                <Tab.Panel className="text-sm text-gray-500">
                  <h3 className="sr-only">Frequently Asked Questions</h3>
                  <dl>
                    {faqs.map((faq) => (
                      <Fragment key={faq.question}>
                        <dt className="mt-10 font-medium text-gray-900">
                          {faq.question}
                        </dt>
                        <dd className="prose prose-sm mt-2 max-w-none text-gray-500">
                          <p>{faq.answer}</p>
                        </dd>
                      </Fragment>
                    ))}
                  </dl>
                </Tab.Panel>

                <Tab.Panel className="pt-10">
                  <h3 className="sr-only">License</h3>
                  <div
                    className="prose prose-sm max-w-none text-gray-500"
                    dangerouslySetInnerHTML={{ __html: license.content }}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}
