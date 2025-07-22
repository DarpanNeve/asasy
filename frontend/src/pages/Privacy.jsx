import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-2">
            At Assesme, we are committed to protecting your privacy and
            maintaining the confidentiality of your personal and professional
            data. This Privacy Policy outlines how we collect, use, store, and
            disclose information when you interact with our platform or use our
            services. By accessing or using Assesme, you agree to the terms
            described in this policy.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              a) Personal Information:
            </h3>
            <p className="text-gray-700 mb-4">
              We may collect personal details including your name, email
              address, contact number, organization name, professional role, IP
              address, and payment details (processed securely via trusted
              payment gateways).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              b) Content You Provide:
            </h3>
            <p className="text-gray-700 mb-4">
              We collect content that you submit to the platform, such as
              technology descriptions, uploaded files, or other documents used
              for generating assessments or expert reviews.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              c) Usage and Device Information:
            </h3>
            <p className="text-gray-700">
              We collect data related to how you interact with our services,
              including session logs, browser type, device identifiers,
              approximate location (city-level), and time spent on tools or
              reports.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Use of Information
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              a) Service Delivery & Personalization:
            </h3>
            <p className="text-gray-700 mb-4">
              Your information helps us generate customized technology
              assessment reports, process transactions, authenticate your
              account, and improve overall user experience.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              b) Communication:
            </h3>
            <p className="text-gray-700 mb-4">
              We may use your contact details to send important notifications,
              updates, service-related messages, and limited promotional
              content. You can opt out of non-essential communications at any
              time.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              c) Improvement & Analytics:
            </h3>
            <p className="text-gray-700">
              We may analyze aggregated, non-personal data to understand usage
              trends, improve platform performance, and ensure security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Data Sharing and Disclosure
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              a) Service Enablement:
            </h3>
            <p className="text-gray-700 mb-4">
              To provide seamless functionality, certain inputs you submit may
              be processed through secure AI engines to generate insights and
              outputs. However, we ensure your sensitive personal data is not
              disclosed to any external service unnecessarily.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              b) Expert Engagement:
            </h3>
            <p className="text-gray-700 mb-4">
              If you choose to connect with our panel of certified experts for
              further assessment or consultation, only the required data is
              shared—with your consent.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              c) Legal Compliance:
            </h3>
            <p className="text-gray-700">
              We may disclose information when required by law, regulation, or
              legal process to protect the rights, property, or safety of
              Assesme and its users.
            </p>

            <p className="text-gray-700 mt-4">
              We do not sell or rent your personal information under any
              circumstances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>SSL/TLS encryption for all data transmissions</li>
              <li>Server-side encryption for stored data</li>
              <li>Secure, ISO-certified data hosting</li>
              <li>Multi-factor authentication and access controls</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Data Retention
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                User Account Data: Retained until account deletion or inactivity
                for 24 months
              </li>
              <li>
                Assessment Reports: Retained for 12 months unless deleted
                earlier by the user
              </li>
              <li>
                Financial Records: Retained for 7 years to comply with statutory
                obligations
              </li>
            </ul>
            <p className="text-gray-700">
              In the event of a data breach, affected users will be notified
              within 72 hours.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Access or correct your personal information</li>
              <li>Request deletion (Right to be Forgotten)</li>
              <li>Withdraw consent or object to data processing</li>
              <li>Request a copy of your data (data portability)</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, contact us at: support@assesme.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Children’s Privacy
            </h2>
            <p className="text-gray-700">
              Assesme is not designed for individuals under the age of 18. We do
              not knowingly collect data from minors. Any such data found will
              be deleted immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Cookies and Tracking
            </h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Maintain session and login functionality</li>
              <li>Analyze platform traffic and usage trends</li>
              <li>Enhance user experience</li>
            </ul>
            <p className="text-gray-700">
              You can manage cookie preferences via your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Updates to This Policy
            </h2>
            <p className="text-gray-700">
              This Privacy Policy may be updated from time to time to reflect
              changes in technology, regulations, or service enhancements. We
              will notify users of any significant changes via our platform or
              email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Vastav Intellect IP Solutions LLP
                <br />
                support@assesme.com
                <br />
                +91-8743078668
                <br />
                www.assesme.com
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
