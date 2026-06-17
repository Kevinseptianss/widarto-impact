"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "./markdown-renderer";

interface AccordionProps {
  title: string;
  subtitle?: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
  maxWidthContent?: string;
}

export default function Accordion({
  title,
  subtitle,
  content,
  isOpen,
  onClick,
  maxWidthContent,
}: AccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !arrowRef.current) return;

    if (isOpen) {
      gsap.to(contentRef.current, {
        height: contentRef.current.scrollHeight,
        opacity: 1,
        duration: 0.5,
        ease: "power3.inOut",
        clearProps: "height",
      });

      gsap.to(arrowRef.current, {
        rotate: 180,
        duration: 0.4,
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.4,
      });

      gsap.to(arrowRef.current, {
        rotate: 0,
        duration: 0.4,
      });
    }
  }, [isOpen]);

  return (
    // HAPUS first:border-t di sini, cukup border-b saja
    <div className="flex flex-col border-b border-[#909090]">
      <div className="py-4.5 lg:py-4.5">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={onClick}
        >
          <div className="space-y-1">
            <h3 className="text-2xl pr-2">{title}</h3>
            {subtitle && <p className="text-[#8C8C8C]">{subtitle}</p>}
          </div>
          <div
            ref={arrowRef}
            className={`plusminus shrink-0 ${isOpen ? "active" : ""}`}
          ></div>
        </div>

        {/* Outer GSAP Wrapper */}
        <div
          ref={contentRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div
            className={cn(
              "pt-3 space-y-4.5 text-foreground text-lg",
              maxWidthContent,
            )}
          >
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
