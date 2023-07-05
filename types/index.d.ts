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

export type UploadInfo = {
  nbFiles: number;
  success: [string, string][]; // [filename, uuid][]
};
