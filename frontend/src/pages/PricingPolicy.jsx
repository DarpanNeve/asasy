import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PricingPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Pricing Policy</h1>
          <p className="text-gray-600 mb-2">At Assesme, we believe in transparency, fairness, and value-based pricing. Our pricing is designed to empower innovators, researchers, institutions, and tech-transfer professionals to access high-quality technology assessment and commercialization tools at affordable, flexible rates.</p>
          <p className="text-gray-600 mb-8">Last updated: July 16, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Token-Based Pricing Model</h2>
            <p className="text-gray-700 mb-4">
              Assesme operates on a token-based pricing system, where users purchase tokens that can be used to generate different levels of technology assessment reports. This system ensures:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Pay-as-you-go flexibility</li>
              <li>No hidden fees</li>
              <li>Access to premium features as needed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Token Pricing Structure</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INR Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Received</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">₹2,500</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">8,000 Tokens</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">₹7,500</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">24,000 Tokens</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">₹9,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">29,000 Tokens</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Token Consumption Per Report Type</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Required</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">Basic Report</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">2,500 Tokens</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">Advanced Report</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">7,500 Tokens</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">Comprehensive Report</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">9,000 Tokens</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 mt-4">
              All reports are globally benchmarked, PDF-formatted, and instantly downloadable, including advanced data visuals, TRL scores, SWOT, IP analysis, and ROI estimations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features Covered Per Plan</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Basic:</strong> Early-stage tech overviews and value proposition</li>
              <li><strong>Advanced:</strong> Feasibility, market signals, IP summaries</li>
              <li><strong>Comprehensive:</strong> Full commercialization roadmap, regulatory, IP claims, ROI, and global freedom-to-operate analysis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cancellation & Refund Policy</h2>
            <p className="text-gray-700 mb-4">
              We value your trust and strive to ensure every transaction with Assesme is meaningful and secure. However, as Assesme is a digital platform delivering instant AI-generated content and intellectual services, our refund and cancellation policy is carefully structured as follows:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">1. No Refund for Consumed Tokens</h3>
            <p className="text-gray-700 mb-4">
              Once tokens are used to generate a report, the associated report is considered delivered and non-refundable, regardless of user satisfaction or error unless the issue is on our system's end (e.g., broken link, incomplete output).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Token Validity</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Purchased tokens are valid for 12 months from the date of purchase.</li>
              <li>Expired tokens will not be refunded or reinstated unless approved under exceptional circumstances.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Refund for Unused Token Packages</h3>
            <p className="text-gray-700 mb-4">
              If a user wishes to cancel their token package before using any tokens:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>A refund request must be submitted within 7 days of purchase.</li>
              <li>A 10% processing fee will be deducted from the total amount paid.</li>
              <li>Refunds will be issued to the original payment method within 7–10 business days after approval.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Cancellation by Assesme</h3>
            <p className="text-gray-700 mb-4">
              Assesme reserves the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Suspend or terminate user accounts due to violation of platform terms</li>
              <li>Revoke or restrict access if the system is being misused or manipulated</li>
            </ul>
            <p className="text-gray-700 mb-4">In such cases:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Unused tokens may be refunded based on an internal review</li>
              <li>Generated reports will remain accessible unless removed due to a breach</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">5. System Errors or Failures</h3>
            <p className="text-gray-700 mb-4">
              If a report is not delivered due to system malfunction:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Users are entitled to a full token refund for that transaction</li>
              <li>Alternatively, users may regenerate the report at no additional cost</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">6. RTTP & Expert Service Access</h3>
            <p className="text-gray-700 mb-4">
              If you opt for human expert review, RTTP consultancy, or add-on services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>These services are non-refundable once delivered</li>
              <li>Cancellations for booked consultations must be requested at least 24 hours in advance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact for Refund/Cancellation Requests</h2>
            <p className="text-gray-700">
              To request a cancellation or refund, please email our support team with full details at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                📧 <a href="mailto:support@assesme.com" className="text-blue-600 hover:underline">support@assesme.com</a><br />
                📞 <a href="tel:+918743078668" className="text-blue-600 hover:underline">‪+91-87430-78668‬</a><br />
                📍 Vastav Intellect IP Solutions LLP – Innovation & Technology Division<br />
                🌐 <a href="https://www.assesme.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.assesme.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}