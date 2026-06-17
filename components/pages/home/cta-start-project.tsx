"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowDown } from "../../../config/icons";
import ChatFormModal from "../../chat-form-modal";
import { sendGAEvent } from "@next/third-parties/google";

function CTAStartProject() {
  const startProject = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const buttonInnerRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const canHoverRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      duration: 0.3,
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
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      overwrite: "auto",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!startProject.current || !buttonRef.current || !containerRef.current)
        return;

      const button = buttonRef.current;
      const section = startProject.current;
      const container = containerRef.current;

      const sectionRect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const buttonHeight = button.offsetHeight;

      // Posisi tombol saat fixed
      const fixedBottomOffset = 24;

      // Cek apakah tombol akan menyentuh section
      const shouldStop =
        sectionRect.top <=
        window.innerHeight - buttonHeight - fixedBottomOffset;

      if (shouldStop) {
        if (button.style.position !== "absolute") {
          const oldRect = button.getBoundingClientRect();

          button.style.position = "absolute";
          button.style.top = "auto";
          button.style.bottom = "0px";
          button.style.right = "-2px"; // Absolute mengacu pada parent 'startProject', "-8px" dipertahankan dari kodemu

          const newRect = button.getBoundingClientRect();

          gsap.set(button, {
            x: oldRect.left - newRect.left,
            y: oldRect.top - newRect.top,
          });

          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          });
        }
      } else {
        // Hitung jarak ujung kanan container ke ujung kanan area terlihat (tanpa scrollbar)
        const rightOffset =
          document.documentElement.clientWidth - containerRect.right - 2;

        if (button.style.position !== "fixed") {
          const oldRect = button.getBoundingClientRect();

          button.style.position = "fixed";
          button.style.bottom = "0px";
          // Gunakan rightOffset agar sejajar persis dengan batas kanan container
          button.style.right = `${rightOffset}px`;
          button.style.top = "auto";

          const newRect = button.getBoundingClientRect();

          gsap.set(button, {
            x: oldRect.left - newRect.left,
            y: oldRect.top - newRect.top,
          });

          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          });
        } else {
          // Jika posisinya sudah fixed tapi layar di-resize, pastikan right-nya tetap ter-update
          button.style.right = `${rightOffset}px`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // Tambahkan event resize agar responsif
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll); // Jangan lupa bersihkan listener
    };
  }, []);

  const handleButtonClick = () => {
    sendGAEvent({ event: "project_inquiry" });
    setOpen(true);
  };

  return (
    <>
      <ChatFormModal open={open} onClose={() => setOpen(false)} />
      <div ref={containerRef} className="">
        <div
          ref={startProject}
          className="flex items-end justify-end relative h-27.5 lg:h-32 mt-13.5"
        >
          <div ref={buttonRef} className="pb-4.5 main-padding fixed bottom-0 right-4.5 z-50 lg:right-8">
            <button
              ref={buttonInnerRef}
              className="relative glass overflow-hidden font-graphik bg-[#ECFD01CC] text-[#121212] px-4.5 py-2 rounded-full flex items-center cursor-pointer max-h-9.5"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              onClick={handleButtonClick}
              aria-expanded={open}
              aria-haspopup="dialog"
            >
              <span ref={textRef} className="font-semibold">
                Start a Project
              </span>

              <span ref={arrowRef} className="absolute right-4 opacity-0">
                <ArrowDown className="rotate-270" />
              </span>
            </button>
          </div>
        </div>
        <div className="border-b border-[#909090] mx-4.5"></div>
      </div>
    </>
  );
}

export default CTAStartProject;
