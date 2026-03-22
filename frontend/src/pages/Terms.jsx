import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Terms &amp; Conditions
          </h1>
          <p className="text-gray-600 mb-2">Effective Date: July 18, 2025</p>
          <p className="text-gray-600 mb-8">
            Platform Owner: Assesme (a product powered by Vastav Intellect IP
            Solutions LLP)
          </p>

          {/* 1. Acceptance of Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing or using the Assesme platform (
              <a href="https://www.assesme.com" className="text-blue-600">
                www.assesme.com
              </a>
              ), you agree to be legally bound by these Terms and Conditions,
              including our Privacy Policy and Refund &amp; Cancellation Policy.
              These terms govern all users, including individuals, institutions,
              professionals, and organizations using the platform to generate
              technology assessment reports.
            </p>
            <p className="text-gray-700 mb-4">
              If you do not agree with these Terms, do not access or use the
              platform. These Terms apply globally and override any local
              variations unless specifically stated. We reserve the right to
              update or modify these Terms at any time. Continued use after such
              changes signifies your acceptance of the revised terms.
            </p>
            <p className="text-gray-700">
              If you are using this platform on behalf of an institution,
              company, or organization, you confirm that you are authorized to
              bind such entity to these terms.
            </p>
          </section>

          {/* 2. Description of Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description of Services
            </h2>
            <p className="text-gray-700 mb-4">
              Assesme is an AI-powered web platform designed to generate
              structured, professional, and investor-oriented Technology
              Assessment Reports. It uses intelligent automation and integrates
              with multiple third-party services to analyze user inputs and
              produce customized outputs.
            </p>
            <p className="text-gray-700 mb-4">
              Services are available under different tiers—Basic, Advanced, and
              Comprehensive—each offering varying depths of analysis, IP
              insights, market data, and commercialization strategies. The
              platform operates on a token-based subscription system, with token
              usage tied to the chosen report tier.
            </p>
            <p className="text-gray-700">
              Features include report generation, PDF export, and optional
              expert consultation services. Assesme incorporates global
              frameworks (WIPO, OECD, NIH, etc.) but does not offer legal or IP
              filing services.
            </p>
          </section>

          {/* 3. Use of Artificial Intelligence and Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Use of Artificial Intelligence and Third-Party Services
            </h2>
            <p className="text-gray-700 mb-4">
              Assesme uses external AI technologies and third-party APIs to
              process data and generate assessment outputs. By using the
              platform, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                User inputs may be processed through third-party systems to
                produce results.
              </li>
              <li>
                Content generated is predictive in nature and should be
                critically evaluated before use.
              </li>
              <li>
                Assesme does not guarantee the accuracy, completeness, or
                fitness for any specific purpose of the generated reports.
              </li>
              <li>
                Sensitive or confidential information should only be submitted
                with due diligence, understanding the data may be processed
                externally.
              </li>
              <li>
                Users are fully responsible for reviewing and validating the
                content before relying on it for funding, publication, or
                business decisions.
              </li>
            </ul>
          </section>

          {/* 4. Token System and Payment Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Token System and Payment Terms
            </h2>
            <p className="text-gray-700 mb-4">
              Assesme operates on a token-based model:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Token packages can be purchased (e.g., INR 2500 for 8000 tokens,
                INR 7500 for 24000 tokens).
              </li>
              <li>
                Each report type consumes tokens (Basic: 2500, Advanced: 7500,
                Comprehensive: 9000).
              </li>
              <li>
                Tokens are non-refundable once consumed and expire 12 months
                from purchase.
              </li>
              <li>
                Payments are processed through secure, PCI-compliant gateways.
              </li>
              <li>Assesme does not store any credit/debit card data.</li>
              <li>
                Unauthorized resale or misuse of tokens is prohibited and may
                lead to account termination.
              </li>
            </ul>
          </section>

          {/* 5. Intellectual Property and Ownership */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Intellectual Property and Ownership
            </h2>
            <p className="text-gray-700 mb-4">
              All content, frameworks, tools, and designs on the Assesme
              platform are the intellectual property of Vastav Intellect IP
              Solutions LLP. While users retain ownership of their uploaded
              content, they grant Assesme a limited license to use it solely for
              report generation and service enhancement.
            </p>
            <p className="text-gray-700">
              Generated reports are provided under a limited, non-exclusive,
              non-transferable license. Users may use the reports internally or
              for presentations but may not resell, redistribute, or modify the
              core platform content.
            </p>
          </section>

          {/* 6. Data Privacy and Confidentiality */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Data Privacy and Confidentiality
            </h2>
            <p className="text-gray-700 mb-4">
              User data is managed in accordance with our Privacy Policy. All
              information is stored securely using encryption and
              industry-standard safeguards. While we maintain strong data
              protection practices, absolute security over internet-transmitted
              data cannot be guaranteed.
            </p>
            <p className="text-gray-700">
              By using Assesme, you consent to the collection and processing of
              your data for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Generating technology assessment reports</li>
              <li>Providing customer support and analytics</li>
              <li>Improving platform features and ensuring compliance</li>
            </ul>
          </section>

          {/* 7. Refund and Cancellation Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Refund and Cancellation Policy
            </h2>
            <p className="text-gray-700 mb-4">
              Token purchases are generally non-refundable. However, users may
              request a refund for unused tokens within 7 calendar days of
              purchase, subject to a 10% administrative fee.
            </p>
            <p className="text-gray-700 mb-4">
              Refunds will not be issued for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Consumed tokens</li>
              <li>Reports already generated</li>
              <li>Discounted or promotional token bundles</li>
            </ul>
            <p className="text-gray-700">
              To request a refund, email support@assesme.com with payment
              details and justification. Refunds (if eligible) are processed
              within 7–14 business days via the original payment method.
            </p>
          </section>

          {/* 8. Platform Access and User Responsibility */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Platform Access and User Responsibility
            </h2>
            <p className="text-gray-700 mb-4">
              Users are responsible for maintaining the security of their login
              credentials and for all activities under their account. Assesme is
              not responsible for unauthorized access due to compromised
              accounts.
            </p>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate accounts involved in:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Misuse of tokens or services</li>
              <li>Attempted reverse engineering of the platform</li>
              <li>Violations of IP, data, or export laws</li>
              <li>Fraudulent, unethical, or abusive conduct</li>
            </ul>
            <p className="text-gray-700">
              Occasional downtime may occur during maintenance or updates. We
              are not liable for temporary unavailability or data loss during
              such periods.
            </p>
          </section>

          {/* 9. Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              To the extent permitted by law, Assesme and its parent entity
              shall not be liable for indirect, incidental, or consequential
              damages, loss of data, revenue, or business opportunities,
              decisions based on AI-generated content, or legal or financial
              impact of third-party service processing.
            </p>
            <p className="text-gray-700">
              Our maximum liability shall not exceed the amount paid by the user
              in the preceding six (6) months.
            </p>
          </section>

          {/* 10. Governing Law and Jurisdiction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of India. All disputes shall
              be subject to the exclusive jurisdiction of the courts located in
              New Delhi, India. International users must ensure compliance with
              their local regulations when using our services.
            </p>
          </section>

          {/* 11. Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Contact Information
            </h2>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Assesme – Powered by Vastav Intellect IP Solutions LLP
                <br />
                Email: support@assesme.com
                <br />
                Phone: +91-9667576014
                <br />
                Website:{" "}
                <a href="https://www.assesme.com" className="text-blue-600">
                  www.assesme.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
