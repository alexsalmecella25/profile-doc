const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. HomeDataRow - Restoration of state and Dropdown
// We need to find HomeDataRow and inject:
// - Modal states (Move, Share, Invite)
// - Modal logic (handleMove, handleShare, handleInvite, handleCopy)
// - ID size (14px)
// - Author column logic
// - Full Dropdown

const homeDataRowStartLine = content.indexOf('function HomeDataRow({');
const homeDataRowEndLine = content.indexOf('function ProjectsView({');

if (homeDataRowStartLine > -1) {
  const newHomeDataRow = `function HomeDataRow({
  clave, subClave, proyecto, subProyecto, date, avatars, status, subStatus, statusColor, showEdit, isLink, disabled, onViewDetails, onViewModel, onDelete
}: {
  clave: string; subClave: string; proyecto: string; subProyecto: string; date: string; avatars: { initials: string; name: string }[]; status: string; subStatus: string; statusColor: string; showEdit?: boolean; isLink?: boolean; disabled?: boolean; onViewDetails?: (caseData: any) => void; onViewModel?: (caseData: any) => void; onDelete?: () => void;
}) {
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveStep, setMoveStep] = useState<'select' | 'create'>('select');
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [newProjectName, setNewProjectName] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSearch, setInviteSearch] = useState("");
  const [collaborators, setCollaborators] = useState<{ initials: string; name: string; email: string; role: string; color: string }[]>([
    { initials: 'CM', name: 'Claudio Martínez', email: 'claudio@hospital.es', role: 'Owner', color: 'bg-purple-600' },
    { initials: 'LR', name: 'Laura Ruiz', email: 'laura@hospital.es', role: 'Editor', color: 'bg-blue-600' },
    { initials: 'PG', name: 'Pedro García', email: 'pedro@hospital.es', role: 'Viewer', color: 'bg-teal-600' },
  ]);

  const handleMoveClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIsMoveOpen(true); setMoveStep('select'); };
  const handleShareClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIsShareOpen(true); };
  const handleInviteClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIsInviteOpen(true); };
  const handleCopyLink = () => { navigator.clipboard.writeText(\`https://cella.studio/case/\${clave.toLowerCase().replace(/\\s+/g, '-')}\`); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  return (
    <TableRow className={\`border-b border-ai-border hover:bg-gray-50/50 dark:hover:bg-white/[0.02] h-[60px] cursor-pointer transition-colors \${disabled ? "opacity-50" : ""}\`}>
      <TableCell className="font-medium text-ai-text px-4">
        <div className="flex flex-col gap-1 items-start">
          <span className="cursor-pointer hover:text-blue-600 transition-colors font-semibold text-[14px]">{proyecto}</span>
          <div className="flex items-center gap-2 text-[14px] text-ai-text-secondary font-mono">
            <span>{clave}</span>
            <span className="text-ai-border-strong">•</span>
            <span>{subProyecto}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-ai-text text-[13px]">{date}</TableCell>
      <TableCell className="px-4">
        <div className="flex -space-x-2">
          {/* Creator Avatar with Tooltip */}
          {avatars.length > 0 && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-[30px] h-[30px] border-2 border-white dark:border-[#131416] bg-ai-border cursor-pointer transition-transform hover:scale-110 z-20">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center m-0 p-0">{avatars[0]?.initials}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white border-none shadow-lg text-[13px]">
                   <div className="flex flex-col">
                      <p className="font-bold">{avatars[0]?.name}</p>
                      <p className="text-[11px] opacity-70">Creator</p>
                   </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Shared indicator Avatar */}
          {avatars.length > 1 && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsShareOpen(true); }}
                    className="w-[30px] h-[30px] rounded-full border-2 border-white dark:border-[#131416] bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center cursor-pointer transition-transform hover:scale-110 z-10 hover:z-30 text-ai-text-secondary font-medium text-[11px]"
                  >
                    +{avatars.length - 1}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white border-none shadow-lg text-[13px]">
                  <p>Shared with {avatars.length - 1} more</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
      <TableCell className="max-w-[220px]">
        <div className="flex items-center min-w-0 w-full">
          <div onClick={(e) => { if (status === "Completed") { e.preventDefault(); e.stopPropagation(); onViewModel?.({ clave, subClave, proyecto, subProyecto, status, subStatus, statusColor, avatars }); } }}
            className={\`bg-transparent transition-colors border border-transparent px-0 py-1.5 flex items-center gap-2 max-w-full\`}
          >
            <div className={\`w-[8px] h-[8px] rounded-full shrink-0 \${statusColor}\`} />
            <span className="text-ai-text font-medium text-[13px] shrink-0 whitespace-nowrap">{status}</span>
            <span className="text-ai-text-secondary text-[12px] flex items-center gap-1 min-w-0 truncate">
              <span className="truncate">{subStatus}</span>
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right px-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-[28px] w-[28px] text-ai-text-tertiary hover:text-ai-text hover:bg-ai-hover-1 rounded-full cursor-pointer">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-ai-surface border-ai-border shadow-md rounded-[12px] p-2 space-y-1">
                <DropdownMenuItem onClick={() => onViewDetails && onViewDetails({ clave, subClave, proyecto, subProyecto, status, subStatus, statusColor, avatars })} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-lg p-2.5 flex items-center gap-3">
                    <ExternalLink size={16} className="text-ai-text-secondary" />
                    View details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-lg p-2.5 flex items-center gap-3">
                    <ArrowLeftRight size={16} className="text-ai-text-secondary" />
                    Compare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMoveClick} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-lg p-2.5 flex items-center gap-3">
                    <Folder size={16} className="text-ai-text-secondary" />
                    Move to
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareClick} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-lg p-2.5 flex items-center gap-3">
                    <Share2 size={16} className="text-ai-text-secondary" />
                    Share link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleInviteClick} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-lg p-2.5 flex items-center gap-3">
                    <Lock size={16} className="text-ai-text-secondary" />
                    Invite collaborator
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-ai-border mx-1" />
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(); }} className="cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-500 text-[13px] rounded-lg p-2.5 flex items-center gap-3">
                    <Trash2 size={14} />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>

      {/* Share Link Modal Injection */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="bg-ai-surface border-ai-border text-ai-text sm:max-w-[440px] p-0 rounded-xl overflow-hidden gap-0">
          <div className="p-5 pb-4 border-b border-ai-border">
            <DialogTitle className="text-[16px] font-medium font-sans">Share case</DialogTitle>
            <p className="text-[13px] text-ai-text-secondary mt-0.5">Share this case with others via link or platform</p>
          </div>
          <div className="p-5 flex flex-col gap-4">
             <div className="flex items-center h-[40px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2 overflow-hidden group">
               <LinkIcon size={14} className="text-ai-text-tertiary shrink-0" />
               <span className="text-[12px] text-ai-text-secondary truncate flex-1 font-mono">https://cella.studio/case/{clave.toLowerCase().replace(/\\s+/g, '-')}</span>
               <button onClick={handleCopyLink} className={\`shrink-0 flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-[6px] transition-all \${linkCopied ? 'text-green-500 bg-green-500/10' : 'text-blue-500 hover:bg-blue-500/10'}\`}>
                 {linkCopied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
               </button>
             </div>
             <div className="flex flex-col gap-2">
                <p className="text-[12px] text-ai-text-tertiary uppercase tracking-wide font-medium">Collaborators</p>
                <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto">
                   {avatars.map((user, i) => (
                      <div key={i} className="flex items-center justify-between p-2 hover:bg-ai-hover-1 rounded-lg transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                           <Avatar className="w-8 h-8 shrink-0">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-[11px] font-bold">{user.initials}</AvatarFallback>
                           </Avatar>
                           <div className="flex flex-col min-w-0">
                             <span className="text-[13px] font-medium truncate">{user.name}</span>
                             <span className="text-[11px] text-ai-text-tertiary truncate">{i===0 ? "Owner" : "Viewer"}</span>
                           </div>
                        </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Move Dialog Injection */}
      <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
        <DialogContent className="bg-ai-surface border-ai-border text-ai-text sm:max-w-[440px] p-0 rounded-xl overflow-hidden">
          <div className="p-5 pb-4 border-b border-ai-border flex flex-col gap-1">
            <DialogTitle className="text-[16px] font-medium font-sans">Move case</DialogTitle>
            <p className="text-[13px] text-ai-text-secondary">Select folder to move this case</p>
          </div>
          <div className="p-5 flex flex-col gap-3">
             {['General', 'Neurology', 'Cardiology'].map(f => (
               <div key={f} onClick={() => setSelectedProject(f)} className={\`flex items-center justify-between p-3 rounded-lg border \${selectedProject === f ? 'border-blue-500 bg-blue-500/10' : 'border-ai-border hover:bg-ai-hover-1'} cursor-pointer transition-colors\`}>
                 <div className="flex items-center gap-2">
                   <Folder size={16} className={selectedProject === f ? 'text-blue-500' : 'text-ai-text-secondary'}/>
                   <span className={\`text-[14px] \${selectedProject === f ? 'text-blue-500 font-medium' : ''}\`}>{f}</span>
                 </div>
               </div>
             ))}
          </div>
          <div className="p-5 border-t border-ai-border flex justify-end gap-2 bg-gray-50 dark:bg-black/20">
             <Button variant="ghost" onClick={() => setIsMoveOpen(false)}>Cancel</Button>
             <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6" onClick={() => setIsMoveOpen(false)}>Move</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Invite Dialog Injection */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="bg-ai-surface border-ai-border text-ai-text sm:max-w-[440px] p-6 rounded-xl">
           <DialogTitle className="text-[18px] font-bold mb-4">Invite to {proyecto}</DialogTitle>
           <div className="flex flex-col gap-4">
              <input placeholder="Enter colleague email..." className="flex h-[40px] w-full rounded-lg border border-ai-border bg-transparent px-3 text-[14px]" />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-[40px] font-medium">Send Invitation</Button>
           </div>
        </DialogContent>
      </Dialog>
    </TableRow>
  )
}
`;
  content = content.substring(0, homeDataRowStartLine) + newHomeDataRow + content.substring(homeDataRowEndLine);
}

