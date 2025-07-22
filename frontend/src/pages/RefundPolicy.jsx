import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Refund & Cancellation Policy
          </h1>

          <p>
            <strong>Effective Date:</strong> July 16, 2025
          </p>
          <p>
            <strong>Applicable To:</strong> All services and token-based
            products offered through Assesme.com, operated by Vastav Intellect
            IP Solutions LLP – Innovation & Technology Division.
          </p>

          <h2>1. Overview</h2>
          <p>
            At Assesme, we are committed to delivering reliable, accurate, and
            innovative digital experiences. This Refund & Cancellation Policy
            outlines the terms under which refunds, cancellations, or
            adjustments are issued for our AI-generated reports, token packages,
            and expert consultation services. By using our services, you agree
            to the terms outlined herein.
          </p>

          <h2>2. No Refund for Consumed Tokens</h2>
          <p>
            Once tokens have been utilized to generate a report, such tokens are
            deemed consumed and are non-refundable, irrespective of:
          </p>
          <ul>
            <li>User dissatisfaction</li>
            <li>Perceived inaccuracies in the output</li>
            <li>Change of intent</li>
          </ul>
          <p>Exceptions apply only in cases where:</p>
          <ul>
            <li>
              The system fails to deliver the report (e.g., broken download
              links, corrupt file output, timeout issues)
            </li>
            <li>A system error leads to incomplete or invalid content</li>
          </ul>
          <p>
            In such cases, users must notify support within 72 hours of the
            incident with proof (e.g., screenshots, download errors).
          </p>

          <h2>3. Token Package Validity</h2>
          <ul>
            <li>
              All purchased tokens are valid for a period of 12 months from the
              date of purchase.
            </li>
            <li>
              Tokens that remain unused after the 12-month period will expire
              automatically, and no refund or extension will be granted unless:
              <ul>
                <li>
                  A formal request is made citing medical, technical, or force
                  majeure circumstances
                </li>
                <li>The request is submitted before the expiration date</li>
              </ul>
            </li>
          </ul>
          <p>
            Extension or reinstatement of expired tokens is at the sole
            discretion of Assesme’s internal review team.
          </p>

          <h2>4. Refund for Unused Token Packages</h2>
          <p>
            A user may request a refund for token packages only if none of the
            tokens have been consumed.
          </p>
          <p>
            <strong>Eligibility Criteria:</strong>
          </p>
          <ul>
            <li>
              Refund request must be submitted within 7 calendar days from the
              date of purchase
            </li>
            <li>No token from the package must be used</li>
          </ul>
          <p>
            <strong>Refund Terms:</strong>
          </p>
          <ul>
            <li>A 10% administrative and processing fee will be deducted</li>
            <li>
              Refunds are processed within 7–10 business days to the original
              mode of payment upon approval
            </li>
            <li>
              Any transaction or payment gateway charges are non-refundable
            </li>
          </ul>

          <h2>5. Cancellation or Account Suspension by Assesme</h2>
          <p>
            Assesme reserves the right to suspend, block, or terminate any user
            account for violations including but not limited to:
          </p>
          <ul>
            <li>Misuse of the system or attempts to exploit token usage</li>
            <li>Use of scripts or bots to manipulate platform services</li>
            <li>Abuse, impersonation, or intellectual property infringement</li>
          </ul>
          <p>In such cases:</p>
          <ul>
            <li>
              Access to the platform may be revoked temporarily or permanently
            </li>
            <li>
              Any remaining unused tokens may be refunded after an internal
              compliance review
            </li>
            <li>
              Already generated reports will remain accessible unless their
              removal is necessitated by a policy breach
            </li>
          </ul>

          <h2>6. System Errors & Technical Failures</h2>
          <p>
            If due to a technical failure or server issue a report is not
            generated or is corrupted:
          </p>
          <ul>
            <li>
              Users will be entitled to a full token refund for that specific
              report generation
            </li>
            <li>
              Alternatively, users may opt to regenerate the report at no
              additional token cost
            </li>
            <li>
              If both regeneration and refund are not viable, manual
              intervention and support will be provided
            </li>
          </ul>

          <h2>7. Expert Review, RTTP & Add-on Services</h2>
          <p>For services involving human intervention, such as:</p>
          <ul>
            <li>
              RTTP (Registered Technology Transfer Professional) consultations
            </li>
            <li>Human expert report validation</li>
            <li>Legal/academic review</li>
            <li>Custom feature add-ons</li>
          </ul>
          <p>
            <strong>Refund Terms:</strong>
          </p>
          <ul>
            <li>
              Once services are rendered, they are strictly non-refundable
            </li>
            <li>For scheduled appointments (e.g., consultation calls):</li>
            <ul>
              <li>Cancellations must be made at least 24 hours in advance</li>
              <li>
                No refund will be granted for missed or last-minute
                cancellations
              </li>
            </ul>
          </ul>

          <h2>8. How to Submit a Refund or Cancellation Request</h2>
          <p>To initiate a request, kindly contact our support team with:</p>
          <ul>
            <li>Your full name and registered email ID</li>
            <li>Order/invoice number or token package details</li>
            <li>Reason for cancellation or refund</li>
            <li>Relevant screenshots or document proofs (if applicable)</li>
          </ul>
          <p>
            <strong>Support Contact:</strong>
          </p>
          <ul>
            <li>Email: support@assesme.com</li>
            <li>Phone/WhatsApp: +91-87430-78668</li>
            <li>
              Address: Vastav Intellect IP Solutions LLP – Innovation &
              Technology Division
            </li>
            <li>Website: www.assesme.com</li>
          </ul>

          <h2>9. Policy Updates</h2>
          <p>
            Assesme reserves the right to update or modify this policy at any
            time without prior notice. All changes will be reflected on this
            page with the updated effective date.
          </p>
          <p>
            We recommend users periodically review this policy to stay informed
            of their rights and obligations.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
