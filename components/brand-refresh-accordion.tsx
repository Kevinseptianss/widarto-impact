"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ArrowDown } from "@/config/icons"; // Pastikan path ini sesuai
import MarkdownRenderer from "./markdown-renderer";
import { GlassButton } from "./ui/glass-button";
import ProgramForm from "./program-form";

// Sub-komponen untuk menangani animasi GSAP di masing-masing item
type Program = {
  question: string;
  description: string;
  answer: string;
  button_identification:
    | "brand-refresh"
    | "brand-audit"
    | "brand-creation"
    | "scale-up"
    | "turnaround";
};
type Props = {
  program: Program;
  isOpen: boolean;
  hideBorderBottom: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  onButtonClick: () => void;
};

function AccordionItem({
  program,
  isOpen,
  hideBorderBottom,
  onMouseEnter,
  onClick,
  onButtonClick,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const desktopArrowRef = useRef<HTMLDivElement>(null);

  const buttonRef = useRef<HTMLDivElement>(null);
  const buttonInnerRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const canHoverRef = useRef(false);

  useEffect(() => {
    if (!contentRef.current || !innerContentRef.current) return;

    // 1. Matikan semua animasi yang sedang berjalan agar tidak ada bentrok (flicker)
    gsap.killTweensOf(contentRef.current);
    gsap.killTweensOf(innerContentRef.current);
    if (arrowRef.current) gsap.killTweensOf(arrowRef.current);
    if (desktopArrowRef.current) gsap.killTweensOf(desktopArrowRef.current);

    if (isOpen) {
      gsap.set(innerContentRef.current, {
        opacity: 0,
        visibility: "visible",
        display: "block",
      });

      gsap.to(contentRef.current, {
        height: contentRef.current.scrollHeight,
        duration: 0.01,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(contentRef.current, { height: "auto" });
        },
      });

      // Animasi Konten di dalam (Fade In)
      gsap.to(innerContentRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });

      // Animasi Panah
      if (arrowRef.current)
        gsap.to(arrowRef.current, {
          rotate: 0,
          duration: 0.5,
          ease: "expo.out",
        });
      if (desktopArrowRef.current)
        gsap.to(desktopArrowRef.current, {
          rotate: 90,
          duration: 0.5,
          ease: "expo.out",
        });
    } else {
      // --- TUTUP ACCORDION ---

      const currentHeight = contentRef.current.scrollHeight;
      gsap.set(contentRef.current, { height: currentHeight });

      // Hilangkan konten seketika! (Langsung sembunyikan)
      gsap.set(innerContentRef.current, {
        opacity: 0,
        visibility: "hidden", // Sembunyikan seketika agar tidak berkedip
        display: "none",
      });

      // Animasi Wadah (Height) menutup
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.5,
        ease: "expo.inOut",
      });

      // Animasi Panah
      if (arrowRef.current)
        gsap.to(arrowRef.current, {
          rotate: 180,
          duration: 0.5,
          ease: "expo.inOut",
        });
      if (desktopArrowRef.current)
        gsap.to(desktopArrowRef.current, {
          rotate: 0,
          duration: 0.5,
          ease: "expo.inOut",
        });
    }
  }, [isOpen]);

  useEffect(() => {
    canHoverRef.current = window.matchMedia("(hover: hover)").matches;
  }, []);

  const handleEnter = () => {
    if (!arrowRef.current || !textRef.current || !buttonInnerRef.current)
      return;
    if (!canHoverRef.current) return;

    gsap.killTweensOf([
      arrowRef.current,
      textRef.current,
      buttonInnerRef.current,
    ]);

    gsap.to(buttonInnerRef.current, {
      paddingLeft: "38px",
      paddingRight: "32px",
      duration: 0.3,
      ease: "power2.out",
      backgroundColor: "#ECFD01",
      overwrite: "auto",
    });

    gsap.to(textRef.current, {
      x: -16,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.fromTo(
      arrowRef.current,
      { x: 20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  };

  const handleLeave = () => {
    if (!arrowRef.current || !textRef.current || !buttonInnerRef.current)
      return;
    if (!canHoverRef.current) return;

    gsap.killTweensOf([
      arrowRef.current,
      textRef.current,
      buttonInnerRef.current,
    ]);

    gsap.to(buttonInnerRef.current, {
      paddingLeft: "18px",
      paddingRight: "18px",
      duration: 0.4,
      ease: "power2.out",
      backgroundColor: "#ECFD01CC",
      overwrite: "auto",
    });

    gsap.to(textRef.current, {
      x: 0,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(arrowRef.current, {
      x: 20,
      opacity: -10,
      duration: 0.15,
      ease: "power2.in",
      overwrite: "auto",
    });
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      className={`group transition-all duration-300 ease-in-out border-b hover:border-transparent hover:bg-[#E9E9E9] hover:rounded-[16px] hover:text-[#121212] ${
        isOpen
          ? "py-[28px] rounded-[16px] bg-[#E9E9E9] lg:mt-0 border-transparent"
          : `py-4.5 lg:py-7 ${
              hideBorderBottom ? "border-transparent" : "border-[#909090]"
            }`
      }`}
    >
      <div
        className="cursor-pointer lg:grid lg:grid-cols-[450px_1fr] lg:gap-x-4.5 lg:items-start"
        onClick={onClick}
      >
        <div className="flex justify-between items-center lg:block">
          <h3
            className={`text-2xl transition-all duration-300 font-semibold ${
              isOpen ? "text-[#121212] px-[18px]" : "px-0 group-hover:px-[18px]"
            }`}
          >
            {program.question}
          </h3>

          <div className={`lg:hidden ${isOpen ? "block pr-[18px]" : "hidden"}`}>
            <div ref={arrowRef}>
              <ArrowDown />
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between items-start">
          <div
            className={`w-full transition-all duration-300 ${isOpen ? "px-[18px] lg:px-0" : "px-0"}`}
          >
            <p
              className={`text-base transition-all duration-300 group-hover:px-[18px] lg:group-hover:px-0 ${isOpen ? "hidden" : "block mt-1"}`}
            >
              {program.description}
            </p>

            <div
              ref={contentRef}
              className="overflow-hidden"
              style={{ height: 0 }}
            >
              <div
                ref={innerContentRef}
                style={{ opacity: 0 }}
                className="w-full space-y-4.5 text-[#121212] mt-4.5 lg:mt-0"
              >
                <MarkdownRenderer content={program.answer} />
                <button
                  ref={buttonInnerRef}
                  className="relative glass overflow-hidden font-graphik bg-[#ECFD01CC] border-[1px] border-[#121212] text-[#121212] px-4.5 py-2 rounded-full flex items-center cursor-pointer max-h-9.5"
                  onMouseEnter={handleEnter}
                  onMouseLeave={handleLeave}
                  onClick={(e) => {
                    e.stopPropagation();
                    onButtonClick();
                  }}
                >
                  <span ref={textRef} className="font-semibold">
                    {program.button_identification === "brand-audit"
                      ? "Request Brand Audit"
                      : "Start a Project"}
                  </span>

                  <span ref={arrowRef} className="absolute right-4 opacity-0">
                    <ArrowDown className="rotate-270" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            className={`hidden lg:block transition-all duration-300 ml-4 pr-[18px] ${
              isOpen
                ? "opacity-100 translate-x-0 mt-1"
                : "opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0"
            }`}
          >
            <div ref={desktopArrowRef}>
              <ArrowDown className="rotate-270" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen Utama
export default function BrandAccordion({ programs }: { programs: Program[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setActiveIndex(0);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-9 lg:mt-9" onMouseLeave={() => setHoveredIndex(null)}>
      {programs.map((program, index) => {
        const isOpen = activeIndex === index;
        const nextIsActive = activeIndex === index + 1;
        const nextIsHovered = hoveredIndex === index + 1;
        const hideBorderBottom = nextIsActive || nextIsHovered;

        return (
          <AccordionItem
            key={index}
            program={program}
            isOpen={isOpen}
            hideBorderBottom={hideBorderBottom}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            onButtonClick={() =>
              setSelectedProgram(program.button_identification)
            }
          />
        );
      })}

      <ProgramForm
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        programType={selectedProgram}
      />
    </div>
  );
}
