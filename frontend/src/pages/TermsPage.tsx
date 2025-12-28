export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-background text-foreground rounded-xl shadow-lg">
      {/* Page Header */}
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        Terms of Service
      </h1>

      <p className="mb-6 text-muted-foreground text-sm text-center">
        Last updated: September 20, 2025
      </p>

      {/* Intro */}
      <p className="mb-6 leading-relaxed">
        Welcome to <span className="font-semibold">ChatPaat</span>. By accessing
        or using our services, you agree to comply with and be bound by the
        following terms and conditions. Please read them carefully.
      </p>

      {/* Terms List */}
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Acceptable Use</h2>
          <p className="leading-relaxed">
            You agree not to use ChatPaat for any unlawful, abusive, or harmful
            activities. This includes but is not limited to spreading malware,
            harassment, or violating applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. User Responsibility</h2>
          <p className="leading-relaxed">
            You are solely responsible for the content you create, share, or
            receive through ChatPaat. Ensure that your activities respect the
            rights and safety of others.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Service Modifications</h2>
          <p className="leading-relaxed">
            We reserve the right to modify, suspend, or discontinue any aspect
            of the service at any time without prior notice. We are not liable
            for any consequences arising from such changes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Termination</h2>
          <p className="leading-relaxed">
            Violation of these terms may result in immediate suspension or
            termination of your account. We reserve the right to enforce these
            measures at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Contact Us</h2>
          <p className="leading-relaxed">
            If you have questions or concerns about these Terms of Service,
            please contact us at{" "}
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
