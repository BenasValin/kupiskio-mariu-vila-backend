import { CheckCircle } from "lucide-react";

export default function PaymentSuccessful() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your transaction has been completed successfully.
        </p>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-medium">TXN87654321</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium">$149.99</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">April 21, 2025</span>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
            View Receipt
          </button>
          <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors">
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
