import React from 'react'

function ReplacingFAQInformation() {
    const section2Content = [{
        title: "Scan",
        subtitle: "Phase 1",
        content: <>
            <p>
                Before we design anything, we read the competitive landscape.
            </p>
            <p>
                Who are your closest competitors? What visual language has the category overused?
                What has become expected? Where are the gaps no one has claimed?
            </p>
            <p>
                Using SCANR™, our proprietary AI-assisted design performance methodology, we
                analyze, score, and benchmark your brand against its closest competitors across seven
                performance indicators: Purchase Cue, Standout, Findability, Communication Clarity,
                Mental Availability Potential, Element Resonance, and Market Gap.
            </p>
            <p>
                The purpose is simple: to remove weak opinion from the room.
            </p>
            <p>
                Every design decision is tied to what the category already owns, what the consumer is
                likely to notice first, and where the brand has the strongest opportunity to win attention.
            </p>
        </>,
        showBade: true
    },
    {
        title: "Build",
        subtitle: "Phase 2",
        content: <>
            <p>
                Every element in the system earns its place.
            </p>
            <p>
                Logotype, typeface, color, packaging, hierarchy, imagery, and brand language are tied
                directly to the competitive gap identified in the scan.
            </p>
            <p>
                The goal is not to make the brand look different for the sake of difference. The goal is to
                build a system that owns a clear space in the market, communicates value quickly, and
                performs at the most critical moment: when a consumer decides.
            </p>
            <p>
                We build brand systems that hold together at every scale. From a label on a shelf to a
                campaign asset on a screen, the brand holds.
            </p>
            <p>
                That is what it means to build with intention.
            </p>
        </>,
        showBade: false
    }, {
        title: "Launch",
        subtitle: "Phase 3",
        content: <>
            <p>
                Before handover, we visualize the brand across the contexts where it will compete.
            </p>
            <p>
                Shelf environments. Retail displays. Digital touchpoints. E-commerce assets. Launch
                communication.
            </p>
            <p>
                The client sees how the brand behaves before it goes into production.
            </p>
            <p>
                You do not receive a file.
            </p>
            <p>
                You receive a brand system ready to move.
            </p>
        </>,
        showBade: false
    }
    ]

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
                { text: "SCANR™ – Proprietary AI-Assisted Design Performance" },
                { text: "A/B TESTING" },
                { text: "COMPETITIVE BENCHMARK" },
                { text: "DESIGN GAP MAPPING" }
            ]
        }
    ]


    return (
        <section aria-label="replacing-faq-information" className="mt-18 lg:mt-32 w-full text-white space-y-12 lg:space-y-24">

            {/* --- SECTION 1: HOW WE THINK --- */}
            <div className="">
                <h2 className="text-3xl lg:text-5xl font-normal uppercase ">
                    HOW WE THINK
                </h2>
                <div className="border-b border-[#909090] mt-4"></div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 py-8 lg:py-10">
                    {/* Left Column: Philosophical statement */}
                    <div>
                        <h3 className="text-3xl lg:text-4xl font-minion leading-tight whitespace-pre-line text-white">
                            Most brands are held back by consensus.{"\n"}
                            They become average.{"\n"}
                            And average gets ignored.
                        </h3>
                    </div>

                    {/* Right Column: Narrative */}
                    <div className="space-y-3.5 text-white max-w-xl">
                        <p>
                            When too many opinions shape a brand without a clear strategic standard, the work
                            becomes safer, softer, and easier to approve. But easier to approve does not always
                            mean easier to choose.
                        </p>
                        <p>
                            Most brands lose before they are even considered. Not because the product is weak,
                            but because the brand fails to earn the moment of choice.
                        </p>
                        <p>
                            <span className="text-white font-bold">Choice Gravity</span> is how we fix that.
                        </p>
                        <p>
                            It is the quiet pull that transforms a glance into attention, attention into desire, and
                            desire into a confident decision to choose your brand over everything else on the shelf.
                        </p>
                        <p>
                            We build it through strategic clarity, emotional design, and brand systems that perform
                            consistently. On shelf, on screen, and everywhere a choice is made.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: HOW WE WORK --- */}
            <div className="">
                <h2 className="text-3xl lg:text-5xl font-normal uppercase ">
                    HOW WE WORK
                </h2>

                <div className="border-b border-[#909090] mt-4"></div>


                {section2Content.map((item, index) => (
                    <div className="grid grid-cols-1 lg:grid-cols-2 py-8 lg:py-12 gap-x-8 gap-y-4 border-b border-[#909090] last:border-0">
                        <div className="flex flex-col justify-start">
                            <h3 className="text-3xl lg:text-4xl font-bold text-white uppercase">
                                {item.title}
                            </h3>
                            <span className="text-base text-[#8c8c8c] mt-1 r">
                                {item.subtitle}
                            </span>
                        </div>
                        <div className="space-y-3.5 text-base max-w-xl">
                            {item.showBade && (
                                <div>
                                    <span className="inline-block border border-[#909090] rounded-full px-6 py-3 text-base font-semibold uppercase  text-[#9C9C9C]">
                                        POWERED BY SCAN™
                                    </span>
                                </div>
                            )}

                            {item.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- SECTION 3: CAPABILITIES --- */}
            <div className="">
                <h2 className="text-3xl lg:text-5xl font-normal uppercase ">
                    CAPABILITIES
                </h2>

                <div className="border-b border-[#909090] mt-4"></div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-8 lg:py-12 gap-x-8 gap-y-16">
                    {section3Content.map((block, index) => (
                        <div key={index}>
                            <h3 className="text-2xl lg:text-4xl font-medium text-white mb-6 uppercase r">
                                {block.title}
                            </h3>
                            <ul className="space-y-1">
                                {block.list.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-base text-white uppercase">
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SECTION 4: NON-NEGOTIABLES --- */}
            <div className="">
                <h2 className="text-3xl lg:text-5xl font-normal uppercase ">
                    NON-NEGOTIABLES
                </h2>

                <div className="border-b border-[#909090] mt-4"></div>


                <div className="grid grid-cols-1 lg:grid-cols-2 py-8 lg:py-12 gap-x-8 gap-y-20">
                    {/* MUTUAL RESPECT */}
                    <div className="space-y-4">
                        <h3 className="text-2xl lg:text-3xl font-medium text-white uppercase">
                            MUTUAL RESPECT
                        </h3>
                        <p className="text-white text-base whitespace-pre-wrap">
                            We work with partners who respect the full agreement, not only the creative outcome. {`\n\n`}
                            That means respecting the process, the people, the scope, the timeline, the feedback
                            rhythm, and the payment terms. A healthy collaboration is not built by asking for
                            commitment from the studio while delaying commitment from the client. {`\n\n`}
                            If a partnership is serious, everything agreed must be respected.
                        </p>
                    </div>

                    {/* PAYMENT DISCIPLINE */}
                    <div className="space-y-4">
                        <h3 className="text-2xl lg:text-3xl font-medium text-white uppercase">
                            PAYMENT DISCIPLINE
                        </h3>
                        <p className="text-white text-base whitespace-pre-wrap">
                            Healthy partnerships require payment discipline. {`\n\n`}
                            Every engagement is planned around agreed timelines, allocated resources, and clear
                            payment terms. Late payment disrupts the work, affects planning, and turns a creative
                            partnership into an unnecessary collection process. {`\n\n`}
                            That is not how good work is built. {`\n\n`}
                            We do not tolerate late payment. Work may be paused until all outstanding payments are settled.
                        </p>
                    </div>

                    {/* UNPAID WORK */}
                    <div className="space-y-4">
                        <h3 className="text-2xl lg:text-3xl font-medium text-white uppercase">
                            UNPAID WORK
                        </h3>
                        <p className="text-white text-base whitespace-pre-wrap">
                            We do not do free pitches, speculative work, or unpaid exclusivity. {`\n`}
                            Our expertise has value. Serious partnerships start by respecting that. {`\n`}
                        </p>
                    </div>

                    {/* THE WRONG FIT */}
                    <div className="space-y-4">
                        <h3 className="text-2xl lg:text-3xl font-medium text-white uppercase">
                            THE WRONG FIT
                        </h3>
                        <p className="text-white text-base whitespace-pre-wrap">
                            We do not work with partners who disrespect our people, process, payment terms, or agreements. {`\n\n`}
                            That includes careless communication, blurred boundaries, repeated delays in feedback,
                            late payment, or attempts to move beyond the agreed scope without proper approval. {`\n\n`}
                            If these standards are breached, we reserve the right to pause or end the engagement.
                        </p>
                    </div>
                </div>

                {/* BOTTOM BLOCK: philosophical close and button */}
                <div className="space-y-12 mt-16">
                    <p className="text-2xl lg:text-[42px] font-minion leading-snug lg:leading-[54px] text-white whitespace-pre-wrap">
                        We work with brands that are ready to invest, not just explore. {"\n"}
                        That means coming in with a real business problem, the ambition to solve it {"\n"}
                        completely, and the understanding that great design is not a cost. {"\n"}
                        It is what makes everything else perform. {"\n"}
                        That is the partnership we are here for.
                    </p>

                    <div>
                        <button className="inline-block border border-white hover:bg-white hover:text-[#101010] text-white font-semibold text-[13px]  uppercase px-8 py-4 rounded-full transition-all duration-300">
                            See minimum engagement & FAQ
                        </button>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default ReplacingFAQInformation