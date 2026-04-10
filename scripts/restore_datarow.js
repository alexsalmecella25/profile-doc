const fs = require('fs');

// Read current file
let currentFile = fs.readFileSync('src/app/page.tsx', 'utf8');

// Read original file to grab original DataRow
const origFile = fs.readFileSync('C:\\projects\\cella-dashboard\\src\\app\\page.tsx', 'utf8');
const origDataRowStart = origFile.indexOf('function DataRow({');
const origDataRowEnd = origFile.indexOf('function ProjectsView({');
const originalDataRowStr = origFile.substring(origDataRowStart, origDataRowEnd);

// Find current DataRow in the modified file
const currDataRowStart = currentFile.indexOf('function DataRow({');
const currDataRowEnd = currentFile.indexOf('function ProjectsView({');

// The new HomeDataRow is essentially what I built for DataRow but with
// 4 columns and the specialized design.
const homeDataRowStr = `
function HomeDataRow({
  clave, subClave, proyecto, subProyecto, date, avatars, status, subStatus, statusColor, showEdit, isLink, disabled, onViewDetails, onViewModel, onDelete
}: {
  clave: string; subClave: string; proyecto: string; subProyecto: string; date: string; avatars: { initials: string; name: string }[]; status: string; subStatus: string; statusColor: string; showEdit?: boolean; isLink?: boolean; disabled?: boolean; onViewDetails?: (caseData: any) => void; onViewModel?: (caseData: any) => void; onDelete?: () => void;
}) {
  return (
    <TableRow className={\`border-b border-ai-border hover:bg-gray-50/50 dark:hover:bg-white/[0.02] h-[60px] cursor-pointer transition-colors \${disabled ? "opacity-50" : ""}\`}>
      <TableCell className="font-medium text-ai-text px-4">
        <div className="flex flex-col gap-1 items-start">
          <span className="cursor-pointer hover:text-blue-600 transition-colors font-semibold text-[14px]">{proyecto}</span>
          <div className="flex items-center gap-2 text-[12px] text-ai-text-secondary font-mono">
            <span>{clave}</span>
            <span className="text-ai-border-strong">•</span>
            <span>{subProyecto}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-ai-text">{date}</TableCell>
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
            <DropdownMenuContent align="end" className="w-[180px] bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                <DropdownMenuItem onClick={() => onViewDetails && onViewDetails({ clave, subClave, proyecto, subProyecto, status, subStatus, statusColor, avatars })} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    <ExternalLink size={14} className="text-ai-text-secondary" />
                    View details
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
`;

// Replace current DataRow with OriginalDataRow + HomeDataRow
currentFile = currentFile.substring(0, currDataRowStart) + originalDataRowStr + homeDataRowStr + currentFile.substring(currDataRowEnd);

// Now change the usages of DataRow inside the Home view block.
// The home view block renders `<DataRow` inside a TableBody.
// Let's replace ONLY the occurrences in the first block (Home view).
const homeBlockEnd = currentFile.indexOf('{/* Lado derecho 33% */}');
const beforeHomeBlock = currentFile.substring(0, homeBlockEnd);
const afterHomeBlock = currentFile.substring(homeBlockEnd);

const updatedBeforeHomeBlock = beforeHomeBlock.replace(/<DataRow\n/g, '<HomeDataRow\n');
currentFile = updatedBeforeHomeBlock + afterHomeBlock;

fs.writeFileSync('src/app/page.tsx', currentFile, 'utf8');
console.log('Restoration and injection complete.');
