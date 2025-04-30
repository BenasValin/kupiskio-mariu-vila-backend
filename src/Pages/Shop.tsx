import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import useFetchData from "../Hooks/useFetchData";
import makaronai from "../assets/images/makaronai.jpg";
import { CartSizeContext } from "@/contexts/cartSizeContext";
import { useSearchParams, useLocation } from "react-router-dom";
import PriceSlider from "@/Components/PriceSlider";
import addToCart from "@/Components/addToCart";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialSortBy = searchParams.get("sortBy");
  const [sortOption, setSortOption] = useState<string>(
    initialSortBy ? initialSortBy : "asc"
  );
  const { setCartSize } = useContext(CartSizeContext);
  const products = useFetchData(
    `api/admin/get-product-data?${searchParams.toString()}`
  );

  // State for mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSortOption(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", value);
    setSearchParams(newParams);
  };

  const SortBy = () => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor="sortBy" className="font-medium text-gray-700">
          Sort by:
        </label>
        <select
          name="sortBy"
          id="sortBy"
          onChange={handleSortByChange}
          value={sortOption}
          className="p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
        >
          <option value="asc">Price: Low to High</option>
          <option value="des">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    );
  };

  const addCategoryFilter = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", category);
    setSearchParams(newParams);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      addCategoryFilter(event.target.value);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("category");
      setSearchParams(newParams);
    }
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSortOption("asc");
  };

  const Table = ({
    products,
  }: {
    products: { data: any[]; loading: boolean; error: string | null };
  }) => {
    if (products.loading)
      return (
        <div className="w-full flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      );

    if (products.error)
      return (
        <div className="w-full p-8 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>Error: {products.error}</p>
          </div>
        </div>
      );

    if (!products.data || products.data.length === 0)
      return (
        <div className="w-full p-8 text-center">
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-8 rounded">
            <p className="text-lg font-medium">No products found.</p>
            <p className="mt-2">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        </div>
      );

    return (
      <div className="w-full bg-white p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.data.map((element) => (
          <ProductCard
            key={element.id}
            id={element.id}
            img={element.images[0]}
            title={element.title}
            description={element.description}
            price={element.price}
            onSale={element.onSale}
            salePrice={element.salePrice}
          />
        ))}
      </div>
    );
  };

  const ProductCard = ({
    id,
    img,
    title,
    description,
    price,
    onSale,
    salePrice,
  }: {
    id: string;
    img: any;
    title: string;
    description: string;
    price: string;
    onSale: boolean;
    salePrice: string;
  }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100">
        <div className="relative">
          <Link
            to={`/shop/product?id=${id}`}
            className="block h-52 overflow-hidden"
          >
            {img ? (
              <img
                src={img}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </Link>
          {onSale && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
              SALE
            </div>
          )}
        </div>

        <Link
          to={`/shop/product?id=${id}`}
          className="flex-grow flex flex-col p-4"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-amber-600 transition-colors">
            {title}
          </h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {description || "No description available"}
          </p>

          <div className="mt-auto">
            {onSale ? (
              <div className="flex items-center gap-2">
                <p className="text-red-600 font-bold text-xl">{salePrice}€</p>
                <p className="text-gray-500 text-sm line-through">{price}€</p>
                <p className="text-green-600 text-sm font-medium">
                  {Math.round(
                    ((parseFloat(price) - parseFloat(salePrice)) /
                      parseFloat(price)) *
                      100
                  )}
                  % off
                </p>
              </div>
            ) : (
              <p className="text-amber-600 font-bold text-xl">{price}€</p>
            )}
          </div>
        </Link>

        <div className="p-4 pt-2">
          <button
            onClick={(e) => addToCart(id, e)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-full w-full cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with Overlay Text */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={makaronai}
          className="object-cover w-full h-full"
          alt="Pasta banner"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Gourmet Italian Cuisine
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl">
            Discover the finest selection of authentic Italian products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-3 bg-white rounded-lg shadow flex items-center justify-center gap-2 text-gray-700 font-medium border border-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - hidden on mobile until toggled */}
          <div
            className={`w-full md:w-1/4 ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="bg-white rounded-lg shadow-md p-5 sticky top-4">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Price Range
                  </h3>
                  <PriceSlider initialMax={30} />
                </div>

                <div className="border-t pt-4">
                  <SortBy />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-amber-50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        value="pasta"
                        onChange={handleCategoryChange}
                        checked={searchParams.get("category") === "pasta"}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span>Pasta</span>
                      <span className="ml-auto text-gray-400 text-sm">24</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-amber-50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        value="oil"
                        onChange={handleCategoryChange}
                        checked={searchParams.get("category") === "oil"}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span>Oil</span>
                      <span className="ml-auto text-gray-400 text-sm">12</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-amber-50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        value="sauce"
                        onChange={handleCategoryChange}
                        checked={searchParams.get("category") === "sauce"}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span>Sauce</span>
                      <span className="ml-auto text-gray-400 text-sm">18</span>
                    </label>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Special Offers
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-amber-50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span>On Sale</span>
                      <span className="ml-auto text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        HOT
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-amber-50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span>New Arrivals</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={handleClearFilters}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content with product grid */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">
                  {products.data
                    ? `${products.data.length} Products`
                    : "Products"}
                </h2>

                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 hidden md:inline">
                    View as:
                  </span>
                  <button className="p-1.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button className="p-1.5 rounded hover:bg-amber-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <Table products={products} />

              {/* Pagination */}
              {products.data && products.data.length > 0 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">
                          {products.data.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {products.data.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <a
                          href="#"
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                        <a
                          href="#"
                          aria-current="page"
                          className="z-10 bg-amber-50 border-amber-500 text-amber-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        >
                          1
                        </a>
                        <a
                          href="#"
                          className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        >
                          2
                        </a>
                        <a
                          href="#"
                          className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        >
                          3
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
