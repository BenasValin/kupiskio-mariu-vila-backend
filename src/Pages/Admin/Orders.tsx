import { useState } from "react";
import useFetchData from "@/Hooks/useFetchData";
import { serverURL } from "../../config.ts";

export default function Orders() {
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);
  const orders = useFetchData("api/admin/orders");
  const [expandedRow, setExpandedRow] = useState(null);

  const steps = [
    { number: 1, label: "Apmokėjimas" },
    { number: 2, label: "Patvirtinimas" },
    { number: 3, label: "Išsiuntimas" },
    { number: 4, label: "Gavimas" },
  ];

  const updateOrderStatus = async (orderId: number, step: number) => {
    try {
      const response = await fetch(
        `${serverURL}/api/admin/update-order-status/${orderId}/${step}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      orders.refresh();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      setDeleteButtonLoading(true);
      const response = await fetch(
        `${serverURL}/api/admin/delete-order/${orderId}`,
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
      orders.refresh();
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setDeleteButtonLoading(false);
    }
  };

  const calculateTotal = (order: any) => {
    return order.orderInfo.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
  };

  function Status({ currentStep, steps }: { currentStep: any; steps: any }) {
    return (
      <div className="relative flex justify-between w-full px-4">
        {/* Connecting lines */}
        <div className="absolute top-3.5 left-0 right-0 w-full grid grid-cols-3 z-0 px-10">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-1 ${
                index < currentStep - 1 ? "bg-blue-500" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>

        {/* Steps */}
        {steps.map((step: any, index: any) => (
          <div key={index} className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs 
                ${
                  index < currentStep ? "bg-blue-500 shadow-md" : "bg-gray-300"
                }`}
            >
              {step.number}
            </div>
            <p
              className={`text-xs ${
                index < currentStep
                  ? "text-blue-500 font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  const VerticalStatus = ({
    currentStep,
    steps,
  }: {
    currentStep: number;
    steps: any;
  }) => {
    return (
      <div className="flex flex-col gap-8 py-4 pl-4 relative">
        {/* Vertical connecting line */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 z-0"></div>

        {steps.map((step: any, index: any) => {
          const isActive = index < currentStep;
          const isCurrentStep = index === currentStep - 1;

          return (
            <div key={index} className="flex items-center gap-3 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white 
                  ${isActive ? "bg-blue-500" : "bg-gray-300"}
                  ${isCurrentStep ? "ring-2 ring-blue-200" : ""}`}
              >
                {step.number}
              </div>
              <div>
                <p
                  className={`font-medium ${
                    isActive ? "text-blue-500" : "text-gray-600"
                  }`}
                >
                  {step.label}
                </p>
                {isCurrentStep && (
                  <p className="text-xs text-gray-500 mt-0.5">Current status</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const ExpandedRow = ({ order, steps }: { order: any; steps: any }) => {
    // For demo purposes, setting a current step
    order.currentStep = order.currentStep;
    console.log(order);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 border-t border-gray-200">
        {/* Order items */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-800">
            Order Items
          </h4>
          <div className="space-y-3">
            {order.orderInfo.map((item: any) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 text-blue-600 font-semibold rounded w-10 h-10 flex items-center justify-center">
                    {item.quantity}×
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {item.title}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="text-green-600 font-medium mt-1">
                      {item.price}€
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Total:</span>
              <span className="text-lg font-semibold text-green-600">
                {calculateTotal(order)}€
              </span>
            </div>
          </div>
        </div>

        {/* Order status and actions */}
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">
            Order Status
          </h4>

          <div className="flex gap-6 ">
            <VerticalStatus currentStep={order.currentStep} steps={steps} />

            <div className="grid grid-rows-4 pt-4">
              {order.currentStep === 0 && order.user && (
                <button
                  onClick={() => updateOrderStatus(order.id, 2)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors shadow-sm h-min row-[1]"
                >
                  Užsakymas buvo apmokėtas
                </button>
              )}
              {order.currentStep === 1 && (
                <button
                  onClick={() => updateOrderStatus(order.id, 2)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors shadow-sm h-min row-[2]"
                >
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Patvirtinti užsakymą
                </button>
              )}

              {order.currentStep === 2 && (
                <button
                  onClick={() => updateOrderStatus(order.id, 3)}
                  className=" h-min flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors shadow-sm row-[3]"
                >
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Patvirtinti išsiuntimą
                </button>
              )}

              {order.currentStep === 3 && (
                <button
                  onClick={() => updateOrderStatus(order.id, 4)}
                  className=" h-min flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors shadow-sm row-[3]"
                >
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Patvirtinti gavimą
                </button>
              )}

              {order.currentStep === 4 && (
                <div className=" h-min bg-green-50 text-green-700 px-4 py-3 rounded-md border border-green-100 flex items-center gap-2 row-[4]">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Order completed
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => handleDeleteOrder(order.id)}
              className={`px-4 py-2 rounded-md text-white font-medium transition ${
                deleteButtonLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={deleteButtonLoading}
            >
              {deleteButtonLoading ? "Deleting..." : "Delete Order"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading and error states
  if (orders.loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (orders.error)
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">
        <p className="font-medium">Error loading orders:</p>
        <p>{orders.error}</p>
      </div>
    );

  if (!orders.data || orders.data.length === 0)
    return (
      <div className="bg-gray-50 p-8 rounded-lg shadow text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No orders found
        </h3>
        <p className="mt-1 text-gray-500">
          There are currently no orders in the system.
        </p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className=" mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <div className="text-sm text-gray-500">
            {orders.data?.length || 0} orders total
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[150px_2fr_1fr_1fr_1fr_50px] border-b border-gray-200 bg-gray-50 py-3 px-4 font-medium text-gray-700">
            <div>Order ID</div>
            <div className="text-center">Status</div>
            <div>Name</div>
            <div>Surname</div>
            <div>Items</div>
            <div></div>
          </div>

          {/* Table body */}
          {orders.data.map((order) => (
            <div
              key={order.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
            >
              <div
                className="grid grid-cols-[150px_2fr_1fr_1fr_1fr_50px] py-4 px-4 cursor-pointer items-center"
                onClick={() =>
                  setExpandedRow(expandedRow === order.id ? null : order.id)
                }
              >
                <div className="font-mono text-sm text-gray-700">
                  #{order.id}
                </div>
                <Status currentStep={order.currentStep} steps={steps} />
                <div className="text-gray-800">{order.user?.name || "—"}</div>
                <div className="text-gray-800">
                  {order.user?.surname || "—"}
                </div>
                <div className="font-medium text-gray-700">
                  {order.orderInfo.length} items
                </div>
                <div className="flex justify-end">
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${
                      expandedRow === order.id
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {expandedRow === order.id ? (
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

              {expandedRow === order.id && (
                <ExpandedRow order={order} steps={steps} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
