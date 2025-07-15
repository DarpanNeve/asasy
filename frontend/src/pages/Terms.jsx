
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          <p className="text-gray-600 mb-8">Effective Date: July 18, 2025</p>
          <p className="text-gray-600 mb-8">
            Platform Owner: Assesme (a product powered by Vastav Intellect IP Solutions LLP)
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using the Assesme platform (www.assesme.com), you agree to be legally
              bound by these Terms and Conditions and any policies referenced herein, including our
              Privacy Policy and Refund & Cancellation Policy. These terms govern all users,
              including individuals, institutions, RTTPs, and organizations using the platform to
              generate AI-driven technology assessment reports.
            </p>
            <p className="text-gray-700 mb-4">
              If you do not agree with these Terms, do not access or use the platform. These Terms
              apply globally and supersede any local legal terms unless explicitly stated. We
              reserve the right to update or modify these Terms at any time, and continued use of
              the platform after any such changes shall constitute your consent to such changes. We
              recommend you review this document periodically.
            </p>
            <p className="text-gray-700 mb-4">
              If you are using this platform on behalf of a company, university, or institution, you
              warrant that you have the legal authority to bind that entity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Services</h2>
            <p className="text-gray-700 mb-4">
              Assesme is an AI-powered web-based platform designed to generate structured,
              professional, and investor-grade Technology Assessment Reports. Our platform leverages
              third-party APIs, including OpenAI, to provide customized outputs based on user
              inputs.
            </p>
            <p className="text-gray-700 mb-4">
              The services are available in various tiered formats—Basic, Advanced, and
              Comprehensive—each offering increasing levels of analytical depth, data tables, market
              projections, IP insights, and commercialization strategy. Access to these services is
              governed via a token-based subscription model, with each report tier deducting a
              specific number of tokens from the user’s balance.
            </p>
            <p className="text-gray-700 mb-4">
              Assesme offers auto-generated reports, PDF exports, and tools to manage and review
              technology commercialization content. While Assesme uses industry frameworks such as
              WIPO, NIH, EPO, and OECD standards, the platform itself does not offer legal advice or
              file IP on the user's behalf.
            </p>
            <p className="text-gray-700 mb-4">
              We also enable RTTP (Registered Technology Transfer Professionals) to list themselves
              as domain experts for potential collaborations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Use of Artificial Intelligence and Third-Party APIs
            </h2>
            <p className="text-gray-700 mb-4">
              Assesme integrates with OpenAI's API to deliver natural language outputs based on
              user-provided technical descriptions and data inputs. By using our platform, you
              acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                Your inputs and outputs may be processed via OpenAI servers, governed by OpenAI's
                Privacy and Terms.
              </li>
              <li>The content generated is predictive and should be reviewed critically.</li>
              <li>
                Assesme and OpenAI disclaim liability for any inaccuracies, legal claims, or
                commercialization outcomes resulting from reliance on the AI-generated reports.
              </li>
              <li>
                Users must not input sensitive or confidential information unless they understand
                the data may be transmitted to third-party processors.
              </li>
              <li>
                Users are solely responsible for vetting the outputs before using them for funding,
                publication, or filing purposes.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Token System and Payment Terms</h2>
            <p className="text-gray-700 mb-4">Assesme offers a token-based model:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                Users may purchase token packages (e.g., INR 2500 for 8000 tokens, INR 7500 for
                24000 tokens).
              </li>
              <li>
                Tokens are used to generate reports. Each report format consumes a different number
                of tokens (Basic: 2500, Advanced: 7500, Comprehensive: 9000).
              </li>
              <li>Tokens are non-refundable once consumed.</li>
              <li>Tokens expire 12 months from the purchase date.</li>
              <li>Token purchases are subject to local taxes and payment gateway fees.</li>
              <li>
                Payments are processed securely through Razorpay, Stripe, or other PCI-compliant
                platforms. Assesme does not store payment card information.
              </li>
              <li>
                Unauthorized use of purchased tokens or reselling of services is prohibited and may
                result in account termination.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Intellectual Property and Ownership
            </h2>
            <p className="text-gray-700 mb-4">
              All platform content, design elements, software, and generated report frameworks are
              the intellectual property of Vastav Intellect IP Solutions LLP. You retain ownership of
              the content you upload but grant us a limited license to use it for report generation
              and service improvement.
            </p>
            <p className="text-gray-700 mb-4">
              The generated reports are provided under a limited, non-exclusive, non-transferable
              license. You may use these for internal research, investor sharing, or commercial
              planning, but may not resell, redistribute, or modify the platform content or
              AI-generated reports for resale without written permission.
            </p>
            <p className="text-gray-700 mb-4">
              We make no claims on patents or inventions disclosed within your reports. Users are
              solely responsible for ensuring non-disclosure or filing protections before using the
              platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Data Privacy and Confidentiality
            </h2>
            <p className="text-gray-700 mb-4">
              We take user privacy seriously. All data processed by Assesme is subject to our
              Privacy Policy. User data is stored securely on encrypted servers. While Assesme
              implements strong data protection practices, we cannot guarantee absolute security for
              any internet-transmitted data.
            </p>
            <p className="text-gray-700 mb-4">
              By using Assesme, you grant consent for the collection and processing of data for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Report generation via OpenAI APIs</li>
              <li>Usage analytics and platform optimization</li>
              <li>Compliance with regulatory and legal obligations</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Sensitive data (e.g., unpublished patents) should not be entered without precaution.
              We offer opt-out options for marketing communication and analytics tracking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Refund and Cancellation Policy
            </h2>
            <p className="text-gray-700 mb-4">
              All purchases of token packages are considered final. However, users may request
              cancellation or refund of unused tokens within 7 calendar days of purchase, subject to
              a 10% administrative fee.
            </p>
            <p className="text-gray-700 mb-4">Refunds are not available for:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Consumed tokens</li>
              <li>Reports already generated</li>
              <li>Discounted or promotional token packages</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Refunds (if eligible) will be processed via the original payment method within 7–14
              business days. Users must email support@assesme.com with the payment proof and reason
              for refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Platform Access and Account Responsibility
            </h2>
            <p className="text-gray-700 mb-4">
              Users are responsible for maintaining the confidentiality of their accounts,
              passwords, and report outputs. Assesme is not liable for unauthorized account access
              or any damages resulting from compromised credentials.
            </p>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate accounts involved in:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Misuse of tokens</li>
              <li>Reverse engineering of platform features</li>
              <li>Violation of applicable IP, data protection, or export laws</li>
              <li>Abusive or fraudulent activity</li>
            </ul>
            <p className="text-gray-700 mb-4">
              The platform may be unavailable during scheduled maintenance or system updates. We are
              not liable for downtime or data loss occurring during such updates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted under applicable laws, Assesme and its parent entity
              Vastav Intellect IP Solutions LLP shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of business opportunities, data, or IP claims</li>
              <li>
                Reliance on generated content leading to failed commercialization or funding outcomes
              </li>
              <li>Legal issues arising from third-party API use</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Total liability shall not exceed the amount paid by the user in the last 6 months.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by and construed in accordance with the laws of India.
              Disputes shall be subject to the exclusive jurisdiction of the courts of New Delhi,
              India. International users must ensure compliance with their local laws when using our
              services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Assesme – Powered by Vastav Intellect IP Solutions LLP<br />
                Email: support@assesme.com<br />
                Phone: +91-8743078668<br />
                Website: www.assesme.com
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}