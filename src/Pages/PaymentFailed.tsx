import { XCircle, AlertTriangle } from "lucide-react";

export default function PaymentFailed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 w-16 h-16" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again or use a different
          payment method.
        </p>

        <div className="bg-red-50 border border-red-100 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 w-5 h-5 mr-2 mt-0.5" />
            <p className="text-red-700 text-sm">
              Error code: CARD_DECLINED - Your card was declined. Please check
              your card details or contact your bank.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Attempted Amount</span>
            <span className="font-medium">$149.99</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">April 21, 2025</span>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Try Again
          </button>
          <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors">
            Change Payment Method
          </button>
          <button className="w-full bg-transparent text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-md transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
