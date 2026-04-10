import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, MoreHorizontal, ExternalLink, Trash2, ChevronDown, Plus, DownloadCloud, ArrowDownToLine } from "lucide-react";

export function CaseDetailsSidebar({
    open,
    onOpenChange,
    caseData,
    onOpenVisualizer
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    caseData: any;
    onOpenVisualizer?: () => void;
}) {
    if (!caseData) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* 
        To achieve the exact 8px margin from the browser edges:
        We override the native SheetContent positioning classes by dropping right-0/top-0/bottom-0,
        adding specific floating classes with an 8px inset.
      */}
            <SheetContent
                className="fixed inset-y-2 right-2 z-50 w-full sm:max-w-md md:max-w-[500px] xl:max-w-[600px] flex flex-col gap-0 border border-ai-border shadow-2xl rounded-[8px] p-0 bg-white dark:bg-[#131416] text-[#393c40] dark:text-ai-text transition-transform duration-300 ease-in-out data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full"
                showCloseButton={false}
            >
                {/* Header */}
                <div className="h-[64px] border-b border-[#e4e7e9] dark:border-ai-border flex items-center justify-between px-6 shrink-0 bg-white dark:bg-[#131416] rounded-t-[8px] z-10">
                    <div className="w-[88px]" /> {/* Spacer for centering */}
                    <SheetTitle className="text-[16px] font-['Lato',sans-serif] font-bold text-[#393c40] dark:text-ai-text flex-1 text-center">
                        Detalles del caso
                    </SheetTitle>
                    <div className="flex items-center gap-2 w-[88px] justify-end">
                        <Button variant="ghost" size="icon" className="h-[28px] w-[28px] text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1 rounded-full">
                            <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-[28px] w-[28px] text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1 rounded-full">
                            <MoreHorizontal size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-[28px] w-[28px] text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1 rounded-full"
                            onClick={() => onOpenChange(false)}
                        >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.1929 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.1929 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-44">
                    <div className="flex flex-col gap-8 pt-6">

                        {/* Header Info */}
                        <div className="flex flex-col gap-4 items-start">
                            <div className="flex flex-col gap-1 items-start w-full font-['Lato',sans-serif]">
                                <span className="text-[16px] text-[#40454a] dark:text-ai-text-secondary leading-normal">{caseData.clave || "ID24593"}</span>
                                <p className="text-[14px] text-[#40454a] dark:text-ai-text-secondary leading-[20px] mt-1">
                                    {caseData.subClave || "General"} - {caseData.subProyecto || "Hepatobiliopancreática"}
                                </p>
                                <p className="text-[16px] font-bold text-[#191a1c] dark:text-ai-text leading-[24px]">
                                    {caseData.proyecto || "Desmoplastic tumor intraabdominal"} {caseData.subProyecto || "JER AN1309531635"}
                                </p>
                            </div>

                            {/* Status Pill */}
                            <div className="bg-[#f4f4f4] dark:bg-ai-surface border border-transparent dark:border-ai-border inline-flex items-center gap-2 rounded-lg px-2 py-1">
                                <div className={`w-[8px] h-[8px] rounded-full ${caseData.status === 'Completed' ? 'bg-ai-success' :
                                    caseData.status === 'Pending' ? 'bg-gray-300 dark:bg-[#e3e3e3]' :
                                        caseData.status === 'In progress' ? 'bg-[#fbbc04]' :
                                            caseData.status === 'Blocked' ? 'bg-red-500' : 'bg-[#191a1c] dark:bg-ai-text'
                                    }`} />
                                <span className="text-[#191a1c] dark:text-ai-text font-semibold text-[12px] font-['Inter',sans-serif]">{caseData.status || "Completed"}</span>
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-[#ccd2d5] dark:bg-ai-border" />

                        {/* Additional Info */}
                        <div className="flex flex-col gap-4 font-['Lato',sans-serif]">
                            <h3 className="text-[16px] font-bold text-[#393c40] dark:text-ai-text">Additional information</h3>

                            <div className="flex flex-col gap-2">
                                <span className="text-[14px] font-bold text-[#393c40] dark:text-ai-text">Requester</span>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[16px] font-bold text-[#393c40] dark:text-ai-text">Dr. Cella Medical Solutions</span>
                                    <span className="text-[14px] font-medium text-[#40454a] dark:text-ai-text-secondary font-['Inter',sans-serif]">University Clinical Hospital</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[14px] font-bold text-[#393c40] dark:text-ai-text">Request date</span>
                                    <span className="text-[14px] text-[#393c40] dark:text-ai-text">07/31/2025</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[14px] font-bold text-[#393c40] dark:text-ai-text">Est. delivery date</span>
                                    <span className="text-[14px] text-[#393c40] dark:text-ai-text">08/05/2025</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 mt-2">
                                <span className="text-[16px] font-bold text-[#393c40] dark:text-ai-text">Stated objectives</span>
                                <p className="text-[14px] leading-[20px] text-[#393c40] dark:text-ai-text">
                                    Evaluate the volume of each tumor to determine the depth of the two lesions observed in the right kidney. Need to review the tumor's relationship with the renal excretory system... (<span className="underline cursor-pointer">See more</span>)
                                </p>
                            </div>
                        </div>

                        {/* Docs & Accents */}
                        <div className="flex flex-col gap-6 font-['Lato',sans-serif]">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[16px] font-bold text-[#393c40] dark:text-ai-text">Clinical documentation & imaging</h3>
                                <p className="text-[14px] text-[#495055] dark:text-ai-text-secondary">
                                    Attach the necessary documentation so we can begin building the model for this case.
                                </p>
                            </div>

                            {/* Acc. 1 */}
                            <div className="flex flex-col w-full">
                                <div className="flex items-center justify-between pb-4 border-b-[0.5px] border-[#a6b6c5] dark:border-ai-border cursor-pointer">
                                    <span className="text-[16px] font-bold text-[#191a1c] dark:text-ai-text">CT Scan 1</span>
                                    <ChevronDown size={14} className="text-[#393c40] dark:text-ai-text" />
                                </div>

                                <div className="flex flex-col w-full">
                                    {/* Item 1 */}
                                    <div className="flex items-center justify-between py-2 border-b-[0.5px] border-[#a6b6c5] dark:border-ai-border hover:bg-[#f5f6f6] dark:hover:bg-ai-hover-1 transition-colors">
                                        <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                                            <div className="w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0 relative bg-gray-200">
                                                {/* Placeholder thumbnail */}
                                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center brightness-75 contrast-125 mix-blend-multiply" />
                                            </div>
                                            <div className="flex flex-col justify-center px-1 min-w-0 flex-1">
                                                <span className="text-[12px] text-[#393c40] dark:text-ai-text truncate">ST0141659</span>
                                                <span className="text-[12px] text-[#9fa2a7]">2.34GB</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="w-[24px] h-[24px] rounded-full bg-[#d9d9d9] dark:bg-ai-border flex items-center justify-center font-['Inter',sans-serif] font-semibold text-[10px] text-[#4a4545] dark:text-ai-text">AS</div>
                                            <Trash2 size={14} className="text-[#393c40] dark:text-ai-text-secondary cursor-pointer hover:text-red-500" />
                                            <ExternalLink size={14} className="text-[#393c40] dark:text-ai-text-secondary cursor-pointer hover:text-[#191a1c] dark:hover:text-ai-text" />
                                        </div>
                                    </div>

                                    {/* Item 2 PDF */}
                                    <div className="flex items-center justify-between py-2 border-b-[0.5px] border-[#a6b6c5] dark:border-ai-border hover:bg-[#f5f6f6] dark:hover:bg-ai-hover-1 transition-colors">
                                        <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                                            <div className="w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-[#f5f6f6] border border-[#e4e7e9] dark:border-ai-border dark:bg-ai-surface">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#a6b6c5]"><path d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </div>
                                            <div className="flex flex-col justify-center px-1 min-w-0 flex-1">
                                                <span className="text-[12px] text-[#555f65] dark:text-ai-text truncate">Informe TC 19-08-2025 AN177232856.pdf</span>
                                                <span className="text-[12px] text-[#9fa2a7]">12MB</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="w-[24px] h-[24px] rounded-full bg-[#d9d9d9] dark:bg-ai-border flex items-center justify-center font-['Inter',sans-serif] font-semibold text-[10px] text-[#4a4545] dark:text-ai-text">AS</div>
                                            <Trash2 size={14} className="text-[#393c40] dark:text-ai-text-secondary cursor-pointer hover:text-red-500" />
                                            <ExternalLink size={14} className="text-[#393c40] dark:text-ai-text-secondary cursor-pointer hover:text-[#191a1c] dark:hover:text-ai-text" />
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="flex items-center justify-between py-2 border-b-[0.5px] border-[#a6b6c5] dark:border-ai-border hover:bg-[#f5f6f6] dark:hover:bg-ai-hover-1 transition-colors">
                                        <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                                            <div className="w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0 relative bg-gray-200">
                                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center brightness-75 contrast-125 mix-blend-multiply" />
                                            </div>
                                            <div className="flex flex-col justify-center px-1 min-w-0 flex-1">
                                                <span className="text-[12px] text-[#393c40] dark:text-ai-text truncate">ST0141659</span>
                                                <span className="text-[12px] text-[#9fa2a7]">2.34GB</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="w-[24px] h-[24px] rounded-full bg-[#d9d9d9] dark:bg-ai-border flex items-center justify-center font-['Inter',sans-serif] font-semibold text-[10px] text-[#4a4545] dark:text-ai-text">AS</div>
                                            <Trash2 size={14} className="text-[#393c40] dark:text-ai-text-secondary cursor-pointer hover:text-red-500" />
                                            <ExternalLink size={14} className="text-[#393c40] dark:text-ai-text-secondary cursor-pointer hover:text-[#191a1c] dark:hover:text-ai-text" />
                                        </div>
                                    </div>

                                    {/* Item 4 */}
                                    <div className="flex items-center justify-between py-2 border-b-[0.5px] border-[#a6b6c5] dark:border-ai-border hover:bg-[#f5f6f6] dark:hover:bg-ai-hover-1 transition-colors">
                                        <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                                            <div className="w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0 relative bg-gray-200">
                                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center brightness-75 contrast-125 mix-blend-multiply" />
                                            </div>
                                            <div className="flex flex-col justify-center px-1 min-w-0 flex-1">
                                                <span className="text-[12px] text-[#393c40] dark:text-ai-text truncate">ST0141659</span>
                                                <span className="text-[12px] text-[#9fa2a7]">2.34GB</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="w-[24px] h-[24px] rounded-full bg-[#d9d9d9] dark:bg-ai-border flex items-center justify-center font-['Inter',sans-serif] font-semibold text-[10px] text-[#4a4545] dark:text-ai-text">AS</div>
                                            <Trash2 size={14} className="text-[#393c40] dark:text-ai-text-secondary cursor-pointer hover:text-red-500" />
                                            <ExternalLink size={14} className="text-[#393c40] dark:text-ai-text-secondary cursor-pointer hover:text-[#191a1c] dark:hover:text-ai-text" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 pb-4 cursor-pointer">
                                    <span className="text-[16px] font-bold text-[#191a1c] dark:text-ai-text">Tomografía computarizada 2</span>
                                    <ChevronDown size={14} className="text-[#393c40] dark:text-ai-text" />
                                </div>

                                <div className="bg-[rgba(166,182,197,0.1)] dark:bg-ai-surface dark:border dark:border-ai-border hover:bg-[rgba(166,182,197,0.2)] dark:hover:bg-ai-hover-1 transition-colors h-[48px] rounded-full flex items-center justify-center gap-2 cursor-pointer w-full mt-2">
                                    <Plus size={12} className="text-[#555f65] dark:text-ai-text-secondary" />
                                    <span className="text-[12px] text-[#555f65] dark:text-ai-text-secondary">Add study</span>
                                </div>
                            </div>

                            {/* User Info & Downloads */}
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[16px] font-bold text-[#393c40] dark:text-ai-text">User information</h3>
                                    <p className="text-[14px] text-[#495055] dark:text-ai-text-secondary">
                                        Important case documentation and generated files.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {["Instructions for use (.pdf)", "Medical device label (.pdf)", "Declaration of conformity (.pdf)", "3D Files (.stl)"].map((label, idx) => (
                                        <div key={idx} className="bg-[#f5f6f6] dark:bg-ai-surface border border-[#e4e7e9] dark:border-ai-border flex items-center justify-center gap-[4px] px-[10px] py-[4px] rounded-full cursor-pointer hover:bg-white dark:hover:bg-ai-hover-1 transition-colors">
                                            <span className="text-[12px] text-[#555f65] dark:text-ai-text-secondary">{label}</span>
                                            <ArrowDownToLine size={12} className="text-[#555f65] dark:text-ai-text-secondary ml-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Physical Tracking */}
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[16px] font-bold text-[#393c40] dark:text-ai-text">Physical model tracking</h3>
                                <div className="flex items-center gap-2 cursor-pointer group">
                                    <span className="text-[14px] text-[#393c40] dark:text-ai-text group-hover:underline">PQ45JNV89Y75RX42</span>
                                    <ExternalLink size={14} className="text-[#393c40] dark:text-ai-text" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Floating Actions Sticky Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 bg-gradient-to-t from-white via-white to-transparent dark:from-[#131416] dark:via-[#131416] dark:to-transparent pb-6 rounded-b-[8px] pointer-events-none">
                    <div className="pointer-events-auto flex flex-col gap-2 w-full pt-10">
                        <Button
                            className="w-full bg-[#1a73e8] hover:bg-[#155ebd] text-white dark:bg-[#a8c7fa] dark:text-[#041e49] dark:hover:bg-[#d3e3fd] rounded-lg h-[44px] font-bold text-[14px] flex items-center justify-center gap-2 border-none shadow-sm transition-colors"
                            onClick={onOpenVisualizer}
                        >
                            Open 3D Viewer <ExternalLink size={14} />
                        </Button>
                        <Button variant="outline" className="w-full bg-[rgba(166,182,197,0.1)] dark:bg-ai-surface hover:bg-[rgba(166,182,197,0.2)] dark:hover:bg-ai-hover-1 text-[#a6b6c5] dark:text-ai-text border-none rounded-lg h-[44px] font-bold text-[14px] flex items-center justify-center gap-2 shadow-none">
                            Download model .pdf <DownloadCloud size={14} />
                        </Button>
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    )
}
