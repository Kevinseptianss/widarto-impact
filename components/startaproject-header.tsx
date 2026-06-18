"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLink } from "@/config/navigation";

export default function StartAProjectHeader() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center">
      <div className="flex-between main-padding w-full h-full gap-3">
        <Link href="/" aria-label="Widarto Impact home" className="shrink-0">
          <div className="relative z-50 overflow-hidden w-[160px] sm:w-[207px] lg:w-[276px] h-[20px] sm:h-[24px]">
            <Image
              src="/logo/widarto-impact-logo.svg"
              alt="Widarto Impact"
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 207px, 276px"
              className="object-contain"
              priority
              fetchPriority="high"
              draggable={false}
            />
          </div>
        </Link>

        <div className="flex items-center gap-x-1.5 sm:gap-x-3 shrink-0">
          {navigationLink.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.ariaLabel || item.title}
            >
              <div
                className={`btn btn-hover max-sm:!px-3 max-sm:!py-2 max-sm:!text-[12px] ${
                  pathname === item.href ? "btn-active" : ""
                }`}
              >
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
