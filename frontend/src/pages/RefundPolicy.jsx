import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. General Refund Policy</h2>
            <p className="text-gray-700 mb-4">
              Due to the digital nature of our services and the immediate delivery of AI-generated reports, 
              refunds are generally not available once tokens have been used to generate reports.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligible Refund Scenarios</h2>
            <p className="text-gray-700 mb-4">Refunds may be considered in the following cases:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Technical failure preventing report generation</li>
              <li>Duplicate charges due to payment processing errors</li>
              <li>Unused tokens within 7 days of purchase (subject to conditions)</li>
              <li>Service unavailability for extended periods</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Non-Refundable Items</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Tokens used to generate completed reports</li>
              <li>Expired tokens (after 90-day validity period)</li>
              <li>Promotional or discounted token purchases</li>
              <li>RTTP consultation fees</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Process</h2>
            <p className="text-gray-700 mb-4">To request a refund:</p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>Contact our support team within 7 days of purchase</li>
              <li>Provide your transaction ID and reason for refund</li>
              <li>Our team will review your request within 3-5 business days</li>
              <li>If approved, refunds will be processed within 7-10 business days</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Methods</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Refunds will be processed to the original payment method</li>
              <li>Credit card refunds may take 5-10 business days to appear</li>
              <li>Bank transfer refunds may take 3-7 business days</li>
              <li>Processing fees may be deducted from refund amount</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Partial Refunds</h2>
            <p className="text-gray-700 mb-4">
              In certain cases, partial refunds may be offered based on:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Number of tokens used vs. purchased</li>
              <li>Time elapsed since purchase</li>
              <li>Nature of the issue or complaint</li>
              <li>Service usage history</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              If you're not satisfied with our refund decision, you may:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Request escalation to our management team</li>
              <li>Provide additional documentation supporting your case</li>
              <li>Seek resolution through your payment provider</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact for Refunds</h2>
            <p className="text-gray-700 mb-4">
              To request a refund or ask questions about this policy:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Email: refunds@asasy.com<br />
                Subject: Refund Request - [Your Transaction ID]<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Policy Updates</h2>
            <p className="text-gray-700">
              This refund policy may be updated from time to time. Users will be notified of 
              significant changes via email and website notifications.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}