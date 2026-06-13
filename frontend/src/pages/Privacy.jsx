const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 font-poppins">Privacy Policy</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6 font-poppins">
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect information you provide directly to us, such as when you create an account,
            make a purchase, or contact us. This may include your name, email address, phone number,
            shipping address, and payment information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use the information we collect to process transactions, send you order updates,
            provide customer support, and improve our services. We may also use your information
            to send you promotional communications with your consent.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
          <p className="text-gray-600 leading-relaxed">
            We do not sell or rent your personal information to third parties. We may share your
            information with trusted service providers who assist us in operating our website
            and conducting our business.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate security measures to protect your personal information.
            However, no method of transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience on our
            website. You can control cookie settings through your browser preferences.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed">
            You have the right to access, correct, or delete your personal information. You may
            also opt out of receiving promotional communications from us at any time.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at
            info@hrlifestyle.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
