"use client";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SpecialtiesCarousel() {
    const specialtiesData = [
        {
            id: "digestiva",
            title: "General & Digestive Surgery",
            initial: "G",
            color: "text-amber-600 dark:text-amber-500",
            bg: "bg-amber-100 dark:bg-amber-500/10",
            image: "/images/models/liver_3d_1772712040731.png",
            products: [
                { id: "col", title: "Colorectal", initial: "C" },
                { id: "eso", title: "Esophagogastric", initial: "E" },
                { id: "hep", title: "Hepatobiliary", initial: "H" },
                { id: "pan", title: "Pancreatic", initial: "P" },
                { id: "per", title: "Peritoneal & Retroperitoneal", initial: "P" }
            ]
        },
        {
            id: "urologica",
            title: "Urologic Surgery",
            initial: "U",
            color: "text-blue-600 dark:text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-500/10",
            image: "/images/models/kidneys_3d_1772712147028.png",
            products: [
                { id: "ren", title: "Kidney", initial: "K" },
                { id: "pro", title: "Prostate", initial: "P" }
            ]
        },
        {
            id: "toracica",
            title: "Thoracic Surgery",
            initial: "T",
            color: "text-purple-600 dark:text-purple-500",
            bg: "bg-purple-100 dark:bg-purple-500/10",
            image: "/images/models/lungs_3d_1772712131331.png",
            products: [
                { id: "tor", title: "Thorax", initial: "T" }
            ]
        },
        {
            id: "otras",
            title: "Other Surgeries",
            initial: "O",
            color: "text-emerald-600 dark:text-emerald-500",
            bg: "bg-emerald-100 dark:bg-emerald-500/10",
            image: "/images/models/brain_3d_1772712116509.png",
            products: [
                { id: "ped", title: "Pediatric Surgery", initial: "P" },
                { id: "cab", title: "Head & Neck Surgery", initial: "H" },
                { id: "car", title: "Cardiac Surgery", initial: "C" }
            ]
        }
    ];

    const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    const selectedSpecialty = specialtiesData.find(s => s.id === selectedSpecId);

    return (
        <div className="w-full mb-12 mt-4 relative">
            {!selectedSpecId ? (
                // VIEW: SPECIALTIES
                <div className="flex flex-col">
                    <div className="flex items-center justify-between px-10 mb-4">
                        <h2 className="text-[14px] font-medium text-ai-text-secondary uppercase tracking-wider">Specialties</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={scrollLeft} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={scrollRight} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                    <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 pb-6 -mx-10 px-10 scrollbar-hide snap-x items-start">
                        {specialtiesData.map((spec) => (
                            <div
                                key={spec.id}
                                onClick={() => setSelectedSpecId(spec.id)}
                                className="flex flex-col gap-[12px] items-center shrink-0 w-[120px] group cursor-pointer snap-start"
                            >
                                <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-[1.05] relative overflow-hidden bg-[#f9fafa] border border-black/5 dark:border-white/5`}>
                                    <img src={spec.image} alt={spec.title} className="w-[100%] h-[100%] object-cover object-center mix-blend-multiply dark:mix-blend-normal" />
                                </div>

                                <span className="text-ai-text text-[13px] font-medium text-center leading-tight">
                                    {spec.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // VIEW: PRODUCTS FOR SELECTED SPECIALTY
                <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between px-10 mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedSpecId(null)}
                                className="p-1.5 rounded-full hover:bg-ai-hover-1 text-ai-text-secondary transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className={`text-[15px] font-semibold ${selectedSpecialty?.color}`}>
                                {selectedSpecialty?.title}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={scrollLeft} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={scrollRight} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 pb-6 -mx-10 px-10 scrollbar-hide snap-x items-start">
                        {selectedSpecialty?.products.map((prod) => (
                            <div
                                key={prod.id}
                                className="flex flex-col gap-[12px] items-center shrink-0 w-[120px] group cursor-pointer snap-start"
                            >
                                <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-[1.05] bg-ai-surface-variant border border-black/5 dark:border-white/5`}>
                                    <span className="text-[32px] font-light text-ai-text opacity-70">
                                        {prod.initial}
                                    </span>
                                </div>
                                <span className="text-ai-text text-[13px] font-medium text-center leading-tight">
                                    {prod.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
