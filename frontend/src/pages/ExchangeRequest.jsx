import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

const ExchangeRequest = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Exchange request submitted!");
      setOrderNumber("");
      setReason("");
      setDescription("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 font-poppins">Exchange Request</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <FiRefreshCw className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-poppins">Request an Exchange</h2>
            <p className="text-sm text-gray-500 font-poppins">Fill out the form below to request an exchange</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 font-poppins">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g., ORDER-XXXXXXXX"
              className="input-field font-poppins"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 font-poppins">Reason for Exchange</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field font-poppins"
              required
            >
              <option value="">Select a reason</option>
              <option value="wrong-size">Wrong Size</option>
              <option value="wrong-item">Wrong Item Received</option>
              <option value="damaged">Damaged Item</option>
              <option value="defective">Defective Product</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 font-poppins">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Please describe the issue in detail..."
              className="input-field font-poppins"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 font-poppins"
          >
            <FiRefreshCw className="h-4 w-4" />
            {loading ? "Submitting..." : "Submit Exchange Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExchangeRequest;
