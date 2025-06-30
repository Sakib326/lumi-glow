import { StarIcon } from "@heroicons/react/20/solid";

const products = [
  {
    id: 1,
    name: "CeraVe Moisturising Cream",
    price: "৳2500.00",
    rating: 5,
    reviewCount: 38,
    imageSrc:
     "https://bk.shajgoj.com/storage/2020/11/CeraVe-Moisturising-Cream-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Groome Beauty Blender Sponge - Yellow",
    price: "৳ 98.00",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://bk.shajgoj.com/storage/2025/05/groome-beauty-blender-sponge-yellow.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "Groome Makeup Blender Sponge - Pink ",
    price: "৳49.00",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://bk.shajgoj.com/storage/2025/05/groome-makeup-blender-sponge-pink.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Skin Cafe Micellar Water",
    price: "৳299.00",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/11/SkinCafe-Micellar-Water-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "PINKFLASH Melting Matte Waterproof Lipcream – P03 Obsession (PF-L01)",
    price: "৳165.00",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/06/PINKFLASH-Melting-Matte-Waterproof-Lipcream-P03-PF-L01.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Skin Cafe Makeup Cleansing Oil Advanced",
    price: "৳469.00",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://bk.shajgoj.com/storage/2020/09/skin-cafe-Make-up-cleansing-Oil-05.png",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "PINKFLASH Waterproof Day Mascara - 7ml (PF-E08)",
    price: "৳350",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/06/PINKFLASH-Waterproof-Day-Mascara-7ml-PF-E0801.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Glow & Lovely BB Multi Vitamin Cream with Foundation 40.0 gm",
    price: "৳185.0",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2024/12/glow-lovely-bb-multi-vitamin-cream-with-foundation-400-gm-2.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "Ponds Face Wash Bright Beauty",
    price: "৳135.00",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://bk.shajgoj.com/storage/2025/04/ponds-face-wash-bright-beauty.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "L'Oreal Paris Feria Multi-Faceted Shimmering Permanent Hair Color - Light Brown 60",
    price: "৳2150.00",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://bk.shajgoj.com/storage/2020/04/L%E2%80%99Oreal-Paris-Feria-Multi-Faceted-Shimmering-Permanent-Hair-Color-%E2%80%93-Light-Brown-60.png",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "PINKFLASH Ever Glossy Moist Lip Gloss - S03 JOURNEY (PF-L02)",
    price: "৳250",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/06/PINKFLASH-Ever-Glossy-Moist-Lip-Gloss-S03-JOURNEY-PF-L02.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "3W Clinic Intensive UV Sunblock Cream SPF 50+PA+++",
    price: "৳499.00",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2019/08/3W-Clinic-Intensive-UV-Sunblock-Cream-SPF-50PA-70ML-7354-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "L'Oreal Revitalift Hydrating Day Cream",
    price: "৳2450.00",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://bk.shajgoj.com/storage/2025/02/loreal-revitalift-hydrating-day-cream.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "L'Oreal Liss Unlimited Primrose Oil",
    price: "৳1650.00",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://bk.shajgoj.com/storage/2022/05/loreal-serie-expert-liss-unlimited-primrose-oil-125ml_regular_6332df6036ecb.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "L'Oreal Paris Excellence Creme Permanent Hair Color Medium Brown 5",
    price: "৳2250.00",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://bk.shajgoj.com/storage/2019/12/l_oreal_excellence_triple_protection_color_-_medium_brown_5.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "L'Oreal Elvive Extraordinary Oil ( Coloured Hair )",
    price: "৳2200.00",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2025/01/loreal-elvive-extraordinary-oil-coloured-hair-updated-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "L’Oreal Paris Feria Faceted Shimmering Permanent Hair Color P1 Sapphire Smoke",
    price: "৳2250.00",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://bk.shajgoj.com/storage/2024/05/L%E2%80%99Oreal-Paris-Feria-Faceted-Shimmering-Permanent-Hair-Color-P1-Sapphire-Smoke.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Gucci a winter melody",
    price: "৳12999.00",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://bk.shajgoj.com/storage/2020/05/A-Winter-Melody-Cypress-150ml-acqua-profumata.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "Enchanteur Pocket Perfume EDT Alluring",
    price: "৳230",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://bk.shajgoj.com/storage/2022/06/Enchanteur-Pocket-Perfume-EDT-Alluring2.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Lady Million Eau My Gold",
    price: "৳4899.00",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://bk.shajgoj.com/storage/2018/07/lady-million-toiletries-eau-my-gold-1.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 1,
    name: "Lady Butterfly face mask applying bamboo brush - gold bristle",
    price: "৳80",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://bk.shajgoj.com/storage/2020/09/Groome-Face-Mask-Applying-Bamboo-Brush-Gold-Bristle.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 2,
    name: "Sasi Super Oil Control Powder",
    price: "৳325.00",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://bk.shajgoj.com/storage/2023/11/Sasi-Super-Oil-Control-Powder2.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 3,
    name: "Topface Instyle Loose Powder - 104",
    price: "৳1450",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://bk.shajgoj.com/storage/2020/12/Topface-Instyle-Loose-Powder-104.jpg",
    imageAlt: "TODO",
    href: "/product-details",
  },
  {
    id: 4,
    name: "Simple Booster Serum 3% Hyaluronic Acid & B5",
    price: "৳1550",
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
