import { StarIcon } from "@heroicons/react/20/solid";

const products = [
  {
    id: 1,
    name: "Organize Basic Set (Walnut)",
    price: "$149",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://i.chaldn.com/_mpimage/nivea-soft-light-moisturiser-cream-100-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D136858&q=best&v=1",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Organize Pen Holder",
    price: "$15",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://images.ctfassets.net/t975yazu1avh/1fnF8axr3M3oC59f6loOKE/3a0879ab66fe2c3e91bf9f57c836d4ab/CnC_ESSN_CLNSR_PUMP_8oz_EDI_transition_JPG.webp",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "Organize Sticky Note Holder",
    price: "$15",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://staticm244.lafz.com/media/catalog/product/cache/98cdf2e6cd24729d03efc2cfc774e97e/s/e/serum_zinc_1500x1500_1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "$15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/07/Simple-Booster-Serum-3-Hyaluronic-Acid-amp-B59-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "Organize Basic Set (Walnut)",
    price: "$149",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://i.chaldn.com/_mpimage/nivea-soft-light-moisturiser-cream-100-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D136858&q=best&v=1",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Organize Pen Holder",
    price: "$15",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://images.ctfassets.net/t975yazu1avh/1fnF8axr3M3oC59f6loOKE/3a0879ab66fe2c3e91bf9f57c836d4ab/CnC_ESSN_CLNSR_PUMP_8oz_EDI_transition_JPG.webp",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "Organize Sticky Note Holder",
    price: "$15",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://staticm244.lafz.com/media/catalog/product/cache/98cdf2e6cd24729d03efc2cfc774e97e/s/e/serum_zinc_1500x1500_1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "$15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/07/Simple-Booster-Serum-3-Hyaluronic-Acid-amp-B59-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "Organize Basic Set (Walnut)",
    price: "$149",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://i.chaldn.com/_mpimage/nivea-soft-light-moisturiser-cream-100-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D136858&q=best&v=1",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Organize Pen Holder",
    price: "$15",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://images.ctfassets.net/t975yazu1avh/1fnF8axr3M3oC59f6loOKE/3a0879ab66fe2c3e91bf9f57c836d4ab/CnC_ESSN_CLNSR_PUMP_8oz_EDI_transition_JPG.webp",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "Organize Sticky Note Holder",
    price: "$15",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://staticm244.lafz.com/media/catalog/product/cache/98cdf2e6cd24729d03efc2cfc774e97e/s/e/serum_zinc_1500x1500_1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "$15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/07/Simple-Booster-Serum-3-Hyaluronic-Acid-amp-B59-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "Organize Basic Set (Walnut)",
    price: "$149",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://i.chaldn.com/_mpimage/nivea-soft-light-moisturiser-cream-100-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D136858&q=best&v=1",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Organize Pen Holder",
    price: "$15",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://images.ctfassets.net/t975yazu1avh/1fnF8axr3M3oC59f6loOKE/3a0879ab66fe2c3e91bf9f57c836d4ab/CnC_ESSN_CLNSR_PUMP_8oz_EDI_transition_JPG.webp",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "Organize Sticky Note Holder",
    price: "$15",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://staticm244.lafz.com/media/catalog/product/cache/98cdf2e6cd24729d03efc2cfc774e97e/s/e/serum_zinc_1500x1500_1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "$15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/07/Simple-Booster-Serum-3-Hyaluronic-Acid-amp-B59-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "Organize Basic Set (Walnut)",
    price: "$149",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://i.chaldn.com/_mpimage/nivea-soft-light-moisturiser-cream-100-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D136858&q=best&v=1",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Organize Pen Holder",
    price: "$15",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://images.ctfassets.net/t975yazu1avh/1fnF8axr3M3oC59f6loOKE/3a0879ab66fe2c3e91bf9f57c836d4ab/CnC_ESSN_CLNSR_PUMP_8oz_EDI_transition_JPG.webp",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "Organize Sticky Note Holder",
    price: "$15",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://staticm244.lafz.com/media/catalog/product/cache/98cdf2e6cd24729d03efc2cfc774e97e/s/e/serum_zinc_1500x1500_1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "$15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/07/Simple-Booster-Serum-3-Hyaluronic-Acid-amp-B59-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "Organize Basic Set (Walnut)",
    price: "$149",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://i.chaldn.com/_mpimage/nivea-soft-light-moisturiser-cream-100-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D136858&q=best&v=1",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Organize Pen Holder",
    price: "$15",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://images.ctfassets.net/t975yazu1avh/1fnF8axr3M3oC59f6loOKE/3a0879ab66fe2c3e91bf9f57c836d4ab/CnC_ESSN_CLNSR_PUMP_8oz_EDI_transition_JPG.webp",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "Organize Sticky Note Holder",
    price: "$15",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://staticm244.lafz.com/media/catalog/product/cache/98cdf2e6cd24729d03efc2cfc774e97e/s/e/serum_zinc_1500x1500_1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "$15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/07/Simple-Booster-Serum-3-Hyaluronic-Acid-amp-B59-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductList() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative border-r border-b border-gray-200 p-4 sm:p-6"
            >
              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="pt-10 pb-4 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href={`/products${product.href}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <div className="mt-3 flex flex-col items-center">
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.rating > rating
                            ? "text-yellow-400"
                            : "text-gray-200",
                          "flex-shrink-0 h-5 w-5"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.reviewCount} reviews
                  </p>
                </div>
                <p className="mt-4 text-base font-medium text-gray-900">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
