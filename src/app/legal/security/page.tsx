"use client";

import LegalDoc from "@/components/LegalDoc";

export default function SecurityPage() {
  return (
    <LegalDoc
      title="Security & Trust"
      updated="1 August 2026"
      intro={'Trust is the foundation of Akazi Hub. We protect the credentials and personal data of every stakeholder — clients, workers, and partners — and follow recognised security practices aligned with universal standards such as OWASP and the GDPR. This page explains what we do and what we expect from you.'}
      sections={[
        {
          heading: "1. Credential protection",
          body: "Passwords are never stored in plain text. Login is protected by one-time passwords (OTP) that are hashed and time-limited. NID numbers are encrypted at rest and used only for verification. Mobile-money numbers and transaction references are stored with the minimum access necessary and are never displayed on public profiles.",
        },
        {
          heading: "2. Transport and storage security",
          body: "All traffic is encrypted in transit using TLS 1.2 or higher. Sensitive data is encrypted at rest. Access to production data is limited to authorised staff through least-privilege accounts, and all access is logged and reviewed.",
        },
        {
          heading: "3. Safe payments",
          body: "Deposits are collected through licensed mobile-money providers. We never ask you to share your MoMo PIN, password, or full card details through the app. Payment confirmation happens through official USSD prompts or in-app approval only.",
        },
        {
          heading: "4. What we do not ask for",
          body: "Akazi Hub staff will never ask for your OTP, MoMo PIN, or password. Anyone doing so is an impostor. If in doubt, contact legal@akazihub.rw before responding.",
        },
        {
          heading: "5. Your role",
          body: "Keep your phone and SIM safe, never share OTP codes, use a device PIN, and report suspicious messages claiming to be from Akazi Hub. When hiring, verify the worker's identity and NID status before sharing access to your home.",
        },
        {
          heading: "6. Responsible disclosure",
          body: "We take security seriously. If you discover a vulnerability, please report it privately to legal@akazihub.rw with details and steps to reproduce. We investigate all reports and will never penalise good-faith researchers.",
        },
        {
          heading: "7. Continuous improvement",
          body: "Our security controls are reviewed regularly against evolving threats and legal requirements. Material improvements and policy changes are communicated through the app.",
        },
      ]}
    />
  );
}
