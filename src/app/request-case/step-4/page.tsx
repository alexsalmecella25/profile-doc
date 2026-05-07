"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewCase } from "@/context/NewCaseContext";
const SUGGESTIONS_BY_SPECIALTY: Record<string, string[]> = {
  "Cirugía general": ["Identificación de variaciones anatómicas", "Localización exacta del tumor", "Evaluación de márgenes de resección", "Planificación de abordaje laparoscópico", "Relación con estructuras vasculares"],
  "Hepatobiliopancreática": ["Volumetría de futuro resto hepático (FLR)", "Relación de la lesión con venas suprahepáticas", "Identificación de anatomía hiliar compleja", "Planificación de hepatectomía por segmentos", "Afectación vascular de la vena porta"],
  "Urología": ["Planificación de nefrectomía parcial nefro-sparing", "Relación de la masa con el sistema colector", "Identificación de vasos polares accesorios", "Localización de tumor en relación al hilio renal", "Estudio de invasión de la vena renal"],
  "Coloproctología": ["Relación del tumor con el complejo esfinteriano", "Evaluación de la fascia mesorrectal", "Planificación de abordaje transanal (TaTME)", "Identificación de vasos mesentéricos inferiores"],
  "Cirugía torácica": ["Segmentectomía anatómica asistida por 3D", "Relación de la masa con el hilio pulmonar", "Identificación de variaciones arteriales/venosas", "Planificación de resección en manguito (Sleeve)"],
  "Traumatología": ["Planificación de osteotomías correctoras", "Reducción de fracturas complejas en pelvis/acetábulo", "Diseño de guías de corte personalizadas (PSI)", "Evaluación de stock óseo para prótesis de revisión"]
};

const AI_DESCRIPTIONS: Record<string, string> = {
  "Volumetría de futuro resto hepático (FLR)": "Realizar un análisis volumétrico exhaustivo del futuro resto hepático (FLR) para determinar la seguridad de la hepatectomía programada y minimizar el riesgo de insuficiencia hepática post-quirúrgica.",
  "Relación de la lesión con venas suprahepáticas": "Visualizar con precisión la distancia y el grado de contacto de la lesión con las venas suprahepáticas derecha, media e izquierda para planificar el margen de resección vascular.",
  "Identificación de anatomía hiliar compleja": "Identificar las variaciones anatómicas en la placa hiliar y la bifurcación de la vía biliar para evitar lesiones iatrogénicas durante la disección.",
  "Planificación de hepatectomía por segmentos": "Delimitar con precisión los segmentos hepáticos afectados y las líneas de corte quirúrgico basadas en la anatomía vascular segmentaria del paciente.",
  "Planificación de nefrectomía parcial nefro-sparing": "Evaluar la viabilidad de una nefrectomía parcial mediante la visualización 3D del tumor y su profundidad de invasión en el parénquima renal, priorizando la preservación de tejido sano.",
  "Relación de la masa con el sistema colector": "Analizar la proximidad de la masa renal al sistema pielocalicial para prever la necesidad de reparación o reconstrucción de la vía urinaria.",
  "Identificación de vasos polares accesorios": "Localizar arterias y venas polares accesorias que puedan comprometer la estrategia quirúrgica o causar hemorragias inesperadas.",
  "Relación del tumor con el complejo esfinteriano": "Determinar con precisión milimétrica la distancia del borde inferior del tumor al complejo esfinteriano para decidir entre una resección anterior baja o una amputación abdominoperineal.",
  "Segmentectomía anatómica asistida por 3D": "Planificar una segmentectomía pulmonar precisa identificando los planos intersegmentarios y las estructuras broncovasculares específicas de cada segmento.",
  "Planificación de osteotomías correctoras": "Simular digitalmente las osteotomías necesarias para corregir la deformidad ósea, permitiendo el cálculo exacto de los ángulos de corte y la posición de las placas de osteosíntesis.",
  "Identificación de variaciones anatómicas": "Identificar posibles anomalías en la distribución vascular y ductal que puedan condicionar el abordaje quirúrgico estándar.",
  "Localización exacta del tumor": "Determinar la posición tridimensional exacta de la lesión para optimizar la vía de abordaje y garantizar márgenes oncológicos libres.",
  "Afectación vascular de la vena porta": "Evaluar el grado de infiltración o contacto de la masa con el eje esplenoportal para considerar la necesidad de reconstrucción vascular."
};

