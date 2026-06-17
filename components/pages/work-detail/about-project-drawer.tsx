import { GlassButton } from "@/components/ui/glass-button";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import AboutProjectContent, { RichTextBlock } from "./about-project-content";
import {
  GlassSheet,
  GlassSheetContent,
  GlassSheetTitle,
} from "@/components/glass-sheet";
import { XIcon } from "@/config/icons";
import Link from "next/link";

type Props = {
  className?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content?: RichTextBlock[];
  projectClient?: string;
  projectTeam: {
    name: string;
    url_link: string;
  }[];
  industry?: string;
  services?: string;
};
function AboutProjectDrawer({
  className,
  isOpen,
  onOpenChange,
  content = [],
  projectClient,
  projectTeam,
  industry,
  services,
}: Props) {
  const arrowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!arrowRef.current) return;

    if (isOpen) {
      gsap.to(arrowRef.current, {
        rotate: 180,
        duration: 0.4,
      });
    } else {
      gsap.to(arrowRef.current, {
        rotate: 0,
        duration: 0.4,
      });
    }
  }, [isOpen]);

  return (
    <section
      aria-label="about the project"
      className={cn("flex flex-col w-full", className)}
    >
      <div className="w-fit mx-auto md:mx-0  about-project rounded-full">
        <GlassButton
          onClick={() => onOpenChange(!isOpen)}
          className="flex-center max-h-[34px] px-[16px] py-[8px] rounded-full btn"
        >
          About the project
          <div
            ref={arrowRef}
            className={`plusminus-about shrink-0 ${isOpen ? "active" : ""}`}
          ></div>
        </GlassButton>
      </div>

      {/* Mobile GlassSheet Behavior */}
      <GlassSheet open={isOpen && isMobile} onOpenChange={onOpenChange}>
        <GlassSheetContent
          side="bottom"
          className="md:hidden flex flex-col h-[85vh] p-0 overflow-hidden"
        >
          <GlassSheetTitle>
            {/* Header - Fixed */}
            <div className="flex justify-between items-center p-6 pb-2 shrink-0 relative z-10 bg-[#1A1A1A]">
              <h3 className="text-xl font-medium">About the project</h3>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Close"
              >
                <XIcon width={18} height={18} />
              </button>
            </div>
          </GlassSheetTitle>
          {/* Scrollable Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-12 custom-scrollbar">
            <div className="w-full text-left relative z-10 pt-4">
              <AboutProjectContent content={content} />
            </div>

            <div className="mt-12 space-y-8 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[#8C8C8C] text-sm mb-1 uppercase tracking-wider font-medium">
                    Client
                  </h4>
                  <p className="text-base">{projectClient}</p>
                </div>
                <div>
                  <h4 className="text-[#8C8C8C] text-sm mb-1 uppercase tracking-wider font-medium">
                    Industry
                  </h4>
                  <p className="text-base">{industry}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <h4 className="text-[#8C8C8C] text-sm mb-1 uppercase tracking-wider font-medium">
                    Services
                  </h4>
                  <p className="text-base whitespace-pre-wrap">{services}</p>
                </div>
                <div className="col-span-1">
                  <h4 className="text-[#8C8C8C] text-sm mb-1 uppercase tracking-wider font-medium">
                    Team
                  </h4>
                  {projectTeam.map((team, index) =>
                    team.url_link ? (
                      <Link
                        aria-label={team.name}
                        href={team.url_link || "#"}
                        key={index}
                        target="_blank"
                        className="hover:underline block"
                      >
                        {team.name}
                      </Link>
                    ) : (
                      <p key={index} className="block">
                        {team.name}
                      </p>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </GlassSheetContent>
      </GlassSheet>
    </section>
  );
}

export default AboutProjectDrawer;
