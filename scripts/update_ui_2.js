const fs = require('fs');

// 1. GLOBALS.CSS
let css = fs.readFileSync('src/app/globals.css', 'utf8');
css = css.replace('--ai-base: #f9fafb;', '--ai-base: #ffffff;');
css = css.replace('--ai-surface: #ffffff;', '--ai-surface: #f9fafb;'); // Give surface a slight grey tint so panels stand out against white
fs.writeFileSync('src/app/globals.css', css, 'utf8');

// 2. PAGE.TSX
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// What's New Border & Background
const whatsNewRegex = /<div className="flex flex-col">\s*<div className="flex items-center justify-between mb-6">\s*<h3 className="text-\[20px\] font-medium text-ai-text">What's New<\/h3>/m;
const newWhatsNew = `<div className="flex flex-col border border-ai-border rounded-[12px] p-5 bg-white dark:bg-transparent shadow-sm">
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[20px] font-medium text-ai-text">What's New</h3>`;
page = page.replace(whatsNewRegex, newWhatsNew);

// Adjust standard styles of interior items in What's New so they don't look weird inside the new padded box
page = page.replace(
  /className="bg-transparent hover:bg-white dark:hover:bg-\[#1a1c1f\] p-4 flex items-start gap-4 rounded-2xl cursor-pointer hover:shadow-\[0_4px_24px_rgba\(0,0,0,0\.04\)\] dark:hover:shadow-\[0_4px_24px_rgba\(0,0,0,0\.4\)\] transition-all duration-300 group border border-transparent dark:hover:border-white\/5"/g,
  'className="bg-transparent hover:bg-ai-hover-1 p-3 flex items-start gap-3 rounded-xl cursor-pointer transition-colors duration-200 group border border-transparent"'
);
page = page.replace(
  /className="bg-gray-50 dark:bg-\[#131416\] border border-gray-100 dark:border-white\/5 p-2\.5 rounded-xl shrink-0 mt-0\.5 group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900\/20 group-hover:border-blue-100 dark:group-hover:border-blue-800\/30 transition-all duration-300"/g,
  'className="bg-white dark:bg-[#131416] border border-ai-border p-2 rounded-lg shrink-0 mt-0.5 group-hover:border-[#0782f5] group-hover:text-[#0782f5] transition-colors duration-200"'
);

// Recent Products Redesign (No hover elevate/shadow, cleaner code)
page = page.replace(
  /className="border border-\[#e5e7eb\] dark:border-white\/5 bg-gradient-to-br from-white to-gray-50 dark:from-\[#1b1d20\] dark:to-\[#131416\] shadow-sm hover:shadow-xl rounded-2xl p-5 flex flex-col gap-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden group"/g,
  'className="border border-ai-border dark:border-white/10 bg-ai-surface dark:bg-[#131416] shadow-sm rounded-[12px] p-5 flex flex-col gap-1 cursor-pointer group hover:bg-ai-hover-1 transition-colors"'
);

// Decrease gap, smaller subtitle, clean initials circle
page = page.replace(
  /className="w-10 h-10 rounded-full bg-gradient-to-[^"]+"([^>]*)>C<\/div>/g,
  'className="w-8 h-8 rounded-full bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center text-ai-text font-bold text-[13px] mb-3 border border-ai-border group-hover:border-[#0782f5] transition-colors"$1>C</div>'
);
page = page.replace(
  /className="w-10 h-10 rounded-full bg-gradient-to-[^"]+"([^>]*)>G<\/div>/g,
  'className="w-8 h-8 rounded-full bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center text-ai-text font-bold text-[13px] mb-3 border border-ai-border group-hover:border-[#0782f5] transition-colors"$1>G</div>'
);

fs.writeFileSync('src/app/page.tsx', page, 'utf8');
console.log('UI theme and updates applied!');
