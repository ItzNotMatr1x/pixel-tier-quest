export const OWNER_EMAILS = [
  "itznotmatrix@gmail.com",
  "powerforge62@gmail.com",
];

export function isOwnerEmail(email: string | null | undefined): boolean {
  return !!email && OWNER_EMAILS.includes(email.toLowerCase());
}
