const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Alert Banner
const welcomeRegex = /<h1 className="text-\[28px\] font-medium text-ai-text">\s*Welcome back, Alex\s*<\/h1>\s*<div className="flex items-center">\s*{\/\* Dropdown removed \*\/}\s*<\/div>\s*<\/div>/m;
const newWelcome = `<h1 className="text-[28px] font-medium text-ai-text">
                        Welcome back, Alex
                      </h1>
                    </div>
                    {/* ALERT BANNER */}
                    <div className="w-full bg-[#fff4e5] dark:bg-[#2b1700] border border-[#ffb224] dark:border-[#a35200] rounded-[12px] p-4 mb-8 flex items-center justify-between animate-in fade-in duration-500 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ffb224]/20 flex items-center justify-center shrink-0">
                           {/* A simple triangle warning icon representation */}
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e08e00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#a46600] dark:text-[#ffb224] font-semibold text-[14px]">Action Required: Blocked Case</span>
                          <span className="text-[#b87300] dark:text-[#ffc552] text-[13px]">Desmoplastic tumor (ID224593) is blocked because it requires documentation to proceed to production.</span>
                        </div>
                      </div>
                      <Button className="bg-[#ffb224] hover:bg-[#e08e00] text-white font-medium text-[13px] h-[36px] px-4 rounded-[8px] cursor-pointer shrink-0 border-none transition-colors">
                        Review & Fix
                      </Button>
                    </div>`;

page = page.replace(welcomeRegex, newWelcome);

// 2. Sales Rep Card
const whatsNewEndRegex = /<span className="text-ai-text-tertiary text-\[12px\] leading-relaxed">Export directly to standard medical imaging formats natively\.<\/span>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/m;

const newRepCard = `<span className="text-ai-text-tertiary text-[12px] leading-relaxed">Export directly to standard medical imaging formats natively.</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* YOUR REP */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[20px] font-medium text-ai-text">Your Cella Rep</h3>
                          </div>
                          <div className="border border-ai-border dark:border-white/10 bg-ai-surface dark:bg-[#131416] shadow-sm rounded-[12px] p-5 flex items-center gap-4">
                            <Avatar className="w-12 h-12 border-2 border-white dark:border-[#2a2c30] shadow-sm shrink-0">
                              <AvatarImage src={"https://i.pravatar.cc/150?u=laura"} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">LG</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-ai-text font-semibold text-[15px] truncate">Laura Gómez</span>
                              <span className="text-ai-text-secondary text-[13px] truncate">CellaMS Representative</span>
                            </div>
                            <Button variant="ghost" size="icon" className="ml-auto shrink-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer transition-colors">
                               <Mail size={16} />
                            </Button>
                          </div>
                        </div>
`;

page = page.replace(whatsNewEndRegex, newRepCard);

fs.writeFileSync('src/app/page.tsx', page, 'utf8');
console.log('Banner and rep card added!');
