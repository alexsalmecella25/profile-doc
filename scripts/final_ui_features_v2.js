const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. HomeDataRow - Edit signature and add isShareOpen State
const homeDataRowSig = /function HomeDataRow\(\{([^}]*)\}\: \{([^}]*)\}\) \{/;

let newHomeDataRowStart = `function HomeDataRow({
  clave, subClave, proyecto, subProyecto, date, avatars, status, subStatus, statusColor, showEdit, isLink, disabled, onViewDetails, onViewModel, onDelete
}: {
  clave: string; subClave: string; proyecto: string; subProyecto: string; date: string; avatars: { initials: string; name: string }[]; status: string; subStatus: string; statusColor: string; showEdit?: boolean; isLink?: boolean; disabled?: boolean; onViewDetails?: (caseData: any) => void; onViewModel?: (caseData: any) => void; onDelete?: () => void;
}) {
  const [isShareOpen, setIsShareOpen] = useState(false);
`;
page = page.replace(homeDataRowSig, newHomeDataRowStart);

// HomeDataRow - Replace size of ID and inject new Author Column
let homeDataRowBody = `      <TableCell className="font-medium text-ai-text px-4">
        <div className="flex flex-col gap-1 items-start">
          <span className="cursor-pointer hover:text-blue-600 transition-colors font-semibold text-[14px]">{proyecto}</span>
          <div className="flex items-center gap-2 text-[14px] text-ai-text-secondary font-mono">
            <span>{clave}</span>
            <span className="text-ai-border-strong">•</span>
            <span>{subProyecto}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-ai-text">{date}</TableCell>
      <TableCell className="max-w-[120px]">
        <div className="flex -space-x-2 pl-1">
          <TooltipProvider delayDuration={100}>
            {avatars.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-[30px] h-[30px] border-2 border-white dark:border-[#131416] bg-ai-border cursor-pointer transition-transform hover:scale-110 z-20 hover:z-30">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center p-0 m-0 leading-none">{avatars[0]?.initials}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white border-none shadow-lg text-[13px]">
                  <p>{avatars[0]?.name}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {avatars.length > 1 && (
              <Avatar 
                className="w-[30px] h-[30px] border-2 border-white dark:border-[#131416] bg-[#f3f4f6] dark:bg-[#282a2c] cursor-pointer transition-transform hover:scale-110 z-10 hover:z-30" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsShareOpen(true); }}
              >
                <AvatarFallback className="bg-transparent text-ai-text-secondary font-medium text-[11px] flex items-center justify-center p-0 m-0 leading-none">+{avatars.length - 1}</AvatarFallback>
              </Avatar>
            )}
          </TooltipProvider>
        </div>
      </TableCell>`;

page = page.replace(
  /<TableCell className="font-medium text-ai-text px-4">[\s\S]*?<\/div>\s*<\/TableCell>\s*<TableCell className="text-ai-text">{date}<\/TableCell>/m,
  homeDataRowBody
);

// HomeDataRow - Add Dialog after the row
const homeDataRowReturnEnd = `        </DropdownMenu>
      </TableCell>
      
      {/* Share Modal Injection */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="bg-ai-surface border-ai-border max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-ai-text text-[20px]">Share case</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-3">
              <span className="text-ai-text font-medium text-[14px]">Who has access</span>
              <div className="flex flex-col gap-1">
                {avatars.map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-ai-hover-1 rounded-[8px] transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-[36px] h-[36px]">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-[13px] font-medium">{user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                         <span className="text-ai-text text-[14px] font-medium">{user.name}</span>
                         <span className="text-ai-text-secondary text-[12px]">{user.name.toLowerCase().replace(' ', '.')}@hospital.es</span>
                      </div>
                    </div>
                    <span className="text-ai-text-secondary text-[13px] mr-2">{i===0 ? 'Owner' : 'Viewer'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TableRow>
  )
}`;
page = page.replace(/<\/DropdownMenu>\s*<\/TableCell>\s*<\/TableRow>\s*\)\s*\}/m, homeDataRowReturnEnd);

// TABLE HEADER - Update columns to match new HomeDataRow structure!
const origTableHeader = `<TableHead className="text-ai-text-tertiary font-medium w-[40%]">Case</TableHead>
                                  <TableHead className="text-ai-text-tertiary font-medium w-[20%]">Created</TableHead>
                                  <TableHead className="text-ai-text-tertiary font-medium w-[30%]">Status</TableHead>
                                  <TableHead className="text-right w-[10%]"></TableHead>`;

const newTableHeader = `<TableHead className="text-ai-text-tertiary font-medium w-[35%]">Case</TableHead>
                                  <TableHead className="text-ai-text-tertiary font-medium w-[15%]">Created</TableHead>
                                  <TableHead className="text-ai-text-tertiary font-medium w-[15%]">Author</TableHead>
                                  <TableHead className="text-ai-text-tertiary font-medium w-[25%]">Status</TableHead>
                                  <TableHead className="text-right w-[10%]"></TableHead>`;
page = page.replace(origTableHeader, newTableHeader);

// REP CARD - Redesign completely
const yourRepStart = page.indexOf('{/* YOUR REP */}');
const yourRepEnd = page.indexOf('</div>\n                      </div>\n                    </div>\n                  </div>\n                )}');
const origRepBlock = page.substring(yourRepStart, yourRepEnd);

const newRepBlock = `{/* YOUR Cella Rep */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[20px] font-medium text-ai-text">Your Dedicated Rep</h3>
                          </div>
                          <div className="border border-ai-border dark:border-white/10 bg-ai-surface dark:bg-[#131416] shadow-sm rounded-[16px] p-6 flex flex-col items-center gap-3 text-center relative overflow-hidden group hover:border-[#0782f5] transition-colors duration-300">
                            {/* Background aesthetic */}
                            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10" />
                            
                            <Avatar className="w-[72px] h-[72px] border-4 border-white dark:border-[#131416] shadow-md shrink-0 relative z-10 transition-transform group-hover:scale-105 duration-300">
                              <AvatarImage src={"https://i.pravatar.cc/150?img=9"} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-[20px]">LG</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex flex-col min-w-0 px-2 mt-2 relative z-10 gap-0.5">
                              <span className="text-ai-text font-bold text-[18px]">Laura Gómez</span>
                              <span className="text-blue-600 dark:text-blue-400 font-medium text-[13px] mb-2">CellaMS Sales Rep</span>
                              <span className="text-ai-text-secondary text-[13px]">laura.g@cellams.com</span>
                              <span className="text-ai-text-secondary text-[13px]">+34 912 345 678</span>
                            </div>
                            
                            <div className="w-full flex gap-3 mt-4 relative z-10">
                              <Button 
                                onClick={() => setChatSidebarOpen(true)}
                                className="w-full bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[8px] h-[40px] font-medium transition-colors cursor-pointer border-none shadow-sm flex items-center justify-center gap-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                Support Center
                              </Button>
                            </div>
                          </div>
                        </div>
`;
page = page.substring(0, yourRepStart) + newRepBlock + page.substring(yourRepEnd);

fs.writeFileSync('src/app/page.tsx', page, 'utf8');
console.log('Final touches applied!');
