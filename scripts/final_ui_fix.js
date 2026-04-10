const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Remove background from Recent Products items in light theme.
// Currently: className="border border-ai-border dark:border-white/10 bg-ai-surface dark:bg-[#131416] shadow-sm rounded-[12px] p-5 flex flex-col gap-1 cursor-pointer group hover:bg-ai-hover-1 transition-colors"
// I will remove bg-ai-surface and hover:bg-ai-hover-1 to make it completely transparent/white in light theme, maybe bg-transparent.
page = page.replace(
  /className="border border-ai-border dark:border-white\/10 bg-ai-surface dark:bg-\[#131416\] shadow-sm rounded-\[12px\] p-5 flex flex-col gap-1 cursor-pointer group hover:bg-ai-hover-1 transition-colors"/g,
  'className="border border-ai-border dark:border-white/10 bg-transparent dark:bg-[#131416] shadow-sm rounded-[12px] p-5 flex flex-col gap-1 cursor-pointer group hover:border-[#0782f5] transition-colors"'
);

// 2. Adjust DataRow to show both IDs
const dataRowReturnRegex = /<TableRow className="border-b border-ai-border hover:bg-transparent h-\[60px\] data-\[state=selected\]:bg-transparent group">[\s\S]*?<TableCell className="font-medium text-ai-text px-4">[\s\S]*?<\/TableCell>/m;

// Let's replace the content inside the TableCell for DataRow.
// Original looks like:
// <TableCell className="font-medium text-ai-text px-4">
//   <div className="flex flex-col gap-1 items-start">
//     <span className="cursor-pointer hover:text-blue-600 transition-colors">{clave}</span>
//     <span className="text-[12px] text-ai-text-secondary font-normal cursor-pointer hover:text-blue-500 transition-colors">{proyecto}</span>
//   </div>
// </TableCell>

const newDataRowCell = `<TableCell className="font-medium text-ai-text px-4">
        <div className="flex flex-col gap-1 items-start">
          <span className="cursor-pointer hover:text-blue-600 transition-colors font-semibold text-[14px]">{proyecto}</span>
          <div className="flex items-center gap-2 text-[12px] text-ai-text-secondary font-mono">
            <span>{clave}</span>
            <span className="text-ai-border-strong">•</span>
            <span>{subProyecto}</span>
          </div>
        </div>
      </TableCell>`;

page = page.replace(
  /<TableCell className="font-medium text-ai-text px-4">\s*<div className="flex flex-col gap-1 items-start">\s*<span className="cursor-pointer hover:text-blue-600 transition-colors">{clave}<\/span>\s*<span className="text-\[12px\] text-ai-text-secondary font-normal cursor-pointer hover:text-blue-500 transition-colors">{proyecto}<\/span>\s*<\/div>\s*<\/TableCell>/m,
  newDataRowCell
);

// 3. Hover of the row more tenuous.
// The DataRow TableRow currently has `hover:bg-transparent`. Wait... if it has hover:bg-transparent, then there is NO hover background on the row!
// Let's check `src/app/page.tsx` line 215 where DataRow TableRow is defined.
const tableRowRegex = /<TableRow className="border-b border-ai-border hover:bg-transparent h-\[60px\] data-\[state=selected\]:bg-transparent group">/g;
page = page.replace(
  tableRowRegex,
  '<TableRow className="border-b border-ai-border hover:bg-gray-50/50 dark:hover:bg-white/[0.02] h-[60px] cursor-pointer transition-colors">'
);

fs.writeFileSync('src/app/page.tsx', page, 'utf8');

console.log("Updated fixes!");
