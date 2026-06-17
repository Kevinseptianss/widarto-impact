"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState(children);
  const firstLoad = useRef(true);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // First load (no animation)
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    const tl = gsap.timeline();

    // EXIT
    tl.to(container, {
      y: 60,
      autoAlpha: 0,
      filter: "blur(8px)",
      duration: 0.35,
      ease: "power2.inOut",
    })

      // Swap content
      .add(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
        setContent(children);
      })

      // ENTER
      .fromTo(
        container,
        {
          y: 60,
          autoAlpha: 0,
          filter: "blur(8px)",
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "power3.out",
          clearProps: "all",
        },
      );
  }, [children, pathname]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        willChange: "transform, opacity, filter",
      }}
    >
      <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
    </div>
  );
}
