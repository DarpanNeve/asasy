import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-2">Powered by Vastav Intellect IP Solutions LLP</p>
          <p className="text-gray-600 mb-8">Last Updated: July 16, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Assesme, developed by Vastav Intellect IP Solutions LLP, is committed to protecting
              your privacy. This policy explains how we collect, use, and protect your data when
              you use our AI-powered technology assessment platform (“Assesme”), including when you
              engage with tools powered by third-party APIs such as OpenAI.
            </p>
            <p className="text-gray-700 mb-4">
              We comply with the highest global standards including the General Data Protection
              Regulation (GDPR), California Consumer Privacy Act (CCPA), and Indian Information
              Technology Act (IT Rules 2021).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Data We Collect</h2>
            <p className="text-gray-700 mb-4">We collect the following types of information:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">A. Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Mobile Number</li>
              <li>Organisation Name & Role</li>
              <li>IP Address</li>
              <li>Payment and Billing Data (handled by third-party processors like Razorpay or Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">B. User-Submitted Content</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Technology descriptions, ideas, use cases, and other inputs you provide to generate assessment reports</li>
              <li>Uploaded files for expert review or processing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">C. Usage & Device Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Session data, log files, browser type, device ID, geographic location (city-level)</li>
              <li>Interactions with assessment tools, time spent on modules</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Use of OpenAI API and Data Handling
            </h2>
            <p className="text-gray-700 mb-4">
              Assesme uses OpenAI’s API to generate technology assessment reports. This means
              certain user-submitted prompts and inputs (like technology summaries or idea
              descriptions) may be transmitted to OpenAI’s servers to receive AI-generated output.
            </p>
            <p className="text-gray-700 mb-2 font-semibold">Important Disclosures:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>We do not use your personal data to train OpenAI’s models.</li>
              <li>
                OpenAI does not store data submitted via API beyond 30 days, and does not use it
                for model training, per OpenAI’s Data Usage Policy.
              </li>
              <li>Data sent to OpenAI is transmitted securely using TLS encryption.</li>
              <li>We never send your billing data or login credentials to OpenAI or any third-party API.</li>
            </ul>
            <p className="text-gray-700">
              You can read OpenAI’s Privacy Policy at:{" "}
              <a href="https://openai.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                https://openai.com/privacy
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your data:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>To create AI-powered technology assessment reports</li>
              <li>To authenticate and manage your user account</li>
              <li>To process token-based transactions securely</li>
              <li>For support, updates, and report delivery</li>
              <li>To improve our platform and monitor misuse</li>
              <li>To connect users with RTTP experts (only if opted-in)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              No data is sold or used for advertising purposes. Our use is strictly for service
              provision and legal compliance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing and Third Parties</h2>
            <p className="text-gray-700 mb-4">We do not sell or rent your personal data. We only share it:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>With OpenAI, for the purpose of generating report content (as described above)</li>
              <li>With certified RTTP experts if you request external review</li>
              <li>With third-party processors for secure payments</li>
              <li>When legally required to comply with local laws or court orders</li>
            </ul>
            <p className="text-gray-700 mt-4">
              All third parties are bound by strict confidentiality and data protection agreements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security and Retention</h2>
            <p className="text-gray-700 mb-4">We employ enterprise-grade security measures:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>HTTPS & SSL encryption</li>
              <li>Server-side encryption (AES-256)</li>
              <li>Multi-factor authentication (MFA)</li>
              <li>Secure cloud hosting (ISO 27001-compliant data centers)</li>
            </ul>
            <p className="text-gray-700 mb-2 font-semibold">Retention periods:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Account data: Until deletion or inactivity of 24 months</li>
              <li>Report data: 12 months (unless deleted by user)</li>
              <li>Financial logs: 7 years (for compliance)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              In case of a data breach, users will be notified within 72 hours.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Your Rights (GDPR/CCPA/Indian Users)
            </h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access or correct your data</li>
              <li>Request deletion (“Right to be Forgotten”)</li>
              <li>Object to processing or withdraw consent</li>
              <li>Request data portability</li>
              <li>File complaints with Data Protection Authorities</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Contact: <a href="mailto:support@assesme.com" className="text-blue-600 hover:underline">support@assesme.com</a> to exercise these rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Assesme is not intended for users under 18. We do not knowingly collect data from
              minors. If data is found, we will delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cookies & Tracking</h2>
            <p className="text-gray-700 mb-4">We use cookies and trackers to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Maintain login sessions</li>
              <li>Analyze traffic patterns (via Google Analytics)</li>
              <li>Improve user experience</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Users can opt-out of non-essential cookies via browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              This Privacy Policy is regularly reviewed. Material changes will be communicated to
              users via email or dashboard notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Data Protection Officer (DPO):<br />
                Vastav Intellect IP Solutions LLP<br />
                Email: <a href="mailto:support@assesme.com" className="text-blue-600 hover:underline">support@assesme.com</a><br />
                Phone: +91-8743078668<br />
                Website: <a href="https://www.assesme.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.assesme.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}