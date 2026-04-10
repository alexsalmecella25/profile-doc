const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. HomeDataRow - Add missing dropdown items (View PDF, Comments, Cancel)
const dropdownTarget = '<DropdownMenuSeparator className="bg-ai-border mx-1" />';
const additionalItems = `                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-lg p-2.5 flex items-center gap-3">
                    <FileText size={16} className="text-ai-text-secondary" />
                    View PDF model
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-lg p-2.5 flex items-center gap-3">
                    <MessageCircle size={16} className="text-ai-text-secondary" />
                    Comments
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-lg p-2.5 flex items-center gap-3">
                    <XCircle size={16} className="text-ai-text-secondary" />
                    Cancel case
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-ai-border mx-1" />`;

// We want to inject these BEFORE the separator in HomeDataRow.
// Let's find HomeDataRow's DropdownMenuContent first.
const hStart = content.indexOf('function HomeDataRow');
const hEnd = content.indexOf('function ProjectsView', hStart);
let hSection = content.substring(hStart, hEnd);

if (hSection.includes(dropdownTarget)) {
    hSection = hSection.replace(dropdownTarget, additionalItems);
    content = content.substring(0, hStart) + hSection + content.substring(hEnd);
}

// 2. Sales Rep Card - Redesign
// Find the entire block from {/* YOUR REP */} to the end of that div
const repStartTag = '{/* YOUR REP */}';
const repEndTag = '</div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                )}';

const rStart = content.indexOf(repStartTag);
const rEnd = content.indexOf(repEndTag, rStart);

if (rStart > -1 && rEnd > -1) {
    const newRepBlock = `{/* YOUR Cella Rep */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[20px] font-medium text-ai-text">Your Dedicated Rep</h3>
                          </div>
                          <div className="border border-ai-border dark:border-white/10 bg-white dark:bg-[#131416] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[16px] p-6 flex flex-col items-center gap-4 text-center relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
                            {/* Background decoration */}
                            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10" />
                            
                            <div className="relative">
                               <Avatar className="w-[72px] h-[72px] border-4 border-white dark:border-[#131416] shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300 z-10">
                                 <AvatarImage src="https://xsgames.co/randomusers/assets/avatars/female/17.jpg" />
                                 <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-[24px]">LG</AvatarFallback>
                               </Avatar>
                               <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-[#131416] z-20" />
                            </div>
                            
                            <div className="flex flex-col gap-0.5 relative z-10">
                              <span className="text-ai-text font-bold text-[18px]">Laura Gómez</span>
                              <span className="text-[#1a73e8] dark:text-blue-400 font-semibold text-[13px] uppercase tracking-wider">CellaMS Sales Rep</span>
                            </div>

                            <div className="w-full h-px bg-ai-border opacity-50 my-1 relative z-10" />

                            <div className="flex flex-col gap-2 w-full text-ai-text-secondary text-[13px] relative z-10">
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
                              className="w-full mt-2 bg-[#1a73e8] hover:bg-[#155ebd] text-white rounded-[10px] h-[44px] font-bold text-[14px] transition-all shadow-md active:scale-[0.98] border-none cursor-pointer flex items-center justify-center gap-2 relative z-10"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                              Support Center
                            </Button>
                          </div>
                        </div>`;
    content = content.substring(0, rStart) + newRepBlock + content.substring(rEnd);
}

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
console.log('Final UI fixes applied!');
