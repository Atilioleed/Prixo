import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tu panel",
  robots: { index: false, follow: false },
};

export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
