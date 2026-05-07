"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Search, ChevronRight, X, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNewCase } from "@/context/NewCaseContext";

// Hierarchical data for specialty selection (Translated)
export const hierarchyData: any = {
  "Hepatobiliopancreática": ["Hepático", "Vía Biliar", "Pancreático", "Receptor de Trasplante de Hígado", "Donante de Trasplante de Hígado"],
  "Cirugía general": ["Hernia", "Tiroides", "Gástrico", "Esofágico", "Suprarrenal", "Esplénico", "Vascular", "Sarcoma", "Mama", "Pared Abdominal"],
  "Coloproctología": ["Rectal", "Colon", "Suelo Pélvico"],
  "Urología": ["Renal", "Vejiga", "Próstata", "Testicular", "Peneano"],
  "Ginecología": ["Uterino", "Ovárico", "Cervical", "Vulvar"],
  "Cirugía torácica": ["Pulmón", "Pleural", "Mediastínico", "Pared Torácica"],
  "Otorrinolaringología": ["Cabeza y Cuello", "Laringe", "Faringe", "Nasal", "Senos Paranasales", "Oído", "Base de Cráneo"],
  "Traumatología": ["Columna", "Pelvis", "Extremidad Superior", "Extremidad Inferior", "Articulaciones", "Musculoesquelético", "Ortopedia Pediátrica"],
  "Cirugía maxilofacial": ["Mandibular", "Maxilar", "Orbital", "ATM", "Reconstrucción Facial"],
  "Cirugía cardiovascular": ["Cardíaco", "Aórtico", "Valvular", "Coronario", "Vascular Periférico"],
  "Cirugía pediátrica": ["Cardiovascular", "Gastrointestinal", "Urológico", "Ortopédico", "Neurocirugía", "Cirugía Pediátrica General"],
  "Neurocirugía": ["Cerebral", "Espinal", "Nervios Periféricos", "Base de Cráneo", "Vascular"]
};

export default function Step2Page() {
  const { state, setSelectedSpecialty } = useNewCase();
  const router = useRouter();

  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [modalLevel, setModalLevel] = useState(1);
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSpecialtyClick = (specialty: string) => {
    if (hierarchyData[specialty] && hierarchyData[specialty].length > 0) {
      setActiveSpecialty(specialty);
      setModalLevel(2);
      setSearchQuery(""); // Clear search when navigating levels
    } else {
      setSelectedSpecialty(specialty);
      setIsSpecialtyModalOpen(false);
    }
  };

  const handleSubspecialtyClick = (sub: string) => {
    setSelectedSpecialty(`${activeSpecialty} > ${sub}`);
    setIsSpecialtyModalOpen(false);
  };

  const filteredItems = modalLevel === 1 
    ? Object.keys(hierarchyData).filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : (activeSpecialty ? hierarchyData[activeSpecialty].filter((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) : []);

  return (
    <>
      <div className="w-full max-w-[600px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-[24px] font-semibold text-[#191A1C] dark:text-white mb-2 text-center">Seleccionar Especialidad Médica</h1>
        <p className="text-[14px] text-[#393C40] dark:text-gray-400 mb-12 text-center">Define la categoría clínica para acceder a procedimientos.</p>
        
        <button 
          onClick={() => setIsSpecialtyModalOpen(true)}
          className={`h-[80px] w-full px-6 rounded-[12px] border flex items-center justify-between transition-all bg-white dark:bg-ai-surface ${
            state.selectedSpecialty ? "border-[#1a73e8] ring-1 ring-[#1a73e8]/20" : "border-[#A6B6C5] hover:border-[#1a73e8]/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${state.selectedSpecialty ? "bg-[#1a73e8]/10 text-[#1a73e8]" : "bg-gray-100 text-gray-400"}`}>
              {state.selectedSpecialty ? <Check size={20} /> : <Search size={20} />}
            </div>
            <div className="flex flex-col items-start gap-0.5">
              {state.selectedSpecialty ? (
                <>
                  {state.selectedSpecialty.includes(" > ") && (
                    <span className="text-[12px] text-gray-500 font-medium uppercase tracking-wider leading-none">
                      {state.selectedSpecialty.split(" > ")[0]}
                    </span>
                  )}
                  <span className="text-[20px] font-bold text-[#191A1C] leading-tight">
                    {state.selectedSpecialty.includes(" > ") 
                      ? state.selectedSpecialty.split(" > ")[1] 
                      : state.selectedSpecialty}
                  </span>
                </>
              ) : (
                <span className="text-[16px] font-semibold text-gray-400">
                  Seleccionar una especialidad
                </span>
              )}
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        {/* SPECIALTY MODAL */}
        <Dialog open={isSpecialtyModalOpen} onOpenChange={setIsSpecialtyModalOpen}>
          <DialogContent showCloseButton={false} className="max-w-[700px] p-0 border-none rounded-[24px] overflow-hidden bg-white dark:bg-ai-surface">
            <div className="p-8 pb-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {modalLevel === 2 && (
                  <button 
                    onClick={() => setModalLevel(1)}
                    className="text-[#191A1C] hover:opacity-60 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h2 className="text-[20px] font-semibold text-[#191A1C]">
                  {modalLevel === 1 ? "Seleccionar Especialidad" : `${activeSpecialty}`}
                </h2>
              </div>
              <button 
                onClick={() => setIsSpecialtyModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 mb-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar producto, categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[52px] pl-12 pr-4 rounded-[12px] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1a73e8] text-[15px]"
                />
              </div>
            </div>
            
            <div className="px-8 pb-8 max-h-[500px] overflow-y-auto">
              <div className="flex flex-col gap-2">
                {filteredItems.map((item: string) => (
                  <button 
                    key={item}
                    onClick={() => modalLevel === 1 ? handleSpecialtyClick(item) : handleSubspecialtyClick(item)}
                    className="p-4 rounded-[12px] bg-white border border-gray-100 hover:border-[#1a73e8]/30 hover:bg-gray-50/50 text-left transition-all flex items-center gap-4 group"
                  >
                    <div className={`w-5 h-5 rounded-full border-[3px] flex items-center justify-center transition-all ${
                      (modalLevel === 1 ? activeSpecialty === item : state.selectedSpecialty?.includes(item)) ? "border-[#1a73e8]" : "border-gray-200"
                    }`}>
                      {(modalLevel === 1 ? activeSpecialty === item : state.selectedSpecialty?.includes(item)) && <div className="w-2 h-2 rounded-full bg-[#1a73e8]" />}
                    </div>
                    <span className="font-medium text-[#191A1C] flex-1">{item}</span>
                    {modalLevel === 1 && <ChevronRight size={18} className="text-gray-300 group-hover:text-[#1a73e8]" />}
                  </button>
                ))}
                {filteredItems.length === 0 && (
                  <div className="py-12 text-center text-gray-400">No se han encontrado resultados</div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* FIXED BOTTOM BAR - OUTSIDE ANIMATED CONTAINER TO PREVENT BUG */}
      <div className="fixed bottom-0 left-0 w-full h-[100px] bg-white/80 dark:bg-ai-surface/80 backdrop-blur-md border-t border-ai-border z-[150] flex items-center px-12 justify-end">
        <Button 
          disabled={!state.selectedSpecialty}
          onClick={() => router.push("/request-case/step-3")}
          className="h-[52px] px-10 bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[12px] text-[16px] font-medium transition-all disabled:opacity-50"
        >
          Continuar
        </Button>
      </div>
    </>
  );
}
