"use client";

import LegalDoc from "@/components/LegalDoc";

export default function PrivacyPolicyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="1 August 2026"
      intro={'Akazi Hub ("we", "us", "our") respects your privacy. This policy explains what personal data we collect, why we collect it, how we protect it, and the rights you hold under applicable data protection law (including Rwanda\'s Data Protection and Privacy Law of 2021 and the EU General Data Protection Regulation, GDPR).'}
      sections={[
        {
          heading: "1. What we collect",
          body: "Account data: full name, phone number, city, neighborhood. Worker data: National ID (NID) number for identity verification, skills, rate, and mobile-money payout number. Booking data: task descriptions, scheduled dates and times, and payment references. Device data: language preference and basic usage analytics to improve the service.",
        },
        {
          heading: "2. Legal basis and purpose",
          body: "We process personal data only where we have a lawful basis: your consent, performance of a contract (e.g. a booking you make), a legal obligation, or legitimate interest. Data is collected for clearly defined purposes: verifying identity, matching clients and workers, processing deposits, and safeguarding the platform.",
        },
        {
          heading: "3. Data minimisation and retention",
          body: "We collect only the minimum data needed to provide the service. Account and booking data is kept for as long as your account is active, plus a reasonable period required by law. NID data is used solely for verification and is not exposed on any public profile. You may request deletion of your data at any time.",
        },
        {
          heading: "4. How we protect your data",
          body: "We protect credentials and personal data using encryption in transit (TLS 1.2+), encryption at rest for sensitive identifiers, one-time-passwords hashed before storage, least-privilege access controls, and regular security reviews. Mobile-money and payment tokens are never logged in plain text. Our security practices are described in our Security & Trust page.",
        },
        {
          heading: "5. Sharing and third parties",
          body: "We never sell your personal data. We share data only with: identity verification providers (for NID checks), mobile-money processors (MTN MoMo / Airtel Money) to complete payments, and law enforcement where legally required. Each processor is bound by contract to protect your data and use it only for the agreed purpose.",
        },
        {
          heading: "6. Your rights",
          body: "You have the right to access, correct, or delete your personal data; to object to or restrict processing; to data portability; and to withdraw consent at any time. To exercise any right, contact legal@akazihub.rw. You may also lodge a complaint with the relevant data-protection authority.",
        },
        {
          heading: "7. Cookies and local storage",
          body: "This app stores your language preference in your browser's local storage. We do not use advertising trackers. Where analytics are used in production, they are aggregated and anonymised.",
        },
        {
          heading: "8. Changes to this policy",
          body: "We may update this policy as our service or the law evolves. Material changes will be announced in the app. Continued use of Akazi Hub after changes take effect constitutes acceptance of the updated policy.",
        },
      ]}
    />
  );
}
