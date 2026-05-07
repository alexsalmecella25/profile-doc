"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useNewCase } from "@/context/NewCaseContext";

export default function Step1Page() {
  const { state, setSelectedModel } = useNewCase();
  const router = useRouter();

  const handleNext = (model: string) => {
    setSelectedModel(model);
    router.push("/request-case/step-2");
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-[24px] font-semibold text-[#191A1C] dark:text-white mb-2 text-center">Seleccione un tipo de modelo</h1>
      <p className="text-[14px] text-[#393C40] dark:text-gray-400 mb-12 text-center">Elija el tipo de modelo 3D que mejor se adapte a sus necesidades.</p>
      
      <div className="flex flex-row w-[800px] max-w-full gap-[16px]">
        <button 
          onClick={() => handleNext("estándar")}
          className={`flex flex-col items-start p-[24px] gap-[16px] flex-1 rounded-[12px] border-2 transition-all bg-[#FFF] ${
            state.selectedModel === "estándar" ? "border-[#1a73e8] shadow-[0_0_0_1px_#1a73e8]" : "border-[#A6B6C5] hover:border-[#1a73e8]/50"
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-[3px] flex items-center justify-center transition-all ${
            state.selectedModel === "estándar" ? "border-[#1a73e8]" : "border-[#A6B6C5]"
          }`}>
            {state.selectedModel === "estándar" && <div className="w-2 h-2 rounded-full bg-[#1a73e8]" />}
          </div>
          <div className="flex flex-col items-start text-left gap-1">
            <span className="text-[16px] font-bold text-[#191A1C] dark:text-gray-800">Modelo clínico estándar</span>
            <span className="text-[13px] text-[#393C40] leading-relaxed">Modelo anatómico detallado diseñado para planificación y guiado quirúrgico en pacientes. Cumple con normativa de producto sanitario y es apto para uso clínico.</span>
          </div>
        </button>

        <button 
          onClick={() => handleNext("rd")}
          className={`flex flex-col items-start p-[24px] gap-[16px] flex-1 rounded-[12px] border-2 transition-all bg-[#FFF] ${
            state.selectedModel === "rd" ? "border-[#1a73e8] shadow-[0_0_0_1px_#1a73e8]" : "border-[#A6B6C5] hover:border-[#1a73e8]/50"
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-[3px] flex items-center justify-center transition-all ${
            state.selectedModel === "rd" ? "border-[#1a73e8]" : "border-[#A6B6C5]"
          }`}>
            {state.selectedModel === "rd" && <div className="w-2 h-2 rounded-full bg-[#1a73e8]" />}
          </div>
          <div className="flex flex-col items-start text-left gap-1">
            <span className="text-[16px] font-bold text-[#191A1C] dark:text-gray-800">Modelo proyecto I+D</span>
            <span className="text-[13px] text-[#393C40] leading-relaxed">Modelo orientado a la investigación, docencia y desarrollo, en el marco de los proyectos de I+D en los que el profesional se encuentra actualmente involucrado.</span>
          </div>
        </button>
      </div>
    </div>
  );
}
