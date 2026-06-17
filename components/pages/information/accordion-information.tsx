"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/markdown-renderer";

interface InformationFAQ {
  id: number;
  title: string;
  subtitle: string;
  subtitle_highlight: string;
  content: string;
}

interface AccordionProps {
  faq: InformationFAQ;
  isOpen: boolean;
  onClick: () => void;
  maxWidthContent?: string;
}

export default function AccordionInformation({
  faq,
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
    <>
      <div className="py-4.5 lg:py-7 first:border-t border-[#909090]">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={onClick}
        >
          <h3 className="text-2xl pr-2 font-semibold">{faq.title}</h3>
          <div
            ref={arrowRef}
            className={`plusminus shrink-0 ${isOpen ? "active" : ""}`}
          ></div>
        </div>

        {/* 1. Outer Wrapper: Fokus untuk animasi height & opacity oleh GSAP */}
        <div
          ref={contentRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          {/* 2. Inner Wrapper: Layout grid dan jarak aman menggunakan padding-top (pt-15) statis */}
          <div className="grid lg:grid-cols-2 space-y-4.5 items-start pt-15 lg:pt-15">
            <div className="">
              <h4 className="font-bold text-4xl lg:text-5xl text-foreground whitespace-pre-wrap leading-12">
                {faq.subtitle} <br />
                <span className="text-[#8C8C8C]">{faq.subtitle_highlight}</span>
              </h4>
            </div>
            <div
              className={cn(
                "space-y-4.5 text-[#9C9C9C] text-base max-w-xl",
                maxWidthContent,
              )}
            >
              <MarkdownRenderer content={faq.content} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[#909090]"></div>
    </>
  );
}
