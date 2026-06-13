const Return = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 font-poppins">Return Policy</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6 font-poppins">
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Return Eligibility</h2>
          <p className="text-gray-600 leading-relaxed">
            You may return most items within 7 days of delivery for a full refund or exchange.
            Items must be unused, in their original packaging, and with all tags attached.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">2. Non-Returnable Items</h2>
          <p className="text-gray-600 leading-relaxed">
            The following items cannot be returned: personal care products, underwear, swimwear,
            customized products, and items marked as final sale.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">3. Return Process</h2>
          <p className="text-gray-600 leading-relaxed">
            To initiate a return, please contact our customer support team with your order number
            and reason for return. We will provide you with a return authorization and instructions
            on how to send the item back.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">4. Refund</h2>
          <p className="text-gray-600 leading-relaxed">
            Once we receive and inspect the returned item, we will process your refund within
            5-7 business days. The refund will be credited to your original payment method.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">5. Damaged or Defective Items</h2>
          <p className="text-gray-600 leading-relaxed">
            If you receive a damaged or defective item, please contact us within 48 hours of
            delivery with photos of the damage. We will arrange a replacement or full refund.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">6. Return Shipping</h2>
          <p className="text-gray-600 leading-relaxed">
            Return shipping costs are the responsibility of the customer unless the item was
            damaged, defective, or incorrectly shipped. In such cases, we will cover the return
            shipping costs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Return;
