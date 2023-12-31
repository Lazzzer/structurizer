import { Icons } from "@/components/icons";

export type NavItem = {
  label: string;
  href: string;
  icon: keyof typeof Icons;
};

export type NavSectionItems = {
  label: string;
  icon: keyof typeof Icons;
  items: NavItem[];
};

export type StepType = {
  number: number;
  title: string;
};

export type UploadInfo = {
  isBulkProcess: boolean;
  successIds: string[];
};

export type Correction = {
  field: string;
  issue: string;
  description: string;
  suggestion: string;
};

export type AverageMonthlyExpensesResult = {
  month: number;
  average: number;
};

export type FormattedAverageMonthlyExpensesResult = {
  name: string;
  fullName: string;
  value: number;
};
