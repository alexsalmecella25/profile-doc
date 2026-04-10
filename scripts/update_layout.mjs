import fs from 'fs';
const file = 'src/app/page.tsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

// Replace Layout block (535 to 716)
const startIdx = 534; // line 535 is index 534
const endIdx = 716;   // line 717 is index 716

const newLayout = `                      <div className="flex items-center">
                        {/* Dropdown removed */}
                      </div>
                    </div>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                      {/* Lado izquierdo 66% */}
                      <div className="lg:col-span-2 flex flex-col">
                        <div className="w-full flex flex-col">
                          <div className="w-full flex flex-col gap-8 mb-6">
                            <h2 className="text-[22px] font-medium text-ai-text shrink-0">
                              Casos recientes
                            </h2>
                            <div className="flex items-center w-full justify-between">
                              <SmartSearchInput
                                value={homeSearch}
                                onChange={setHomeSearch}
                                placeholder="Search cases..."
                                suggestions={Array.from(new Set(cases.flatMap(c => [c.proyecto, c.clave, c.subClave, c.subProyecto])))}
                                className="w-[320px]"
                              />
                              <div className="flex items-center gap-4 shrink-0">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-[36px] bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                                      {homeFilter} <ChevronDown size={14} className="text-ai-text-tertiary" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[180px] bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                                    {['All', 'Blocked', 'Pending', 'In progress', 'Completed'].map(f => (
                                      <DropdownMenuItem key={f} onClick={() => setHomeFilter(f)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                                        {homeFilter === f && <Check size={12} className="text-blue-500" />}
                                        {homeFilter !== f && <span className="w-3" />}
                                        {f}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-[36px] bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                                      <CalendarIcon size={14} className="text-ai-text-secondary" />
                                      <span>{dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Date</span>}</span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                                  </PopoverContent>
                                </Popover>
                                <div className="w-px h-5 bg-ai-border shrink-0" />
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-[36px] bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                                      {homeSort} <ChevronDown size={14} className="text-ai-text-tertiary" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[200px] bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                                    {['Most recent', 'Least recent', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)'].map(s => (
                                      <DropdownMenuItem key={s} onClick={() => setHomeSort(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                                        {homeSort === s && <Check size={12} className="text-blue-500" />}
                                        {homeSort !== s && <span className="w-3" />}
                                        {s === 'A-Z' ? 'Alphabetical (A-Z)' : s === 'Z-A' ? 'Alphabetical (Z-A)' : s}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>

                          <div className="border border-ai-border rounded-[8px] overflow-hidden w-full">
                            <Table className="w-full text-[13px] table-fixed">
                              <TableHeader>
                                <TableRow className="border-b border-ai-border hover:bg-transparent h-[48px] data-[state=selected]:bg-transparent cursor-default">
                                  <TableHead className="text-ai-text-tertiary font-medium w-[40%]">Case</TableHead>
                                  <TableHead className="text-ai-text-tertiary font-medium w-[20%]">Created</TableHead>
                                  <TableHead className="text-ai-text-tertiary font-medium w-[30%]">Status</TableHead>
                                  <TableHead className="text-right w-[10%]"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {applyFilters(cases, homeSearch, homeFilter, homeSort).length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center text-ai-text-tertiary text-[13px] py-8">No cases found</TableCell>
                                  </TableRow>
                                ) : applyFilters(cases, homeSearch, homeFilter, homeSort).map(c => (
                                  <DataRow
                                    key={c.id}
                                    clave={c.clave}
                                    subClave={c.subClave}
                                    proyecto={c.proyecto}
                                    subProyecto={c.subProyecto}
                                    date={c.date}
                                    avatars={c.avatars}
                                    status={c.status}
                                    subStatus={c.subStatus}
                                    statusColor={c.statusColor}
                                    showEdit={c.showEdit}
                                    isLink={c.isLink}
                                    onViewModel={handleViewModel}
                                    onViewDetails={setSelectedCase}
                                    onDelete={() => setCases(prev => prev.filter(x => x.id !== c.id))}
                                  />
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>

                      {/* Lado derecho 33% */}
                      <div className="lg:col-span-1 flex flex-col gap-10">
                        {/* PRODUCTOS RECIENTES */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[18px] font-medium text-ai-text">Productos recientes</h3>
                            <span className="text-[13px] text-blue-500 hover:text-blue-400 cursor-pointer transition-colors">Ver todos</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="border border-[#e5e7eb] dark:border-white/10 shadow-sm rounded-xl p-4 flex flex-col gap-2 bg-white dark:bg-[#131416] hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8b919d] to-[#d8d3cd] flex items-center justify-center text-white font-bold text-[14px] mb-1">C</div>
                              <span className="text-[13px] font-semibold text-ai-text leading-tight group-hover/pill:text-blue-600">Ischemic colitis</span>
                              <span className="text-[11px] font-medium text-ai-text-tertiary">Colorectal</span>
                            </div>
                            <div className="border border-[#e5e7eb] dark:border-white/10 shadow-sm rounded-xl p-4 flex flex-col gap-2 bg-white dark:bg-[#131416] hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8ab240] to-[#b1c062] flex items-center justify-center text-white font-bold text-[14px] mb-1">G</div>
                              <span className="text-[13px] font-semibold text-ai-text leading-tight group-hover/pill:text-blue-600">Desmoplastic tumor</span>
                              <span className="text-[11px] font-medium text-ai-text-tertiary">General Surgery</span>
                            </div>
                          </div>
                        </div>

                        {/* NOVEDADES */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[18px] font-medium text-ai-text">Novedades</h3>
                            <span className="text-[13px] text-blue-500 hover:text-blue-400 cursor-pointer transition-colors">Ver todas</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="border border-ai-border bg-ai-surface p-3.5 flex items-start gap-4 rounded-xl cursor-pointer hover:bg-ai-hover-1 transition-colors">
                              <div className="bg-white dark:bg-[#131416] border border-ai-border p-2 rounded-lg shrink-0 mt-0.5">
                                <ImageIcon size={18} className="text-ai-text-secondary" />
                              </div>
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-ai-text font-medium text-[14px]">Cella Studio 2.0 Available</span>
                                <span className="text-ai-text-tertiary text-[12px] leading-relaxed">Advanced clinical visual intelligence with sub-second anatomical segmentation.</span>
                              </div>
                            </div>
                            
                            <div className="border border-ai-border bg-ai-surface p-3.5 flex items-start gap-4 rounded-xl cursor-pointer hover:bg-ai-hover-1 transition-colors">
                              <div className="bg-white dark:bg-[#131416] border border-ai-border p-2 rounded-lg shrink-0 mt-0.5">
                                <Sparkles size={18} className="text-ai-text-secondary" />
                              </div>
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-ai-text font-medium text-[14px]">New Auto-Segmentation AI</span>
                                <span className="text-ai-text-tertiary text-[12px] leading-relaxed">Map vascular structures automatically with 99% accuracy.</span>
                              </div>
                            </div>

                            <div className="border border-ai-border bg-ai-surface p-3.5 flex items-start gap-4 rounded-xl cursor-pointer hover:bg-ai-hover-1 transition-colors">
                              <div className="bg-white dark:bg-[#131416] border border-ai-border p-2 rounded-lg shrink-0 mt-0.5">
                                <Settings size={18} className="text-ai-text-secondary" />
                              </div>
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-ai-text font-medium text-[14px]">Enhanced DICOM Export</span>
                                <span className="text-ai-text-tertiary text-[12px] leading-relaxed">Export directly to standard medical imaging formats natively.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`;

