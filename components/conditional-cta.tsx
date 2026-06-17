"use client";

import { usePathname } from "next/navigation";
import CTAStartProject from "@/components/pages/home/cta-start-project";

export default function ConditionalCTA() {
  const pathname = usePathname();

  if (pathname === "/form") {
    return null;
  }

  return <CTAStartProject />;
}
