"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface MedicalFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  type: 'image' | 'report';
  status: 'uploading' | 'completed' | 'error';
}

export interface MedicalStudy {
  id: string;
  name: string;
  files: MedicalFile[];
}

export interface NewCaseState {
  selectedModel: "standard" | "rd" | null;
  selectedSpecialty: string | null;
  traceabilityId: string;
  pathology: string;
  objective: string;
  studies: MedicalStudy[];
  isIncomplete: boolean;
  deliveryDate: string | null;
  deliveryHour: string | null;
  isUrgent: boolean;
}

interface NewCaseContextType {
  state: NewCaseState;
  setSelectedModel: (model: "standard" | "rd" | null) => void;
  setSelectedSpecialty: (specialty: string | null) => void;
  setTraceabilityId: (id: string) => void;
  setPathology: (pathology: string) => void;
  setObjective: (objective: string) => void;
  setStudies: (studies: MedicalStudy[] | ((prev: MedicalStudy[]) => MedicalStudy[])) => void;
  setIsIncomplete: (isIncomplete: boolean) => void;
  setDeliveryDate: (date: string | null) => void;
  setDeliveryHour: (hour: string | null) => void;
  setIsUrgent: (isUrgent: boolean) => void;
  resetState: () => void;
}

const initialState: NewCaseState = {
  selectedModel: null,
  selectedSpecialty: null,
  traceabilityId: "",
  pathology: "",
  objective: "",
  studies: [
    {
      id: 'initial-study',
      name: 'Estudio Médico 1',
      files: []
    }
  ],
  isIncomplete: false,
  deliveryDate: null,
  deliveryHour: null,
  isUrgent: false
};

const NewCaseContext = createContext<NewCaseContextType | undefined>(undefined);

export function NewCaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NewCaseState>(initialState);

  const setSelectedModel = (model: "standard" | "rd" | null) => setState((s) => ({ ...s, selectedModel: model }));
  const setSelectedSpecialty = (specialty: string | null) => setState((s) => ({ ...s, selectedSpecialty: specialty }));
  const setTraceabilityId = (id: string) => setState((s) => ({ ...s, traceabilityId: id }));
  const setPathology = (pathology: string) => setState((s) => ({ ...s, pathology: pathology }));
  const setObjective = (objective: string) => setState(prev => ({ ...prev, objective }));
  const setStudies = (studies: MedicalStudy[] | ((prev: MedicalStudy[]) => MedicalStudy[])) => {
    setState(prev => ({
      ...prev,
      studies: typeof studies === 'function' ? studies(prev.studies) : studies
    }));
  };
  const setIsIncomplete = (isIncomplete: boolean) => setState(prev => ({ ...prev, isIncomplete }));
  const setDeliveryDate = (deliveryDate: string | null) => setState(prev => ({ ...prev, deliveryDate }));
  const setDeliveryHour = (deliveryHour: string | null) => setState(prev => ({ ...prev, deliveryHour }));
  const setIsUrgent = (isUrgent: boolean) => setState(prev => ({ ...prev, isUrgent }));
  
  const resetState = () => setState(initialState);

  return (
    <NewCaseContext.Provider value={{
      state,
      setSelectedModel,
      setSelectedSpecialty,
      setTraceabilityId,
      setPathology,
      setObjective,
      setStudies,
      setIsIncomplete,
      setDeliveryDate,
      setDeliveryHour,
      setIsUrgent,
      resetState
    }}>
      {children}
    </NewCaseContext.Provider>
  );
}

export function useNewCase() {
  const context = useContext(NewCaseContext);
  if (context === undefined) {
    throw new Error("useNewCase must be used within a NewCaseProvider");
  }
  return context;
}