// Replace DataRow block (1060 to 1121)
// Wait, to be safe, I'll find the line numbers for DataRow TableCells exactly from the file content array.
let dataRowStart = lines.findIndex((l, i) => i > 1000 && l.includes('<TableCell className="max-w-[200px]">'));
let dataRowEnd = lines.findIndex((l, i) => i > dataRowStart && l.includes('<TableCell className="text-right">'));

const newDataRowCells = `      <TableCell className="max-w-[200px]">
        <div className="flex flex-col gap-[2px] pr-4 min-w-0">
          <span className="text-ai-text font-medium leading-relaxed truncate">{clave}</span>
          <span className="text-ai-text-tertiary text-[12px] truncate">{proyecto}</span>
        </div>
      </TableCell>
      <TableCell className="text-ai-text">{date}</TableCell>
      <TableCell className="max-w-[220px]">
        <div className="flex items-center min-w-0 w-full">
          <div
            onClick={(e) => {
              if (status === "Completed") {
                e.preventDefault();
                e.stopPropagation();
                onViewModel?.({ clave, subClave, proyecto, subProyecto, status, subStatus, statusColor, avatars });
              }
            }}
            className={\`bg-ai-surface hover:bg-ai-hover-1 transition-colors border border-ai-border rounded-full px-3 py-1.5 flex items-center gap-2 max-w-full \${status === "Completed" ? "cursor-pointer" : ""}\`}
          >
            <div className={\`w-[8px] h-[8px] rounded-full shrink-0 \${statusColor}\`} />
            <span className="text-ai-text font-bold text-[13px] shrink-0 whitespace-nowrap">{status}</span>
            <span className="text-ai-text-secondary text-[13px] flex items-center gap-1 min-w-0 truncate">
              <span className="truncate">{subStatus}</span>
              {isLink && <ExternalLink size={12} className="ml-1 shrink-0" />}
            </span>
          </div>
        </div>
      </TableCell>
`;

let resultLines = [...lines.slice(0, startIdx), newLayout, ...lines.slice(endIdx + 1)];

// Re-calculate indices since length changed
dataRowStart = resultLines.findIndex((l, i) => i > 800 && l.includes('<TableCell className="max-w-[200px]">'));
dataRowEnd = resultLines.findIndex((l, i) => i > dataRowStart && l.includes('<TableCell className="text-right">'));

resultLines = [...resultLines.slice(0, dataRowStart), newDataRowCells, ...resultLines.slice(dataRowEnd)];

fs.writeFileSync(file, resultLines.join('\\n'), 'utf8');
console.log('Successfully updated page.tsx layout and DataRow!');
