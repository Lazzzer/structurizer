import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 2) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];

  let i = 0;
  while (bytes > 1024) {
    bytes /= 1024;
    i++;
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

export function stringifyWithBigInt(value: string) {
  return JSON.stringify(value, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

export const log = {
  info: createLogFn("info"),
  debug: createLogFn("debug"),
  warn: createLogFn("warn"),
  error: createLogFn("error"),
};

function createLogFn(level: "info" | "debug" | "warn" | "error") {
  return function (module: string, ...args: any[]) {
    const isoTime = new Date(Date.now()).toISOString();
    const text = [
      `[Next] ${process.env.PORT} -`,
      isoTime,
      `- ${level.toUpperCase()}\t[${module}]`,
      ...args,
      "\x1b[0m",
    ];

    let color = "";
    switch (level) {
      case "info":
        color = "\x1b[32m"; // Green
        break;
      case "debug":
        color = "\x1b[35m"; // Purple
        break;
      case "warn":
        color = "\x1b[33m"; // Yellow
        break;
      case "error":
        color = "\x1b[31m"; // Red
        break;
    }

    if (level === "debug" && process.env.NODE_ENV !== "development") {
      return;
    }

    console[level](color, ...text);
  };
}
