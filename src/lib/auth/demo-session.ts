export const ELMA_SESSION_COOKIE = "elma_session";

export function isActiveDemoSession(value: string | undefined): boolean {
  return value === "active";
}
