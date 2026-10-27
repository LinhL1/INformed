import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** True for same-origin app paths like "/modules". Rejects protocol-relative
 * ("//host") and backslash ("/\host") forms, which browsers can resolve to
 * another origin when handed to navigate(), plus any whitespace/backslash —
 * the URL parser strips tabs/newlines, so "/\t/host" would become "//host". */
export function isSafeInternalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !/[\s\\]/.test(path);
}
