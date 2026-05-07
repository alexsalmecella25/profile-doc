"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewCase } from "@/context/NewCaseContext";

const SUGGESTIONS_BY_SPECIALTY: Record<string, string[]> = {
  "Cirugía general": [
    "Identificación de variaciones anatómicas",
    "Localización exacta del tumor",
    "Evaluación de márgenes de resección",
    "Planificación de abordaje laparoscópico",
    "Relación con estructuras vasculares"
  ],
  "Hepatobiliopancreática": [
    "Volumetría hepática",
    "Anatomía vascular portal y arterial",
    "Relación del tumor con venas suprahepáticas",
    "Planificación de hepatectomía"
  ],
  "Urología": [
    "Localización de masa renal",
    "Relación con arteria y vena renal",
    "Planificación de nefrectomía parcial",
    "Anatomía del sistema colector"
  ]
};

export default function Step3Page() {
  const { state, setTraceabilityId, setPathology } = useNewCase();
  const router = useRouter();

  const handleNext = () => {
    router.push("/request-case/step-4");
  };

  return (
    <>
      <div className="w-full max-w-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-[24px] font-semibold text-[#191A1C] dark:text-white mb-12 text-center">Finalidad y prescripción médica</h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[16px] leading-[24px] font-semibold text-[#393C40] ml-1">Patología</label>
            <Input 
              placeholder="Ej. Carcinoma hepatocelular" 
              className="h-[60px] px-4 rounded-[12px] border-[#A6B6C5]"
              value={state.pathology}
              onChange={(e) => setPathology(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[16px] leading-[24px] font-semibold text-[#393C40] ml-1">Identificador de trazabilidad del paciente*</label>
            <p className="text-[14px] leading-[20px] text-[#393C40] ml-1 mb-1">
              Utilice un identificador que le permita identificar de forma univoca al paciente para el cual se solicita el modelo: NHC, SIP, CARM... No indique datos personales del paciente.
            </p>
            <Input 
              placeholder="Identificador de paciente en el hospital (NHC, SIP, CARM...)" 
              className="h-[60px] px-4 rounded-[12px] border-[#A6B6C5]"
              value={state.traceabilityId}
              onChange={(e) => setTraceabilityId(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-[100px] bg-white/80 dark:bg-ai-surface/80 backdrop-blur-md border-t border-ai-border z-[150] flex items-center px-12 justify-end">
        <Button 
          onClick={handleNext}
          disabled={!state.pathology || !state.traceabilityId}
          className="h-[52px] px-10 bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[12px] text-[16px] font-medium transition-all disabled:opacity-50"
        >Continuar</Button>
      </div>
    </>
  );
}
