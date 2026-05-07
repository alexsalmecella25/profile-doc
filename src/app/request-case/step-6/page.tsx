"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  CheckCircle2, 
  Zap,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewCase } from "@/context/NewCaseContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Simulated hours for selection
const availableHours = ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"];

export default function Step6Page() {
  const { state, setDeliveryDate, setDeliveryHour, setIsUrgent } = useNewCase();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = React.useState(0); 
  const [tempDate, setTempDate] = React.useState<string | null>(null);
  const [showHoursModal, setShowHoursModal] = React.useState(false);

  // Today is May 7, 2026
  const today = new Date(2026, 4, 7);

  const months = [
    { name: "Mayo 2026", days: 31, offset: 4, monthIdx: 4 }, // May
    { name: "Junio 2026", days: 30, offset: 0, monthIdx: 5 }, // June
    { name: "Julio 2026", days: 31, offset: 2, monthIdx: 6 }, // July
    { name: "Agosto 2026", days: 31, offset: 5, monthIdx: 7 }, // August
    { name: "Septiembre 2026", days: 30, offset: 1, monthIdx: 8 }, // September
  ];

  const getAvailabilityForDate = (day: number) => {
    const monthObj = months[currentMonth];
    const checkDate = new Date(2026, monthObj.monthIdx, day);
    
    if (checkDate < today) return { status: 'full', label: 'No disponible' };

    const diffTime = checkDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (state.isUrgent) {
      if (diffDays < 1) return { status: 'full', label: 'No disponible' };
    } else {
      // Standard: minimum 3 days
      if (diffDays < 3) return { status: 'full', label: 'No disponible' };
    }

    if (day % 5 === 0) return { status: 'high', label: 'Carga alta' };
    return { status: 'available', label: 'Disponible' };
  };

  const handleDateClick = (dateKey: string) => {
    setTempDate(dateKey);
    setShowHoursModal(true);
  };

  const confirmTime = (hour: string) => {
    setDeliveryDate(tempDate);
    setDeliveryHour(hour);
    setShowHoursModal(false);
  };

  const handleNext = () => {
    router.push("/request-case/step-7");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-full max-w-[1000px] flex flex-col mb-10 animate-in fade-in duration-500">
        <style jsx>{`
          .striped-bg {
            background-color: white;
            background-image: repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              #f3f4f6 10px,
              #f3f4f6 11px
            );
          }
        `}</style>

        <div className="mb-10">
          <h1 className="text-[28px] font-bold text-[#222222]">Producción y entrega</h1>
        </div>

        <div className="space-y-10 flex-1">
          {/* CALENDAR SECTION */}
          <div className="bg-transparent">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F7F7F7]">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#222222]">{months[currentMonth].name}</h2>
                <div className="flex gap-0.5">
                  <button 
                    onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
                    disabled={currentMonth === 0}
                    className="p-1 hover:bg-[#F7F7F7] rounded-[8px] transition-colors text-gray-400 disabled:opacity-20"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={() => setCurrentMonth(Math.min(months.length - 1, currentMonth + 1))}
                    disabled={currentMonth === months.length - 1}
                    className="p-1 hover:bg-[#F7F7F7] rounded-[8px] transition-colors text-gray-400 disabled:opacity-20"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* FUSED DELIVERY INFO & URGENCY ALIGNED RIGHT */}
              <div className={`flex items-center gap-4 px-4 py-1.5 rounded-[8px] border transition-all ${
                state.isUrgent ? "bg-amber-50 border-amber-200" : "bg-blue-50/50 border-blue-100"
              }`}>
                <div className="flex items-center gap-2.5">
                  {state.isUrgent ? <Zap size={15} className="text-amber-500 fill-amber-500" /> : <Clock size={15} className="text-[#1a73e8]" />}
                  <span className={`text-[12px] font-normal ${state.isUrgent ? "text-amber-700" : "text-[#1a73e8]"}`}>
                    {state.isUrgent ? "Entrega URGENTE (24-48h)" : "Entrega estándar (3-5 días)"}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 hover:text-[#1a73e8] transition-colors cursor-pointer outline-none">
                          <HelpCircle size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={5} className="bg-[#222222] text-white border-none p-3 max-w-[220px] rounded-[8px] shadow-xl z-[200]">
                        <p className="text-[12px] leading-relaxed">Los casos marcados como urgentes podrán ser entregados en un plazo de 24 a 48 horas.</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-[12px] font-medium text-gray-600">Caso urgente</span>
                  </div>
                  <button 
                    onClick={() => setIsUrgent(!state.isUrgent)}
                    className="w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 outline-none"
                    style={{ backgroundColor: state.isUrgent ? '#1a73e8' : '#e5e7eb' }}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${state.isUrgent ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-[#DDDDDD] border border-[#DDDDDD] rounded-[8px] overflow-hidden">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                <div key={d} className="bg-[#F7F7F7] text-center text-[10px] font-bold text-gray-400 py-3 uppercase tracking-widest">{d}</div>
              ))}
              {[...Array(months[currentMonth].offset)].map((_, i) => <div key={`empty-${i}`} className="bg-white h-[100px] striped-bg opacity-50" />)}
              {[...Array(months[currentMonth].days)].map((_, i) => {
                const day = i + 1;
                const slot = getAvailabilityForDate(day);
                const dateKey = `2026-0${months[currentMonth].monthIdx + 1}-${day.toString().padStart(2, '0')}`;
                const isSelected = state.deliveryDate === dateKey;
                const isFull = slot.status === 'full';
                
                return (
                  <button
                    key={day}
                    disabled={isFull}
                    onClick={() => handleDateClick(dateKey)}
                    className={`
                      relative h-[100px] transition-all flex flex-col items-center justify-center p-2 group
                      ${isFull ? 'striped-bg cursor-not-allowed' : 'bg-white hover:bg-[#F7F7F7]'}
                      ${isSelected ? 'ring-2 ring-inset ring-[#1a73e8] z-10 bg-white' : ''}
                    `}
                  >
                    <span className={`text-[18px] font-bold ${isFull ? 'text-gray-400' : isSelected ? 'text-[#1a73e8]' : 'text-gray-400'}`}>
                      {day}
                    </span>
                    <div className={`font-bold mt-1.5 ${
                      isSelected && state.deliveryHour 
                        ? "text-[16px] text-[#222222]" 
                        : "text-[12px] " + (slot.status === 'available' ? 'text-[#00A699]' : slot.status === 'high' ? 'text-[#FC642D]' : 'text-gray-300')
                    }`}>
                      {isSelected && state.deliveryHour 
                        ? (state.deliveryHour === "24h" ? "24h" : `${state.deliveryHour}h`) 
                        : (isFull ? slot.label : slot.label)}
                    </div>

                    {isSelected && state.deliveryHour && (
                      <div className="absolute top-3 right-3 text-[#1a73e8]">
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* HOURS MODAL */}
        <Dialog open={showHoursModal} onOpenChange={setShowHoursModal}>
          <DialogContent className="max-w-[420px] p-8 rounded-[8px] gap-6 bg-white border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-[20px] font-bold text-[#222222]">Franja de entrega</DialogTitle>
              <DialogDescription className="text-[14px] text-gray-500 pt-1">
                Seleccione una hora específica o la opción de entrega durante el día.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <button
                onClick={() => confirmTime("24h")}
                className={`
                  w-full h-[60px] rounded-[8px] border-2 transition-all flex items-center justify-center gap-3 text-[16px] font-bold
                  ${state.deliveryHour === "24h" 
                    ? "border-[#1a73e8] bg-blue-50 text-[#1a73e8]" 
                    : "border-[#DDDDDD] text-[#222222] hover:border-[#222222]"
                  }
                `}
              >
                <CalendarDays size={20} />
                Durante el día
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#F7F7F7]" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-300 bg-white px-2">O seleccionar hora</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {availableHours.map(hour => (
                  <button
                    key={hour}
                    onClick={() => confirmTime(hour)}
                    className="h-[52px] rounded-[8px] border border-[#DDDDDD] text-[14px] font-bold text-[#222222] hover:border-[#1a73e8] hover:bg-blue-50 transition-all flex items-center justify-center"
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* FIXED BOTTOM BAR - Reduced Height */}
        <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white border-t border-[#DDDDDD] z-[150] flex items-center px-12 justify-end">
          <Button 
            onClick={handleNext}
            disabled={!state.deliveryDate || !state.deliveryHour}
            className="h-[52px] px-12 bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[8px] text-[16px] font-medium transition-all disabled:opacity-50"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