// 2. Sales Rep Card Redesign
const repStart = content.indexOf('{/* YOUR Cella Rep */}');
const repEnd = content.indexOf('</div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                )}');

if (repStart > -1) {
  const newRepCard = `{/* YOUR Cella Rep */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[20px] font-medium text-ai-text">Your Contact Specialist</h3>
                          </div>
                          <div className="border border-ai-border dark:border-white/10 bg-white dark:bg-[#131416] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none rounded-[16px] p-6 flex flex-col items-center gap-4 text-center relative overflow-hidden group">
                            {/* Accent Decoration */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-[#1a73e8] opacity-10 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="relative">
                              <Avatar className="w-[84px] h-[84px] border-4 border-white dark:border-[#131416] shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                                <AvatarImage src={"https://xsgames.co/randomusers/assets/avatars/female/24.jpg"} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-[24px]">LG</AvatarFallback>
                              </Avatar>
                              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-[#131416]" />
                            </div>
                            
                            <div className="flex flex-col gap-0.5">
                              <span className="text-ai-text font-bold text-[19px]">Laura Gómez</span>
                              <span className="text-[#1a73e8] font-semibold text-[13px] uppercase tracking-wider">CellaMS Sales Rep</span>
                            </div>

                            <div className="w-full h-px bg-ai-border opacity-60 my-1" />

                            <div className="flex flex-col gap-2 w-full text-ai-text-secondary text-[13px]">
                               <div className="flex items-center justify-center gap-2 hover:text-ai-text transition-colors cursor-pointer">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                  <span>laura.g@cellams.com</span>
                               </div>
                               <div className="flex items-center justify-center gap-2 hover:text-ai-text transition-colors cursor-pointer">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                  <span>+34 91 123 45 67</span>
                               </div>
                            </div>

                            <Button 
                              onClick={() => setChatSidebarOpen(true)}
                              className="w-full mt-2 bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[10px] h-[44px] font-bold text-[14px] transition-all shadow-md active:scale-[0.98] border-none cursor-pointer flex items-center justify-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                              Support Center
                            </Button>
                          </div>
                        </div>`;
  content = content.substring(0, repStart) + newRepCard + content.substring(repEnd);
}

fs.writeFileSync('src/app/page.tsx', content, 'utf8');

console.log('UI Updates successfully executed!');
