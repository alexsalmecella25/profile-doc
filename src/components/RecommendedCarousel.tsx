import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export function RecommendedCarousel() {
    // Reverting to the circular icon format but keeping the beautiful landscape-inspired gradients
    const recommendations = [
        {
            title: "Ischemic colitis",
            category: "Colorectal",
            initial: "C",
            bg: "bg-gradient-to-br from-[#8b919d] to-[#d8d3cd]",
        },
        {
            title: "Desmoplastic tumor",
            category: "General Surgery",
            initial: "G",
            bg: "bg-gradient-to-br from-[#8ab240] to-[#b1c062]",
        },
        {
            title: "Valve revision",
            category: "Cardiac Surgery",
            initial: "C",
            bg: "bg-gradient-to-br from-[#689ec4] via-[#8bb7d5] to-[#f4d4ce]",
        },
        {
            title: "Renal carcinoma",
            category: "Urology",
            initial: "U",
            bg: "bg-gradient-to-b from-[#698492] to-[#718f4a]",
        },
        {
            title: "Liver Metastases",
            category: "Hepatobiliary",
            initial: "H",
            bg: "bg-[radial-gradient(ellipse_at_top_right,#e5c4a7,#7e9581)]",
        },
        {
            title: "Pulmonary nodule",
            category: "Thoracic",
            initial: "T",
            bg: "bg-gradient-to-br from-[#ebb8d2] to-[#d4cde5]",
        }
    ];

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full mt-6 relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] font-medium text-ai-text">
                    Explore our products
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={scrollLeft}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="relative group">
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-4 snap-x items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-px-4 scroll-smooth"
                >
                    {recommendations.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-1.5 pr-6 rounded-full bg-white dark:bg-[#131416] border border-[#e5e7eb] dark:border-white/10 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_2px_8px_rgba(255,255,255,0.02)] hover:border-black/5 dark:hover:border-white/10 transition-all duration-300 cursor-pointer shrink-0 snap-start group/pill"
                        >
                            <div className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/pill:scale-[1.08] ${item.bg}`}>
                                {/* Subtle inner highlight for 3D sphere effect */}
                                <div className="absolute inset-0 rounded-full border border-white/40 mix-blend-overlay" />
                                <div className="absolute inset-x-1 top-0.5 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-full opacity-50" />

                                <span className="text-[16px] font-bold text-white drop-shadow-sm z-10">
                                    {item.initial}
                                </span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[13px] font-semibold text-[#191a1c] dark:text-ai-text leading-tight group-hover/pill:text-blue-600 dark:group-hover/pill:text-blue-400 transition-colors">
                                    {item.title}
                                </span>
                                <span className="text-[11px] font-medium text-[#8e918f] dark:text-ai-text-secondary mt-[2px]">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center gap-3 p-1.5 pr-6 rounded-full bg-white dark:bg-[#131416] border border-[#e5e7eb] dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-black/10 dark:hover:border-white/20 transition-all duration-300 cursor-pointer shrink-0 snap-start group/pill">
                        <div className="relative w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/pill:scale-[1.08] bg-[#f4f4f4] dark:bg-[#2b2d31]">
                            <MoreHorizontal size={20} className="text-[#191a1c] dark:text-white" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[13px] font-semibold text-[#191a1c] dark:text-ai-text leading-tight group-hover/pill:text-blue-600 dark:group-hover/pill:text-blue-400 transition-colors">
                                View all
                            </span>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
