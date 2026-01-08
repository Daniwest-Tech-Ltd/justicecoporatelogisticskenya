import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-8">Privacy Policy</h1>
          
          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="font-heading text-xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Justice Corporate Logistics Kenya ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                use our car rental services and website.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">2. Information We Collect</h2>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Full name and contact details (email, phone number, address)</li>
                <li>National ID or passport number</li>
                <li>Driving license details</li>
                <li>Payment information</li>
                <li>Rental history and preferences</li>
              </ul>
              <h3 className="font-semibold mb-2">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>IP address and browser information</li>
                <li>Device information</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To process and manage your vehicle rentals</li>
                <li>To communicate with you about your bookings and services</li>
                <li>To process payments and refunds</li>
                <li>To verify your identity and driving eligibility</li>
                <li>To improve our services and customer experience</li>
                <li>To comply with legal and regulatory requirements</li>
                <li>To send promotional communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">4. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Insurance providers (for claims processing)</li>
                <li>Payment processors (for transaction processing)</li>
                <li>Law enforcement (when required by law)</li>
                <li>NTSA and other regulatory bodies (for compliance)</li>
                <li>Service providers who assist in our operations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under the Kenya Data Protection Act 2019, you have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                policy, unless a longer retention period is required by law. Rental records are kept for a minimum of 
                7 years for legal and regulatory compliance.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">8. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website uses cookies to enhance your browsing experience. You can control cookie preferences 
                through your browser settings. Essential cookies are required for the website to function properly.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
                personal information from children under 18.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us at:<br />
                Email: rentals@justicelogisticskenya.com<br />
                Phone: 0702575512<br />
                Location: Mpesi Lane 11, Westlands, Nairobi, Kenya
              </p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Last updated: January 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
