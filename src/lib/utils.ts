import {
  clsx,
  type ClassValue,
} from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(
  ...inputs: ClassValue[]
) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(
  address: string,
  charsStart = 4,
  charsEnd = 4
): string {
  if (
    !address ||
    address.length <
      charsStart + charsEnd
  ) {
    return address; // Возвращаем исходный адрес, если он слишком короткий
  }
  return `${address.slice(
    0,
    charsStart + 2
  )}...${address.slice(-charsEnd)}`;
}
