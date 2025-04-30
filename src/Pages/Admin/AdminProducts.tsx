import { useState, useRef, useEffect, ChangeEvent } from "react";
import useFetchData from "@/Hooks/useFetchData";
import useInsertData from "@/Hooks/useInsertData";
import { ReactNode } from "react";
import { serverURL } from "../../config.ts";
import PhotoGallery from "./Components/PhotoGallery.tsx";
import { Trash2 } from "lucide-react";
function Modal({
  children,
  setModalOpen,
}: {
  children: ReactNode;
  setModalOpen: Function;
}) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center bg-[#53535380] items-center">
      <div className="bg-white p-4 rounded relative">
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-2 right-2 text-xl cursor-pointer"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const products = useFetchData("api/admin/get-product-data");
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const [productToAdd, setProductToAdd] = useState<any>(null);
  const [formError, setFormError] = useState<string>("");

  const { success, loading } = useInsertData(
    productToAdd ? "api/admin/insert-product-data" : "",
    productToAdd
  );

  const Table = ({
    products,
    onDeleteProduct,
  }: {
    products: {
      data: any[];
      loading: boolean;
      error: string | null;
      refresh: Function;
    };
    onDeleteProduct: (productId: string) => Promise<void>;
  }) => {
    if (products.loading) return <p>Loading...</p>;
    if (products.error) return <p>Error: {products.error}</p>;
    if (!products.data || products.data.length === 0)
      return <p>No products found.</p>;

    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [deleteButtonLoading, setDeleteButtonLoading] =
      useState<boolean>(false);
    const [activeProduct, setActiveProduct] = useState<any>(null);
    const [needsSaving, setNeedsSaving] = useState<boolean>(false);

    const toggleDropdown = (product: any) => {
      if (needsSaving) updateProduct(activeProduct, products.refresh);
      setExpandedRow(expandedRow === product.id ? null : product.id);
      setActiveProduct(product);
      setNeedsSaving(false);
    };

    const handleDeleteProduct = async (
      e: React.MouseEvent,
      productId: string
    ) => {
      e.stopPropagation(); // Prevent row toggle when clicking delete
      try {
        setDeleteButtonLoading(true);
        await onDeleteProduct(productId);
      } finally {
        setDeleteButtonLoading(false);
      }
    };

    window.addEventListener("beforeunload", function (e) {
      if (needsSaving) {
        // Standard way to show a confirmation dialog on page unload
        e.preventDefault();
        // This text might not be displayed in some browsers, but it triggers the confirmation dialog
        e.returnValue =
          "You have unsaved changes. Do you really want to leave?";
        return e.returnValue;
      }
    });
    const updateProduct = async (product: any, refresh: Function) => {
      try {
        delete product._id;
        const response = await fetch(`${serverURL}/shop/update-product/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product }),
        });
        if (!response.ok) {
          console.error("Failed to update product data");
        }
      } catch (err) {
        console.error(err);
      } finally {
        refresh();
        setNeedsSaving(false);
      }
    };

    const handleUpdateActiveProduct = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      var { id, value } = e.target;
      if (
        e.target instanceof HTMLInputElement &&
        e.target.type === "checkbox"
      ) {
        setActiveProduct({
          ...activeProduct,
          [id]: e.target.checked,
        });
      } else if (
        e.target instanceof HTMLInputElement &&
        e.target.type === "number"
      ) {
        let parsedValue = parseFloat(value);
        if (parsedValue < 0) parsedValue = 0;
        setActiveProduct({
          ...activeProduct,
          [id]: parsedValue,
        });
      } else {
        setActiveProduct({
          ...activeProduct,
          [id]: value,
        });
      }

      setNeedsSaving(true);
    };

    const [open, setOpen] = useState<boolean>(false);

    const onConfirm = (selectedImages: string[]) => {
      setActiveProduct({ ...activeProduct, images: selectedImages });
      console.log(selectedImages);
      setNeedsSaving(true);
    };

    const deselectImage = (image: string) => {
      const images = activeProduct.images;
      setActiveProduct({
        ...activeProduct,
        images: images.filter((img: string) => img !== image),
      });
      setNeedsSaving(true);
    };
    return (
      <div className="mt-4">
        {products.data.map((product) => (
          <div key={product.id} className="mb-2 border border-gray-200 rounded">
            <div
              className="grid grid-cols-4 py-3 px-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleDropdown(product)}
            >
              <div className="text-gray-600">#{product.id}</div>
              <div className="font-medium">{product.title}</div>
              <div className="text-green-600 font-medium">{product.price}€</div>
              <div className="flex justify-end">
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${
                    expandedRow === product.id
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {expandedRow === product.id ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {expandedRow === product.id && (
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="w-full h-90 bg-white border rounded-md">
                      <PhotoGallery
                        initialSelected={activeProduct.images}
                        open={open}
                        setOpen={setOpen}
                        onConfirm={onConfirm}
                      ></PhotoGallery>
                      {activeProduct.images.length > 0 ? (
                        <div className="relative h-full">
                          <button
                            onClick={() => {
                              deselectImage(activeProduct.images[0]);
                            }}
                            className="bg-gray-100 w-7 h-7 text-white rounded-full flex justify-center absolute items-center right-0 top-0 cursor-pointer"
                          >
                            <Trash2 color="grey" size={20} />
                          </button>
                          <img
                            onClick={() => {
                              setOpen(true);
                            }}
                            src={activeProduct.images[0]}
                            alt=""
                            className="h-full z-10 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <>
                          <button
                            className="w-full h-full bg-gray-200 cursor-pointer"
                            onClick={() => {
                              setOpen(true);
                            }}
                          >
                            Select images
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex flex-row gap-2 mt-2 w-full flex-wrap">
                      {activeProduct.images &&
                        activeProduct.images.length > 1 &&
                        activeProduct.images
                          .slice(1)
                          .map((image: string, index: number) => {
                            return (
                              <div className="relative">
                                <button
                                  onClick={() => {
                                    deselectImage(image);
                                  }}
                                  className="bg-gray-100 w-7 h-7 text-white rounded-full flex justify-center absolute items-center right-0 top-0 cursor-pointer"
                                >
                                  <Trash2 color="grey" size={20} />
                                </button>
                                <img
                                  src={image}
                                  onClick={() => setOpen(true)}
                                  className="max-h-50 cursor-pointer"
                                  alt={`${index}`}
                                />
                              </div>
                            );
                          })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Title</h4>
                    <textarea
                      className="text-xl w-full"
                      id="title"
                      value={activeProduct.title}
                      onChange={(e) => handleUpdateActiveProduct(e)}
                    ></textarea>
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <textarea
                      className="w-full min-h-50"
                      id="description"
                      value={activeProduct.description}
                      onChange={(e) => handleUpdateActiveProduct(e)}
                    ></textarea>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor={`category-${product.id}`}
                    >
                      Category
                    </label>
                    <RichTextEditor></RichTextEditor>
                    <select
                      id="category"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={activeProduct.category}
                      onChange={(e) => handleUpdateActiveProduct(e)}
                    >
                      <option value="Pasta">Pasta</option>
                      <option value="Oil">Oil</option>
                      <option value="Sauce">Sauce</option>
                      <option value="Spice">Spice</option>
                    </select>
                    <div className="flex flex-row gap-3 mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex flex-col">
                        <label htmlFor="price">Price: (€)</label>
                        <input
                          id="price"
                          type="number"
                          className="border rounded-md w-25 px-3 py-1"
                          value={activeProduct.price}
                          onChange={(e) => handleUpdateActiveProduct(e)}
                        />
                      </div>

                      <div>
                        <span>Item is on sale:</span>
                        <input
                          type="checkbox"
                          className="p-2 border border-gray-300 rounded"
                          id="onSale"
                          checked={activeProduct.onSale}
                          onChange={(e) => handleUpdateActiveProduct(e)}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor="salePrice"
                          className={` px-3 py-1 ${
                            activeProduct.onSale ? "" : "text-gray-400 "
                          }`}
                        >
                          Sale price: (€)
                        </label>
                        <input
                          id="salePrice"
                          className={`${
                            activeProduct.onSale
                              ? "bg-transparent"
                              : "text-gray-400  bg-gray-200"
                          }
                           border
                           w-25
                           rounded-md
                        `}
                          type="number"
                          value={activeProduct.salePrice}
                          disabled={!activeProduct.onSale}
                          onChange={(e) => handleUpdateActiveProduct(e)}
                        />
                      </div>
                    </div>
                    <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <p>Listing is active:</p>
                      <input
                        type="checkbox"
                        checked={activeProduct.active}
                        onChange={(e) => handleUpdateActiveProduct(e)}
                        id="active"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-5">
                  <button
                    onClick={(e) => handleDeleteProduct(e, product.id)}
                    className={`px-4 py-2 rounded text-white ${
                      deleteButtonLoading
                        ? "bg-gray-400"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={deleteButtonLoading}
                  >
                    {deleteButtonLoading ? "Deleting..." : "Delete Product"}
                  </button>
                  <button
                    onClick={() =>
                      updateProduct(activeProduct, products.refresh)
                    }
                    className={`px-4 py-2 rounded text-white ${
                      deleteButtonLoading || !needsSaving
                        ? "bg-gray-400"
                        : "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    }`}
                    disabled={deleteButtonLoading || !needsSaving}
                  >
                    {deleteButtonLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (success && !loading) {
      setModalOpen(false);
      resetForm();
      products.refresh();
    }
  }, [success, loading]);

  const resetForm = () => {
    if (titleRef.current) titleRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    if (priceRef.current) priceRef.current.value = "";
    setProductToAdd(null);
    setFormError("");
  };

  const validateForm = () => {
    if (!titleRef.current?.value) {
      setFormError("Title is required");
      return false;
    }
    if (!priceRef.current?.value || isNaN(parseFloat(priceRef.current.value))) {
      setFormError("Valid price is required");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleAddProduct = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", titleRef.current!.value);
    formData.append("description", descriptionRef.current?.value || "");
    formData.append("price", priceRef.current!.value);
    formData.append("category", categoryRef.current?.value || "Pasta");

    // To match your current implementation structure
    // You might need to adjust this based on how your API expects data
    setProductToAdd({
      title: titleRef.current!.value,
      description: descriptionRef.current?.value || "",
      price: parseFloat(priceRef.current!.value),
      category: categoryRef.current?.value || "Pasta",
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `${serverURL}/api/admin/delete-product/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      products.refresh();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-[100vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Product
        </button>
      </div>

      {modalOpen && (
        <Modal setModalOpen={setModalOpen}>
          <div className="w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>

            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="title"
                  >
                    Product Title *
                  </label>
                  <input
                    ref={titleRef}
                    id="title"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Product title"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    ref={descriptionRef}
                    id="description"
                    className="w-full p-2 border border-gray-300 rounded h-32"
                    placeholder="Product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="price"
                    >
                      Price (€) *
                    </label>
                    <input
                      ref={priceRef}
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="category"
                    >
                      Category
                    </label>
                    <select
                      ref={categoryRef}
                      id="category"
                      className="w-full p-2 border border-gray-300 rounded"
                      defaultValue="Pasta"
                    >
                      <option value="Pasta">Pasta</option>
                      <option value="Oil">Oil</option>
                      <option value="Sauce">Sauce</option>
                      <option value="Spice">Spice</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 py-3 px-4 font-medium text-gray-700">
          <div>ID</div>
          <div>Product Name</div>
          <div>Price</div>
          <div></div>
        </div>

        <Table products={products} onDeleteProduct={handleDeleteProduct} />
      </div>
    </div>
  );
}
