"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "@/components/markdown-renderer";

interface AccordionItemProps {
    title: string;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

interface InformationData {
    id: number;
    title: string;
    subtitle: string;
    subtitle_highlight: string;
    content: string;
    is_how_we_work: boolean;
    how_we_work_main: {
        id: number;
        phase_number: string;
        phase_name: string;
        phase_description: string;
        is_badge_show: boolean;
    }[]
}

function AccordionItem({ title, isOpen, onClick, children }: AccordionItemProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current || !arrowRef.current) return;

        if (isOpen) {
            // Animate open
            gsap.to(contentRef.current, {
                height: contentRef.current.scrollHeight,
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
                onComplete: () => {
                    if (contentRef.current) {
                        contentRef.current.style.height = "auto";
                    }
                }
            });

            gsap.to(arrowRef.current, {
                rotate: 180,
                duration: 0.4,
            });
        } else {
            // Animate close
            gsap.to(contentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.4,
                ease: "power3.inOut",
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
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={onClick}
                >
                    <h2 className="text-3xl lg:text-5xl uppercase pr-2 tracking-wide text-white">{title}</h2>
                    <div
                        ref={arrowRef}
                        className={`plusminus shrink-0 ${isOpen ? "active" : ""}`}
                    ></div>
                </div>

                {/* Outer Wrapper for height/opacity animations */}
                <div
                    ref={contentRef}
                    className="overflow-hidden"
                    style={{ height: 0, opacity: 0 }}
                >
                    {children}
                </div>
            </div>
            <div className="border-b border-[#909090]"></div>
        </>
    );
}

export default function AccordionInformationV2({
    maxWidthContent,
    dataHowWeWork
}: {
    maxWidthContent?: string;
    dataHowWeWork: InformationData[]
}) {
    const [activeIndex, setActiveIndex] = useState<number | null>(0); // Default open the first one

    const toggleAccordion = (index: number) => {
        setActiveIndex(prevIndex => (prevIndex === index ? null : index));
    };
    const router = useRouter()

    const section3Content = [
        {
            title: "STRATEGY",
            list: [
                { text: "BRAND STRATEGY" },
                { text: "BRAND POSITIONING" },
                { text: "BRAND PORTFOLIO" },
                { text: "BRAND ARCHITECTURE" },
                { text: "BRAND & PRODUCT NAMING" }
            ]
        },
        {
            title: "DESIGN",
            list: [
                { text: "VISUAL IDENTITY" },
                { text: "PACKAGING DESIGN" },
                { text: "PACKAGING SYSTEMS" },
                { text: "PRODUCT LINE EXTENSIONS" },
                { text: "BRAND GUIDELINES" },
                { text: "STRUCTURAL DESIGN" }
            ]
        },
        {
            title: "DIGITAL",
            list: [
                { text: "E-COMMERCE UI/UX DESIGN" },
                { text: "E-COMMERCE WEB DEVELOPMENT" },
                { text: "SOCIAL MEDIA CONTENT & STRATEGY" },
                { text: "DIGITAL ASSETS" }
            ]
        },
        {
            title: "VISUALIZATION",
            list: [
                { text: "PHOTO & VIDEO PRODUCTION" },
                { text: "KEY VISUAL" },
                { text: "CGI PRODUCT VISUALIZATION" },
                { text: "E-COMM IMAGES & ANIMATION" }
            ]
        },
        {
            title: "INTELLIGENCE",
            list: [
                {
                    text: <>
                        <span className="">SCANR™ - </span><span className="text-lg text-[#909090]">AI-Assisted Design Performance
                        </span>                 </>
                },
                { text: "A/B TESTING" },
                { text: "COMPETITIVE BENCHMARK" },
                { text: "DESIGN GAP MAPPING" }
            ]
        }
    ];



    return (
        <div className="w-full text-white">
            {dataHowWeWork.map((item) => (
                <AccordionItem
                    key={item.id}
                    title={item.title}
                    isOpen={activeIndex === item.id}
                    onClick={() => toggleAccordion(item.id)}
                >
                    {item.is_how_we_work ? (
                        <>
                            {item.how_we_work_main.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 lg:grid-cols-2 py-8 lg:py-12 gap-x-8 gap-y-4 border-b border-[#909090]/30 last:border-0">
                                    <div className="flex items-center lg:items-start gap-x-8 lg:gap-x-56">
                                        <span className="text-base text-[#8c8c8c] mt-1 font-semibold uppercase tracking-wider">
                                            {item.phase_number}
                                        </span>
                                        <h4 className="text-4xl lg:text-5xl font-bold text-white uppercase">
                                            {item.phase_name}
                                        </h4>

                                    </div>
                                    <div className="space-y-4 text-base text-[#9C9C9C]">
                                        {item.is_badge_show && (
                                            <div className="mb-4">
                                                <span className="inline-block border border-[#909090] rounded-full px-6 py-2.5 text-sm font-semibold uppercase text-[#9C9C9C]">
                                                    POWERED BY SCANR™
                                                </span>
                                            </div>
                                        )}
                                        <div className="text-white text-lg lg:text-2xl space-y-4.5">
                                            <MarkdownRenderer content={item.phase_description} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="grid lg:grid-cols-2 space-y-6 lg:space-y-0 items-start pt-12 pb-6 gap-x-8">
                            <div>
                                {item.content === "\"-\"" || item.content === "\"_\"" ? (
                                    <div></div>
                                ) : (
                                    <h4 className="text-3xl lg:text-4xl text-white whitespace-pre-wrap font-minion">
                                        {item.subtitle}
                                    </h4>
                                )}

                            </div>
                            <div
                                className={cn(
                                    "space-y-4.5 text-[#9C9C9C] text-base",
                                    maxWidthContent
                                )}
                            >
                                <div className="space-y-4.5 text-white text-lg lg:text-2xl">

                                    <MarkdownRenderer content={item.content} />

                                </div>
                            </div>
                        </div>
                    )}

                </AccordionItem>
            ))}


            {/* 2. HOW WE WORK */}
            {/* <AccordionItem
                title="HOW WE WORK"
                isOpen={activeIndex === 1}
                onClick={() => toggleAccordion(1)}
            >
                <div className="pt-6 pb-6 divide-y divide-[#909090]/20">
                    {section2Content.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 lg:grid-cols-2 py-8 lg:py-12 gap-x-8 gap-y-4 first:pt-4 last:pb-4 border-b border-[#909090]/30 last:border-0">
                            <div className="flex items-center lg:items-start gap-x-8 lg:gap-x-56">
                                <span className="text-base text-[#8c8c8c] mt-1 font-semibold uppercase tracking-wider">
                                    {item.subtitle}
                                </span>
                                <h4 className="text-4xl lg:text-5xl font-bold text-white uppercase">
                                    {item.title}
                                </h4>

                            </div>
                            <div className="space-y-4 text-base text-[#9C9C9C]">
                                {item.showBadge && (
                                    <div className="mb-4">
                                        <span className="inline-block border border-[#909090] rounded-full px-6 py-2.5 text-sm font-semibold uppercase text-[#9C9C9C]">
                                            POWERED BY SCANR™
                                        </span>
                                    </div>
                                )}
                                <div className="text-white text-lg lg:text-2xl space-y-4.5">
                                    {item.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionItem> */}

            {/* 3. CAPABILITIES */}
            {/* <AccordionItem
                title="CAPABILITIES"
                isOpen={activeIndex === 2}
                onClick={() => toggleAccordion(2)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-12 pb-6 gap-x-8 gap-y-12">
                    {section3Content.map((block, index) => (
                        <div key={index} className="space-y-6">
                            <h4 className="text-2xl lg:text-3xl font-medium text-white uppercase tracking-wider">
                                {block.title}
                            </h4>
                            <ul className="space-y-2">
                                {block.list.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-base text-[#9C9C9C] uppercase tracking-wide">
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </AccordionItem> */}

            {/* 4. NON-NEGOTIABLES */}
            {/* <AccordionItem
                title="NON-NEGOTIABLES"
                isOpen={activeIndex === 3}
                onClick={() => toggleAccordion(3)}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 pt-12 pb-6 gap-16">
                    {section4Content.map((item, index) => (
                        <div className="space-y-4 lg:col-start-2 border-b border-[#909090]/20 pb-16 last:border-0" key={index}>
                            <h4 className="text-2xl lg:text-4xl font-semibold text-white uppercase">
                                {item.title}
                            </h4>
                            <div className="space-y-4.5 text-white text-lg lg:text-2xl ">
                                {item.content}
                            </div>
                        </div>
                    ))}



                </div>
            </AccordionItem> */}


            <div className="mt-16 pt-16">
                <h2 className="text-3xl lg:text-5xl uppercase pr-2 text-white">
                    CAPABILITIES
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-12 pb-6 gap-x-8 gap-y-12">
                    {section3Content.map((block, index) => (
                        <div key={index} className="space-y-4.5 lg:last:col-span-2">
                            <h4 className="text-2xl lg:text-3xl font-semibold text-white uppercase">
                                {block.title}
                            </h4>
                            <ul className="space-y-0.5">
                                {block.list.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-lg lg:text-2xl">
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div >

            {/* BOTTOM BLOCK: philosophical close and button */}
            <div className="space-y-4.5 mt-16 pt-16 border-t border-[#909090]/30">
                <p className="text-2xl lg:text-[42px] font-minion leading-snug lg:leading-[54px] text-white whitespace-pre-wrap font-serif">
                    We work with brands that are ready to invest, not just explore.{"\n"}

                </p>

                <div>
                    <button onClick={() => router.push("/approach/#faq")}
                        className="inline-flex items-center gap-2 border border-white hover:bg-white hover:text-[#101010] text-white text-[16px] px-8 py-4 rounded-full transition-all duration-300 cursor-pointer">
                        <ArrowDown className="rotate-270" />
                        <span>See minimum engagement & FAQ</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
