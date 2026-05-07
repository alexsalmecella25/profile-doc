"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CellaLogo } from "@/components/CellaLogo";
import { NewCaseProvider } from "@/context/NewCaseContext";

import { X, AlertCircle } from "lucide-react";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

export default function RequestCaseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showExitModal, setShowExitModal] = React.useState(false);

  // Determine current step based on URL
  const stepMatch = pathname?.match(/step-(\d+)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1;

  const handleBack = () => {
    if (currentStep === 1) {
      setShowExitModal(true);
    } else {
      router.push(`/request-case/step-${currentStep - 1}`);
    }
  };

  const confirmExit = () => {
    setShowExitModal(false);
    router.push("/");
  };

  return (
    <NewCaseProvider>
      <div className="fixed inset-0 bg-white dark:bg-[#0D0E10] z-[100] flex flex-col font-sans overflow-hidden">
        {/* TOPBAR - 88px, NO BORDER */}
        <div className="h-[88px] px-12 flex items-center justify-between bg-white dark:bg-ai-surface shrink-0 z-[110]">
          <div 
            className="flex items-center w-[200px] cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => setShowExitModal(true)}
          >
            <CellaLogo height={38} hideText={true} />
          </div>

          {/* PROGRESS TRACKER */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[12px] font-medium text-ai-text-tertiary uppercase tracking-wider">Paso {currentStep} de 7</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div 
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === currentStep ? "w-6 bg-[#1a73e8]" : s < currentStep ? "w-1.5 bg-[#1a73e8]/40" : "w-1.5 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-[200px] flex justify-end">
            <Button 
              variant="secondary"
              onClick={handleBack}
              className="bg-[#F4F4F5] hover:bg-gray-200 text-ai-text border-none px-6 font-medium"
            >Atrás</Button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center min-h-full py-12">
            {children}
          </div>
        </div>

        {/* EXIT CONFIRMATION DIALOG (SHADCN ALERT STYLE) */}
        <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
          <DialogContent className="max-w-[450px] p-6 rounded-[8px] gap-6 bg-white border-none shadow-2xl">
            <DialogHeader className="text-center sm:text-left gap-2">
              <DialogTitle className="text-[18px] font-semibold text-[#191A1C]">
                ¿Desea salir de la solicitud?
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Si sale ahora, perderá todo el progreso actual de esta solicitud. Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button 
                variant="ghost"
                onClick={() => setShowExitModal(false)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-all h-9 px-4 py-2 border bg-white shadow-sm hover:bg-gray-50 text-[#222222]"
              >
                Cancelar
              </Button>
              <Button 
                onClick={confirmExit}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-all h-9 px-4 py-2 bg-[#1a73e8] text-white hover:bg-[#155ebd] shadow-sm"
              >
                Salir de la solicitud
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </NewCaseProvider>
  );
}
