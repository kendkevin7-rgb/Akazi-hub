"use client";

import LegalDoc from "@/components/LegalDoc";

export default function TermsOfServicePage() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="1 August 2026"
      intro={'These Terms of Service ("Terms") govern your use of the Akazi Hub platform and its mobile experience. By creating an account, registering as a worker, or booking a service, you agree to be bound by these Terms and by our Privacy Policy.'}
      sections={[
        {
          heading: "1. Eligibility",
          body: "You must be at least 18 years old to use Akazi Hub. You must provide accurate, current information and keep your account credentials confidential. You are responsible for all activity carried out under your account.",
        },
        {
          heading: "2. Accounts and credentials",
          body: "Access is protected by phone-number and one-time-password (OTP) authentication. Never share your OTP with anyone, including people claiming to be Akazi Hub staff. We will never ask you for your password or OTP. Report any suspected unauthorised access immediately via legal@akazihub.rw.",
        },
        {
          heading: "3. Worker registration and verification",
          body: "Workers agree to undergo National ID (NID) verification and to provide true information about their skills, experience, rates, and availability. Akazi Hub may reject, suspend, or remove any worker whose verification fails or who provides false information.",
        },
        {
          heading: "4. Bookings and deposits",
          body: "A booking is confirmed once a deposit is paid via mobile money. Deposits secure the worker's time and are credited against the final agreed price. Where a worker cancels, the deposit is refunded in full. Where a client cancels less than 24 hours before the scheduled visit, a reasonable fee may apply.",
        },
        {
          heading: "5. Payments",
          body: "Payments are processed through MTN MoMo or Airtel Money. Akazi Hub records a transaction reference for every payment. You authorise us to initiate payment requests on your behalf when you confirm a booking.",
        },
        {
          heading: "6. Acceptable use",
          body: "You agree not to use Akazi Hub for any unlawful purpose, to harass or misrepresent any person, to attempt to circumvent verification or payment processes, or to collect other users' data without consent. Workers may not solicit clients to pay outside the platform.",
        },
        {
          heading: "7. Our role and liability",
          body: "Akazi Hub is a connecting and verification platform. We verify identity and facilitate bookings and deposits. The service itself is delivered by independent workers, who remain responsible for the quality of their work. To the fullest extent permitted by law, our aggregate liability is limited to the amount of the deposits you have paid through the platform.",
        },
        {
          heading: "8. Disputes",
          body: "We provide a dispute-resolution process for bookings. Both parties are expected to resolve issues in good faith. Where a dispute cannot be resolved, it may be referred to mediation, and then to the competent courts of Rwanda.",
        },
        {
          heading: "9. Suspension and termination",
          body: "We may suspend or terminate accounts that violate these Terms, compromise platform security, or harm other users. You may delete your account at any time by contacting legal@akazihub.rw.",
        },
        {
          heading: "10. Governing law and changes",
          body: "These Terms are governed by the laws of the Republic of Rwanda. We may update these Terms from time to time; the latest version is always available at /legal/terms.",
        },
      ]}
    />
  );
}
