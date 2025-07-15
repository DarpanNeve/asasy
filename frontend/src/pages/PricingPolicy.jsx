import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PricingPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Pricing Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Token-Based Pricing</h2>
            <p className="text-gray-700 mb-4">
              Asasy operates on a token-based pricing system where users purchase tokens to generate reports.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Basic Report: 2,500 tokens</li>
              <li>Advanced Report: 7,500 tokens</li>
              <li>Comprehensive Report: 9,000 tokens</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Token Packages</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-3">Available Packages:</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Starter Pack:</strong> 8,000 tokens - $30.00 (+ 18% GST)</li>
                <li><strong>Pro Pack:</strong> 24,000 tokens - $90.00 (+ 18% GST)</li>
                <li><strong>Max Pack:</strong> 29,000 tokens - $108.00 (+ 18% GST)</li>
                <li><strong>Enterprise:</strong> Custom pricing for bulk requirements</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Pricing Structure</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All prices are listed in USD</li>
              <li>18% GST is applicable on all purchases</li>
              <li>Discounted pricing may be available during promotional periods</li>
              <li>Enterprise customers receive custom pricing based on volume</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Token Validity</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Tokens are valid for 90 days from the date of purchase</li>
              <li>Unused tokens expire after the validity period</li>
              <li>No extensions are provided for expired tokens</li>
              <li>Token validity cannot be transferred between accounts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Methods</h2>
            <p className="text-gray-700 mb-4">We accept the following payment methods:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Credit/Debit Cards (Visa, MasterCard, American Express)</li>
              <li>Net Banking</li>
              <li>UPI Payments</li>
              <li>Digital Wallets</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Price Changes</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify our pricing at any time. Price changes will be communicated 
              through email notifications and website announcements at least 30 days in advance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Promotional Pricing</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Promotional discounts may be offered periodically</li>
              <li>Promotional pricing is subject to terms and conditions</li>
              <li>Discounts cannot be combined with other offers</li>
              <li>We reserve the right to modify or cancel promotions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-700">
              For questions about pricing or custom enterprise solutions, contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Email: pricing@asasy.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}