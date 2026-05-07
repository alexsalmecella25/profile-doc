"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  ShieldCheck, 
  Plus, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  PenTool, 
  ChevronDown,
  Mail,
  Send,
  Users,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewCase, MedicalStudy, MedicalFile } from "@/context/NewCaseContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function Step5Page() {
  const { state, setStudies, setIsIncomplete } = useNewCase();
  const [writingReportFor, setWritingReportFor] = React.useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [isInviting, setIsInviting] = React.useState(false);
  const [invitedStudyId, setInvitedStudyId] = React.useState<string | null>(null);
  const router = useRouter();

  const handleInvite = () => {
    setIsInviting(true);
    setTimeout(() => {
      setIsInviting(false);
      setShowInviteModal(false);
      setInviteEmail("");
    }, 1500);
  };

  const removeStudy = (id: string) => {
    const currentStudies = Array.isArray(state?.studies) ? state.studies : [];
    setStudies(currentStudies.filter(s => s.id !== id));
  };

  const updateStudyName = (id: string, name: string) => {
    const currentStudies = Array.isArray(state?.studies) ? state.studies : [];
    setStudies(currentStudies.map(s => s.id === id ? { ...s, name } : s));
  };

  const simulateUpload = (studyId: string, fileName: string, type: 'image' | 'report', size: number) => {
    // Close editor if open for this study
    setWritingReportFor(null);

    const fileId = Math.random().toString(36).substr(2, 9);
    const newFile: MedicalFile = {
      id: fileId,
      name: fileName,
      size,
      progress: 0,
      type,
      status: 'uploading'
    };

    const currentStudies = Array.isArray(state?.studies) ? state.studies : [];
    const updatedStudies = currentStudies.map(s => {
      if (s.id === studyId) {
        return { ...s, files: [...(Array.isArray(s.files) ? s.files : []), newFile] };
      }
      return s;
    });
    setStudies(updatedStudies);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 30;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        setStudies(prev => prev.map(s => ({
          ...s,
          files: s.files.map(f => f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f)
        })));
      } else {
        setStudies(prev => prev.map(s => ({
          ...s,
          files: s.files.map(f => f.id === fileId ? { ...f, progress: currentProgress } : f)
        })));
      }
    }, 400);
  };

  const removeFile = (studyId: string, fileId: string) => {
    setStudies(state.studies.map(s => {
      if (s.id === studyId) {
        return { ...s, files: s.files.filter(f => f.id !== fileId) };
      }
      return s;
    }));
  };

  const handleNext = (incomplete = false) => {
    setIsIncomplete(incomplete);
    router.push("/request-case/step-6");
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const [editingStudyId, setEditingStudyId] = React.useState<string | null>(null);
  const [expandedStudyId, setExpandedStudyId] = React.useState<string | null>('initial-study');

  const studies = Array.isArray(state?.studies) ? state.studies : [];
  const totalFiles = studies.reduce((acc, s) => acc + (Array.isArray(s?.files) ? s.files.length : 0), 0);

  const handleAddNewStudy = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newStudy: MedicalStudy = {
      id: newId,
      name: `Estudio médico ${studies.length + 1}`,
      files: []
    };
    setStudies([...studies, newStudy]);
    setExpandedStudyId(newId);
  };

  const toggleExpand = (id: string) => {
    setExpandedStudyId(expandedStudyId === id ? null : id);
  };

  return (
    <>
      <div className="w-full max-w-[850px] flex flex-col animate-in fade-in duration-500">
        <h1 className="text-[24px] font-semibold text-[#191A1C] mb-2 text-center">Estudios médicos</h1>
        <p className="text-[14px] text-[#393C40] mb-12 text-center">Gestione las pruebas diagnósticas (TAC, RM, informes) para este caso.</p>
        
        <div className="space-y-4">
          {studies.map((study, sIdx) => (
            <div key={study.id} className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm">
              <div 
                className={`px-8 py-5 flex items-center justify-between cursor-pointer transition-colors ${expandedStudyId === study.id ? "bg-gray-50/30 border-b border-gray-50" : "hover:bg-gray-50/30"}`}
                onClick={() => toggleExpand(study.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-[13px] font-bold">
                    {sIdx + 1}
                  </div>
                  <div className="flex flex-col">
                    {editingStudyId === study.id ? (
                      <input 
                        type="text"
                        value={study.name}
                        onChange={(e) => updateStudyName(study.id, e.target.value)}
                        onBlur={() => setEditingStudyId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingStudyId(null)}
                        className="bg-white border border-[#1a73e8] rounded-md px-2 py-0.5 text-[16px] font-semibold text-[#393C40] focus:outline-none w-[300px]"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3 className="text-[16px] font-semibold text-[#393C40]">{study.name}</h3>
                    )}
                    {expandedStudyId !== study.id && (
                      <span className="text-[12px] text-gray-400 font-medium">
                        {study.files.length} {study.files.length === 1 ? 'archivo' : 'archivos'} subidos
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingStudyId(study.id); }}
                    className="text-gray-400 hover:text-[#1a73e8] transition-colors p-2"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeStudy(study.id); }}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className={`text-gray-300 transition-transform duration-300 ${expandedStudyId === study.id ? "rotate-180" : ""}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              {expandedStudyId === study.id && (
                <div className="p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div 
                      onClick={() => simulateUpload(study.id, "Estudio_DICOM.zip", "image", 245000000)}
                      className="border border-[#A6B6C5] rounded-[20px] p-6 flex flex-col items-center justify-center text-center hover:border-[#1a73e8] hover:bg-blue-50/30 transition-all cursor-pointer group h-[140px]"
                    >
                      <ImageIcon size={24} className="text-[#1a73e8] mb-3" />
                      <span className="text-[16px] font-semibold text-[#393C40]">Añadir imágenes</span>
                      <span className="text-[14px] text-gray-400 mt-1 italic tracking-tight">Dicom, zip, stl</span>
                    </div>

                    <div 
                      onClick={() => simulateUpload(study.id, "Informe_Clinico.pdf", "report", 1200000)}
                      className="border border-[#A6B6C5] rounded-[20px] p-6 flex flex-col items-center justify-center text-center hover:border-[#1a73e8] hover:bg-blue-50/30 transition-all cursor-pointer group h-[140px]"
                    >
                      <FileText size={24} className="text-[#1a73e8] mb-3" />
                      <span className="text-[16px] font-semibold text-[#393C40]">Añadir informe</span>
                      <span className="text-[14px] text-gray-400 mt-1 italic tracking-tight">Pdf, doc, txt</span>
                    </div>

                    <div 
                      onClick={() => setWritingReportFor(writingReportFor === study.id ? null : study.id)}
                      className={`border rounded-[20px] p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group h-[140px] ${
                        writingReportFor === study.id ? "border-[#1a73e8] bg-blue-50/30" : "border-[#A6B6C5] hover:border-[#1a73e8] hover:bg-blue-50/30"
                      }`}
                    >
                      <PenTool size={24} className="text-[#1a73e8] mb-3" />
                      <span className="text-[16px] font-semibold text-[#393C40]">Redactar informe</span>
                      <span className="text-[14px] text-gray-400 mt-1 italic tracking-tight">Manual</span>
                    </div>
                  </div>

                  {!study.files.some(f => f.type === 'image') && (
                    <div className="flex items-center justify-center py-2">
                      <button 
                        onClick={() => {
                          setInvitedStudyId(study.id);
                          setShowInviteModal(true);
                        }}
                        className="flex items-center gap-2 text-[14px] font-medium text-[#1a73e8] hover:text-[#155ebd] transition-all bg-blue-50/50 hover:bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100 group/link"
                      >
                        <Users size={16} />
                        <span>¿No tiene las imágenes? Envíe un enlace de subida al equipo de documentación</span>
                        <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}

                  {writingReportFor === study.id && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <div className="bg-gray-50 border border-gray-100 rounded-[16px] p-4">
                        <textarea 
                          className="w-full min-h-[100px] bg-transparent border-none focus:outline-none text-[15px] text-[#393C40] resize-none"
                          placeholder="Redacte aquí los detalles clínicos relevantes..."
                          autoFocus
                        />
                        <div className="flex justify-end mt-4">
                          <Button 
                            onClick={() => {
                              simulateUpload(study.id, "Informe_Manual.txt", "report", 512);
                              setWritingReportFor(null);
                            }}
                            className="bg-[#1a73e8] text-white rounded-[8px] h-9 px-6 text-[13px]"
                          >Guardar informe</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {(study.files || []).length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-50">
                      {study.files.map(file => (
                        <div key={file.id} className="flex flex-col gap-3 p-4 rounded-[12px] border border-gray-100 bg-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                {file.type === 'image' ? <ImageIcon size={18} className="text-[#1a73e8]" /> : <FileText size={18} className="text-[#1a73e8]" />}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[15px] font-semibold text-[#393C40]">{file.name}</span>
                                <span className="text-[13px] text-gray-400">{formatSize(file.size)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {file.status === 'uploading' ? (
                                <span className="text-[13px] font-bold text-[#1a73e8]">{Math.round(file.progress)}%</span>
                              ) : (
                                <CheckCircle2 size={18} className="text-green-500" />
                              )}
                              <button onClick={() => removeFile(study.id, file.id)} className="text-gray-300 hover:text-red-500">
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                          {file.status === 'uploading' && (
                            <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                              <div className="h-full bg-[#1a73e8] transition-all duration-300" style={{ width: `${file.progress}%` }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {studies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[20px] shadow-sm animate-in fade-in duration-500">
              <UploadCloud size={48} className="text-gray-300 mb-6" />
              <h3 className="text-[18px] font-semibold text-[#393C40] mb-2">No hay estudios médicos añadidos</h3>
              <p className="text-[14px] text-gray-400 mb-8 text-center max-w-[300px]">Suba imágenes o informes clínicos para que nuestro equipo pueda procesar el caso.</p>
              <Button 
                onClick={handleAddNewStudy}
                className="bg-[#1a73e8] text-white hover:bg-[#155ebd] rounded-[12px] h-[52px] px-8 font-medium"
              >
                <Plus size={20} className="mr-2" />
                Añadir primer estudio médico
              </Button>
            </div>
          )}

          {studies.length > 0 && (
            <button 
              onClick={handleAddNewStudy}
              className="w-full h-[60px] border border-dashed border-[#A6B6C5] rounded-[20px] flex items-center justify-center gap-2 text-[#393C40] hover:border-[#1a73e8] hover:text-[#1a73e8] hover:bg-blue-50/20 transition-all font-semibold text-[15px]"
            >
              <Plus size={20} />
              Añadir otro estudio médico
            </button>
          )}
        </div>
      </div>

      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-w-[450px] p-8 rounded-[8px] gap-6 bg-white border-none shadow-2xl">
          <DialogHeader>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1a73e8]">
              <Mail size={24} />
            </div>
            <DialogTitle className="text-[20px] font-bold text-[#191A1C]">Gestionar subida externa</DialogTitle>
            <DialogDescription className="text-[14px] text-gray-500 leading-relaxed pt-1">
              Enviaremos un email con un enlace de subida al equipo de documentación. Ellos podrán adjuntar las imágenes a este estudio sin que usted tenga que intervenir.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Email del equipo de documentación</label>
              <input 
                type="email"
                placeholder="documentacion@hospital.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full h-[52px] px-4 rounded-[8px] border border-[#DDDDDD] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button 
              variant="ghost"
              onClick={() => setShowInviteModal(false)}
              className="w-full sm:w-auto px-6 h-11 rounded-[8px] text-gray-500 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleInvite}
              disabled={!inviteEmail || isInviting}
              className="w-full sm:w-auto px-8 h-11 bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[8px] font-bold flex items-center gap-2"
            >
              {isInviting ? (
                <>Generando enlace...</>
              ) : (
                <>
                  <Send size={16} />
                  Enviar enlace de subida
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full h-[100px] bg-white/80 backdrop-blur-md border-t border-[#DDDDDD] z-[150] flex items-center px-12 justify-between">
        <button 
          onClick={() => handleNext(true)}
          className="flex items-center gap-2 text-[#1a73e8] hover:bg-blue-50 px-6 py-3 rounded-[12px] font-semibold transition-all group"
        >
          <AlertCircle size={20} className="group-hover:rotate-12 transition-transform" />
          Solicitar como incompleto
        </button>
        
        <Button 
          onClick={() => handleNext(false)}
          disabled={totalFiles === 0}
          className="h-[52px] px-10 bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[12px] text-[16px] font-medium transition-all disabled:opacity-50"
        >
          Continuar
        </Button>
      </div>
    </>
  );
}
