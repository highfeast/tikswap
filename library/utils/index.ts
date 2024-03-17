import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// a function to reduce the length of the users address
export function ellipsisAddress(address: string, length = 4) {
  return `${address.substring(0, 2 + length)}...${address.substring(
    address.length - length,
    address.length
  )}`;
}

export function satisfies(array: any[]) {
  return array.every(Boolean);
}

export function isEmpty(input: any): boolean {
  if (input === null || input === undefined) {
    return true;
  }

  if (typeof input === "object") {
    return Object.keys(input).length === 0;
  }

  if (Array.isArray(input)) {
    return input.length === 0;
  }

  return false;
}
