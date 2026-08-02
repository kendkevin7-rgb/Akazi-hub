/** Normalize a phone like "+250 733 777 671" or "0733777671" to "250733777671". */
export function toE164Digits(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "250" + digits.slice(1);
  return digits;
}

export function whatsappLink(phone: string): string {
  return `https://wa.me/${toE164Digits(phone)}`;
}

export function telLink(phone: string): string {
  const digits = toE164Digits(phone);
  return `tel:+${digits}`;
}
