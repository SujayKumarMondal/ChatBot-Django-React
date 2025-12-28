export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-background text-foreground rounded-xl shadow-lg">
      {/* Page Header */}
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        Privacy Policy
      </h1>

      <p className="mb-6 text-muted-foreground text-sm text-center">
        Last updated: September 20, 2025
      </p>

      {/* Intro */}
      <p className="mb-6 leading-relaxed">
        Your privacy is important to us. This Privacy Policy explains how{" "}
        <span className="font-semibold">ChatPaat</span> collects, uses, and
        safeguards your information when you use our services.
      </p>

      <div className="space-y-6">
        {/* Section 1 */}
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
          <p className="leading-relaxed mb-2">
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span className="font-medium">Personal Information:</span> Details
              you provide when creating an account or interacting with ChatPaat
              (e.g., name, email).
            </li>
            <li>
              <span className="font-medium">Usage Data:</span> Information about
              your activity, interactions, and device information to help us
              improve the service.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To operate, maintain, and enhance ChatPaat.</li>
            <li>To provide customer support and respond to inquiries.</li>
            <li>To monitor service usage and prevent misuse.</li>
            <li>
              We will <span className="font-semibold">never sell</span> your
              personal information to third parties.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-lg font-semibold mb-2">3. Data Protection</h2>
          <p className="leading-relaxed mb-2">
            We implement appropriate technical and organizational measures to
            protect your data, including:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Encryption and secure data transmission methods.</li>
            <li>
              Restricted access to personal data by authorized personnel only.
            </li>
            <li>Regular monitoring for potential vulnerabilities.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-lg font-semibold mb-2">4. Your Rights</h2>
          <p className="leading-relaxed mb-2">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, update, or delete your personal information.</li>
            <li>Request a copy of the data we hold about you.</li>
            <li>Withdraw consent for data collection and processing.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-lg font-semibold mb-2">5. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions or concerns regarding this Privacy Policy,
            please reach out to us at{" "}
            <a
              href="mailto:support@chatpaat.com"
              className="text-primary font-medium hover:underline"
            >
              support@chatpaat.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
