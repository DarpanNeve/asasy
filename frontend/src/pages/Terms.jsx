import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Asasy's services, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 mb-4">
              Asasy provides AI-powered technology assessment reports and connects users with 
              Registered Technology Transfer Professionals (RTTPs).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must notify us immediately of any unauthorized use</li>
              <li>One person or legal entity may not maintain more than one account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Token System</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Tokens are required to generate reports</li>
              <li>Tokens are valid for 90 days from purchase date</li>
              <li>Tokens are non-transferable and non-refundable except as stated in our refund policy</li>
              <li>Unused tokens expire after the validity period</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All payments are processed in USD</li>
              <li>Prices include applicable taxes (GST)</li>
              <li>Payment is required before service delivery</li>
              <li>We reserve the right to change prices with notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              Reports generated through our service are provided for your use. However, the underlying 
              technology and platform remain our intellectual property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Our liability is limited to the amount paid for the specific service. We are not liable 
              for indirect, incidental, or consequential damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account at any time for violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Email: legal@asasy.com<br />
                Address: [Your Company Address]
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}