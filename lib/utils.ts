import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 2) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];

  let i = 0;

  for (i; bytes > 1024; i++) {
    bytes /= 1024;
  }

  return parseFloat(bytes.toFixed(decimals)) + " " + units[i];
}

export function getMonthNames(number: number) {
  const date = new Date();
  date.setMonth(number - 1);

  const shortName = date.toLocaleString("en-GB", { month: "short" });
  const longName = date.toLocaleString("en-GB", { month: "long" });

  return {
    shortName,
    longName,
  };
}

export function mapCurrency(currency: string) {
  switch (currency) {
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "CNY":
      return "¥";
    case "KRW":
      return "₩";
    default:
      return currency;
  }
}

export async function minDelay<T>(promise: Promise<T>, ms: number) {
  let [p] = await Promise.all([
    promise,
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ]);

  return p;
}
