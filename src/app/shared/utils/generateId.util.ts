export function generateId(): string {
  const timestamp = new Date().getTime().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return timestamp + randomPart;
}
