// Rwanda's 16-digit National ID (NIN) structure (public knowledge):
//   digit  1   : holder status   (1 = citizen, 2 = refugee)
//   digits 2-5 : birth year      (19xx or 20xx)
//   digit  6   : gender          (7 = female, 8 = male)
//   digits 7-13: birth-order serial
//   digit  14  : card issue count (0 = first issue)
//   digits 15-16: checksum      (algorithm is SECRET to NIDA; not validateable here)
//
// So the strongest offline check is structural. True identity confirmation still
// requires a NIDA e-verification agreement and is done by manual admin review today.

export const RWANDA_NID_PATTERN = /^[12](19|20)\d{2}[78]\d{10}$/;

export function isValidRwandaNid(nid: string): boolean {
  return RWANDA_NID_PATTERN.test(nid);
}
