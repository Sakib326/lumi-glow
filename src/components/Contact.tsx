export default function Contact() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Location:</span> Dhaka, Bangladesh
          (Near North South University)
        </p>
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Email:</span> support@lumiglow.com
        </p>
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Phone:</span> +880 1XXXXXXXXX
        </p>
        <p className="text-gray-500 text-sm mt-4">
          We are based in Dhaka, close to North South University (NSU). For any
          queries, please reach out via email or phone.
        </p>
      </div>
    </div>
  );
}
