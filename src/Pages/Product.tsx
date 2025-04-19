import { useEffect, useState } from "react";
import useFetchData from "@/Hooks/useFetchData";
import addToCart from "@/Components/addToCart";

export default function Product() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const product = useFetchData(`shop/${productId}`);
  const data: any = product.data;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading product...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
            {data.image ? (
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-md">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
            <div className="mb-4">
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                {data.category}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{data.description}</p>

            <div className="mt-auto">
              <div className="flex items-baseline mb-4">
                {data.onSale ? (
                  <>
                    <span className="text-3xl font-bold text-green-600">
                      ${data.salePrice}
                    </span>
                    <span className="ml-2 text-xl text-gray-500 line-through">
                      ${data.price}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                      Save ${data.price - data.salePrice}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">${data.price}</span>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={(e) => addToCart(data.id, e)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex-1"
                >
                  Add to Cart
                </button>
                <button className="border border-gray-300 hover:bg-gray-100 px-3 py-3 rounded-lg">
                  ♡
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Product ID: {data.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
