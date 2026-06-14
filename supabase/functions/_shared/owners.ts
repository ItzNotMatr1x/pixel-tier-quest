export const OWNER_EMAILS = [
  "itznotmatrix@gmail.com",
  "shudhyatw@gmail.com",
];

export function isOwnerEmail(email: string | null | undefined): boolean {
  return !!email && OWNER_EMAILS.includes(email.toLowerCase());
}
