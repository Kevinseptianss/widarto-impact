"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { navigationLink, socialMedia } from "../config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement[]>([]);
  const [isAtTop, setIsAtTop] = useState(true);
  const logoFullRef = useRef<HTMLImageElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  const tl = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    if (!logoFullRef.current) return;

    if (!isAtTop) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      gsap.to(logoFullRef.current, {
        clipPath: isSafari ? "inset(0 86% 0 0)" : "inset(0 88% 0 0)",
        duration: 1,
        ease: "power3.inOut",
      });
    } else {
      gsap.to(logoFullRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1,
        ease: "power3.inOut",
      });
    }
  }, [isAtTop]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 10) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });

    tl.current
      // rotate 1x
      .to(buttonRef.current, {
        rotation: 360,
        duration: 0.6,
        ease: "power2.inOut",
      })

      // morph to X
      .to(
        spanRef.current[0],
        {
          y: 6,
          rotation: 45,
          duration: 0.3,
        },
        "-=0.2",
      )
      .to(
        spanRef.current[1],
        {
          opacity: 0,
          duration: 0.2,
        },
        "<",
      )
      .to(
        spanRef.current[2],
        {
          y: -6,
          rotation: -45,
          duration: 0.3,
        },
        "<",
      )

      // drawer slide
      .to(
        drawerRef.current,
        {
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.3",
      );
  }, []);

  const toggleMenu = () => {
    if (!open) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
    setOpen(!open);
  };

  if (pathname === "/startaproject") {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-center">
        <div
          className={`transition-all duration-500 ease-in-out flex-between main-padding h-full 
      ${
        isAtTop
          ? "w-full bg-transparent"
          : "w-[calc(100%-2rem)] max-w-[40ch] md:max-w-none md:w-[clamp(64ch,70%,96ch)] max-h-[58px] translate-y-4 mx-4 px-6! p-3! rounded-full bg-[#252525D1] glass header"
      }
    `}
        >
          <Link href="/" aria-label="Widarto Impact Logo">
            <div className="relative z-50 overflow-hidden w-[207px] lg:w-[276px] h-[24px]">
              {/* Logo Full */}
              <Image
                ref={logoFullRef}
                src="/logo/widarto-impact-logo.svg"
                alt="Widarto Impact"
                onClick={open ? toggleMenu : undefined}
                fill
                sizes="(max-width: 1024px) 207px, 276px"
                className="object-contain"
                priority
                fetchPriority="high"
                draggable={false}
              />

              {/* Block Mask */}
              <div
                ref={maskRef}
                className="object-contain"
                style={{ clipPath: "inset(0 0% 0 0)" }}
              />
            </div>
          </Link>
          <div
            id="hamburger-button"
            className={"z-50 lg:hidden"}
            ref={buttonRef}
            onClick={toggleMenu}
          >
            <span
              ref={(el) => {
                if (el) spanRef.current[0] = el;
              }}
            ></span>
            <span
              ref={(el) => {
                if (el) spanRef.current[1] = el;
              }}
            ></span>
            <span
              ref={(el) => {
                if (el) spanRef.current[2] = el;
              }}
            ></span>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-x-3">
            {navigationLink.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className=""
                aria-label={item.ariaLabel || item.title}
              >
                <div
                  className={`btn btn-hover ${pathname === item.href ? "btn-active" : ""}`}
                >
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div
        ref={drawerRef}
        className="fixed top-0 left-0 w-full h-screen bg-background text-foreground flex flex-col items-start justify-center main-padding z-30"
        style={{ transform: "translateY(-100%)" }}
      >
        <div aria-hidden="true" />
        <ul className="space-y-3 mt-[90px]">
          {navigationLink.map((item, index) => (
            <li key={index}>
              <Link
                onClick={toggleMenu}
                href={item.href}
                className="text-5xl font-medium"
                aria-label={item.ariaLabel || item.title}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        {/* Footer Drawer */}
        <div className="mt-auto w-full">
          <Link
            href="/"
            aria-label="Widarto Impact Logo"
            className="w-full"
            onClick={toggleMenu}
          >
            <Image
              src="/logo/widarto-impact-logo.svg"
              alt="widarto impact logo"
              width={100}
              height={31}
              className="w-full"
              draggable={false}
              priority
            />
          </Link>

          <ul className="flex gap-x-3.5 mt-[36px]">
            {socialMedia.map((item, index) => (
              <li key={index}>
                <Link
                  aria-label={`Widarto Impact on ${item.title}`}
                  href={item.href}
                  className="text-base"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
