"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function BrandMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wrappers = container.querySelectorAll(".marquee-item-wrapper");
    if (wrappers.length === 0) return;

    // Bersihkan animasi lama jika ada
    gsap.killTweensOf(wrappers);

    const tl = gsap.to(wrappers, {
      xPercent: -100,
      duration: 30, // Sesuaikan kecepatan brand logo
      ease: "none",
      repeat: -1,
      force3D: true,
      paused: true, // Mulai dalam keadaan pause
    });

    // Intersection Observer untuk mempause animasi saat tidak terlihat
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tl.play();
          } else {
            tl.pause();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(container);

    const handleMouseEnter = () => {
      gsap.to(tl, { timeScale: 0.2, duration: 0.8 });
    };

    const handleMouseLeave = () => {
      gsap.to(tl, { timeScale: 1, duration: 0.8 });
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      tl.kill();
      observer.disconnect();
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="mt-18 lg:mt-48">
      <div>
        <h2 className="text-4xl font-minion mt-5.5 lg:max-w-[551px]">
          Featured in
        </h2>
      </div>

      <section
        id="brand-work"
        className="marquee-container mt-9 lg:mt-9"
        ref={containerRef}
      >
        <div className="marquee-content">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="marquee-item-wrapper shrink-0">
              <div className="item">
                <Image
                  src="/logo/dieline-logo.svg"
                  alt="Dieline logo"
                  width={220}
                  height={80}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="item">
                <Image
                  src="/logo/print-magazine-logo.svg"
                  alt="Print Magazine logo"
                  width={220}
                  height={80}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="item">
                <Image
                  src="/logo/pentawards-logo.svg"
                  alt="Pentawards logo"
                  width={220}
                  height={80}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="item">
                <Image
                  src="/logo/mark2025-logo.webp"
                  alt="Mark2025 logo"
                  width={220}
                  height={80}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="item">
                <Image
                  src="/logo/potw-logo.webp"
                  alt="Potw logo"
                  width={220}
                  height={80}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="item">
                <Image
                  src="/logo/world-brand-design-logo.webp"
                  alt="World Brand Design logo"
                  width={220}
                  height={80}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

export default BrandMarquee;