export default function Step4Page() {
  const { state, setObjective } = useNewCase();
  const [selectedPills, setSelectedPills] = React.useState<Set<string>>(new Set());
  const router = useRouter();

  const baseSpecialty = state.selectedSpecialty ? state.selectedSpecialty.split(" > ")[0] : "Cirugía general";
  const currentSuggestions = SUGGESTIONS_BY_SPECIALTY[baseSpecialty] || SUGGESTIONS_BY_SPECIALTY["Cirugía general"];

  const handleNext = () => {
    router.push("/request-case/step-5");
  };

  const toggleSuggestion = (sug: string) => {
    const newSelected = new Set(selectedPills);
    if (newSelected.has(sug)) {
      newSelected.delete(sug);
    } else {
      newSelected.add(sug);
      const aiText = AI_DESCRIPTIONS[sug] || `El objetivo es la ${sug.toLowerCase()} para asegurar el éxito del procedimiento.`;
      const currentText = state.objective || "";
      const separator = currentText.length > 0 ? "\n\n" : "";
      setObjective(`${currentText}${separator}${aiText}`);
    }
    setSelectedPills(newSelected);
  };

  return (
    <>
      <div className="w-full max-w-[850px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-[24px] font-semibold text-[#191A1C] dark:text-white mb-12 text-center">Finalidad y prescripción médica</h1>
        
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1 mb-1">
              <label className="text-[16px] leading-[24px] font-semibold text-[#393C40]">Objetivo del modelo</label>
              <span className="bg-[#1a73e8]/10 text-[#1a73e8] px-2 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">Muy importante</span>
            </div>
            <textarea 
              placeholder="Describa el objetivo quirúrgico principal o seleccione sugerencias de la IA para autocompletar..." 
              className="min-h-[220px] p-6 rounded-[20px] border-[#A6B6C5] resize-none focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] border w-full text-[16px] leading-relaxed transition-all placeholder:text-gray-400 shadow-sm"
              value={state.objective}
              onChange={(e) => setObjective(e.target.value)}
            />
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-1 ml-1">
              <div className="flex items-center gap-2">
                <label className="text-[16px] leading-[24px] font-semibold text-[#393C40]">Sugerencias clínicas</label>
                <div className="h-2 w-2 rounded-full bg-[#1a73e8] animate-pulse" />
              </div>
              <p className="text-[14px] text-gray-400">Pulsar para redactar automáticamente el objetivo clínico profesional.</p>
            </div>
            <div className="flex flex-wrap gap-2.5 items-start justify-start w-full">
              {currentSuggestions?.map((sug, idx) => (
                <button 
                  key={idx}
                  onClick={() => toggleSuggestion(sug)}
                  className={`px-5 py-3 rounded-full border text-[13px] font-medium transition-all duration-300 flex items-center gap-2 group shrink-0 ${
                    selectedPills.has(sug) 
                      ? "border-[#1a73e8] bg-[#1a73e8]/5 text-[#1a73e8] ring-1 ring-[#1a73e8]" 
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#1a73e8]/30 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                >
                  <Plus size={14} className={selectedPills.has(sug) ? "rotate-45 transition-transform" : "text-gray-400 group-hover:text-[#1a73e8] transition-transform"} />
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-[100px] bg-white/80 dark:bg-ai-surface/80 backdrop-blur-md border-t border-ai-border z-[150] flex items-center px-12 justify-end">
        <Button 
          onClick={handleNext}
          disabled={!state.objective}
          className="h-[52px] px-10 bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[12px] text-[16px] font-medium transition-all disabled:opacity-50"
        >Continuar</Button>
      </div>
    </>
  );
}
