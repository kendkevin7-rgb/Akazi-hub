import "server-only";

const AT_SANDBOX_URL = "https://api.sandbox.africastalking.com/version1/messaging";
const AT_LIVE_URL = "https://api.africastalking.com/version1/messaging";

// Use the live API in production, sandbox everywhere else.
const AT_API_URL =
  process.env.OTP_PROVIDER_ENVIRONMENT === "production" ? AT_LIVE_URL : AT_SANDBOX_URL;

interface SendSmsResult {
  sent: boolean;
  provider: "africastalking" | "dev";
}

export async function sendOtpSms(phoneE164: string, code: string): Promise<SendSmsResult> {
  const apiKey = process.env.OTP_PROVIDER_API_KEY;
  const senderId = process.env.OTP_PROVIDER_SENDER_ID || "AkaziHub";
  const username = process.env.OTP_PROVIDER_USERNAME || "sandbox";

  // No provider configured yet — log the code for local development.
  if (!apiKey) {
    console.log(`[OTP dev] ${phoneE164} -> code ${code}`);
    return { sent: false, provider: "dev" };
  }

  const message = `Akazi Hub code: ${code}. It expires in 10 minutes. Never share it.`;
  const form = new URLSearchParams({
    username,
    to: phoneE164,
    message,
    from: senderId,
  });

  const res = await fetch(AT_API_URL, {
    method: "POST",
    headers: {
      apiKey,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[OTP] Africa's Talking SMS failed (${res.status}): ${text.slice(0, 300)}`);
    return { sent: false, provider: "africastalking" };
  }

  return { sent: true, provider: "africastalking" };
}
