"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  User, 
  Stethoscope, 
  FileText, 
  Calendar, 
  Clock, 
  Zap,
  Box,
  FileUp,
  AlertCircle,
  Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewCase } from "@/context/NewCaseContext";

export default function Step7Page() {
  const { state, resetState } = useNewCase();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleFinish = () => {
    resetState();
    router.push("/");
  };

  const goToStep = (step: number) => {
    router.push(`/request-case/step-${step}`);
  };

  if (showSuccess) {
    return (
      <div className="w-full max-w-[600px] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 text-center py-20">
        <div className="flex items-center justify-center mb-8 text-green-500">
          <CheckCircle2 size={80} strokeWidth={1.5} />
        </div>
        <h1 className="text-[32px] font-bold text-[#222222] mb-4">¡Solicitud Enviada!</h1>
        <p className="text-[18px] text-gray-500 leading-relaxed mb-12">
          El caso <span className="font-bold text-[#222222]">#{state.traceabilityId || "2024-X"}</span> ha sido registrado correctamente.
        </p>
        <Button 
          onClick={handleFinish}
          className="bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[8px] h-[52px] px-12 text-[16px] font-medium transition-all shadow-lg"
        >
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  const ReportSection = ({ title, icon: Icon, onEdit, children }: { title: string, icon: any, onEdit?: () => void, children: React.ReactNode }) => (
    <div className="w-full bg-white border-b border-[#F0F0F0] last:border-0 py-6 first:pt-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gray-50 rounded-[6px] text-gray-400">
            <Icon size={14} />
          </div>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">{title}</h3>
        </div>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="text-[10px] font-bold text-[#1a73e8] hover:underline flex items-center gap-1"
          >
            <Edit2 size={10} />
            EDITAR
          </button>
        )}
      </div>
      <div className="px-9">
        {children}
      </div>
    </div>
  );

  const ReportItem = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <div className="flex flex-col mb-4 last:mb-0">
      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tight mb-1">{label}</span>
      <div className="text-[14px] font-medium text-[#222222]">{value}</div>
    </div>
  );

  return (
    <div className="w-full max-w-[800px] flex flex-col mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* INFORMATIONAL ALERT */}
      <div className="mt-4 mb-8 p-5 bg-blue-50 rounded-[8px] border border-blue-100 flex gap-4 shadow-sm">
        <AlertCircle size={20} className="text-[#1a73e8] shrink-0 mt-0.5" />
        <p className="text-[14px] text-[#1a73e8] leading-relaxed">
          Este documento resume los requisitos técnicos para la producción del modelo anatómico solicitado. 
          Al confirmar, el caso pasará automáticamente a la cola de procesamiento de <span className="font-bold">Cella Medical Solutions</span>.
        </p>
      </div>

      {/* REPORT BODY - VERTICAL STACK */}
      <div className="space-y-0 pb-32">
        <ReportSection title="Datos Generales" icon={User} onEdit={() => goToStep(1)}>
          <div className="grid grid-cols-2 gap-8">
            <ReportItem label="Especialidad Médica" value={state.selectedSpecialty || "No especificada"} />
            <ReportItem label="Tipo de Modelo" value={state.selectedModel === 'standard' ? 'Modelo clínico estándar' : 'Modelo Proyecto I+D'} />
          </div>
        </ReportSection>

        <ReportSection title="Contexto Clínico" icon={Stethoscope} onEdit={() => goToStep(3)}>
          <div className="space-y-6">
            <ReportItem label="Patología Diagnosticada" value={state.pathology || "No descrita"} />
            <ReportItem label="Objetivo de la Cirugía" value={state.objective || "No definido"} />
          </div>
        </ReportSection>

        <ReportSection title="Logística de Entrega" icon={Calendar} onEdit={() => goToStep(6)}>
          <div className="flex items-center gap-12">
            <ReportItem label="Fecha Programada" value={state.deliveryDate || "--"} />
            <ReportItem label="Hora Estimada" value={state.deliveryHour ? (state.deliveryHour === "24h" ? "Durante el día (24h)" : `${state.deliveryHour}h`) : "--"} />
            <div className={`px-4 py-2 rounded-[6px] border flex items-center gap-2.5 ${
              state.isUrgent ? "bg-amber-50 border-amber-200" : "bg-blue-50/30 border-blue-100"
            }`}>
              {state.isUrgent ? <Zap size={14} className="text-amber-500 fill-amber-500" /> : <Clock size={14} className="text-[#1a73e8]" />}
              <span className={`text-[12px] font-bold ${state.isUrgent ? "text-amber-700" : "text-[#1a73e8]"}`}>
                {state.isUrgent ? "Prioridad Urgente (24-48h)" : "Entrega Estándar (3-5 días)"}
              </span>
            </div>
          </div>
        </ReportSection>

        <ReportSection title="Estudios y Archivos" icon={FileUp} onEdit={() => goToStep(5)}>
          <div className="space-y-4">
            {state.studies.map((study) => (
              <div key={study.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                  <FileText size={14} className="text-gray-400" />
                  {study.name}
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  {study.files.map(file => (
                    <div key={file.id} className="text-[12px] text-gray-500 bg-gray-50 px-2 py-1 rounded-[4px] border border-gray-100 flex items-center gap-1.5">
                      <CheckCircle2 size={10} className="text-green-500" />
                      {file.name}
                    </div>
                  ))}
                  {study.files.length === 0 && <span className="text-[12px] text-gray-300 italic">No hay archivos cargados</span>}
                </div>
              </div>
            ))}
          </div>
        </ReportSection>
      </div>

      {/* FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white border-t border-[#DDDDDD] z-[150] flex items-center px-12 justify-end">
        <Button 
          onClick={handleSubmit}
          className="h-[52px] px-12 bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[8px] text-[16px] font-medium transition-all shadow-lg"
        >
          Confirmar y enviar
        </Button>
      </div>
    </div>
  );
}
