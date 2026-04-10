const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Margin top
page = page.replace(
  'className="flex flex-col sm:flex-row sm:items-center justify-between mt-[100px] mb-12"',
  'className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 mb-8"'
);

// 2. Titles 20px
page = page.replace(
  'className="text-[22px] font-medium text-ai-text shrink-0">\n                              Recent Cases',
  'className="text-[20px] font-medium text-ai-text shrink-0">\n                              Recent Cases'
);
page = page.replace(
  '<h3 className="text-[18px] font-medium text-ai-text">Recent Products</h3>',
  '<h3 className="text-[20px] font-medium text-ai-text">Recent Products</h3>'
);
page = page.replace(
  '<h3 className="text-[18px] font-medium text-ai-text">What\'s New</h3>',
  '<h3 className="text-[20px] font-medium text-ai-text">What\'s New</h3>'
);

// 3. Remove filters but keep search
const filterBlockStart = '<div className="flex items-center gap-4 shrink-0">';
const filterBlockEndRegex = /<div className="flex items-center gap-4 shrink-0">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div className="border border-ai-border rounded-\[8px\] overflow-hidden w-full">/m;

const match = page.match(filterBlockEndRegex);
if(match) {
    const matchedText = match[0];
    const newMatchedText = '</div>\n                          </div>\n\n                          <div className="border border-ai-border rounded-[12px] bg-white dark:bg-transparent overflow-hidden w-full">';
    // NOTE: I also applied the bg-white to the container in the replacement!
    page = page.replace(matchedText, newMatchedText);
}

// Ensure the table border gets bg-white if regex failed
if(!page.includes('rounded-[12px] bg-white dark:bg-transparent')) {
    page = page.replace(
      '<div className="border border-ai-border rounded-[8px] overflow-hidden w-full">',
      '<div className="border border-ai-border rounded-[12px] overflow-hidden w-full bg-white dark:bg-transparent shadow-sm">'
    );
}

// 4. Redesign Recent Product cards
page = page.replace(
  /className="border border-\[#e5e7eb\] dark:border-white\/10 shadow-sm rounded-xl p-4 flex flex-col gap-2 bg-white dark:bg-\[#131416\] hover:-translate-y-0\.5 hover:shadow-md transition-all cursor-pointer"/g,
  'className="border border-[#e5e7eb] dark:border-white/5 bg-gradient-to-br from-white to-gray-50 dark:from-[#1b1d20] dark:to-[#131416] shadow-sm hover:shadow-xl rounded-2xl p-5 flex flex-col gap-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden group"'
);
// Make the icon circular box bigger/nicer
page = page.replace(
  /className="w-9 h-9 rounded-full bg-gradient-to-br from-\[#8b919d\] to-\[#d8d3cd\] flex items-center justify-center text-white font-bold text-\[14px\] mb-1"/g,
  'className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b919d] to-[#d8d3cd] flex items-center justify-center text-white font-bold text-[14px] mb-2 shadow-inner group-hover:scale-110 transition-transform duration-300"'
);
page = page.replace(
  /className="w-9 h-9 rounded-full bg-gradient-to-br from-\[#8ab240\] to-\[#b1c062\] flex items-center justify-center text-white font-bold text-\[14px\] mb-1"/g,
  'className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8ab240] to-[#b1c062] flex items-center justify-center text-white font-bold text-[14px] mb-2 shadow-inner group-hover:scale-110 transition-transform duration-300"'
);
page = page.replace(
  /className="text-\[13px\] font-semibold text-ai-text leading-tight group-hover\/pill:text-blue-600"/g,
  'className="text-[14px] font-semibold text-ai-text leading-tight group-hover:text-blue-600 transition-colors"'
);

// 5. Redesign What's New items
page = page.replace(
  /className="border border-ai-border bg-ai-surface p-3\.5 flex items-start gap-4 rounded-xl cursor-pointer hover:bg-ai-hover-1 transition-colors"/g,
  'className="bg-transparent hover:bg-white dark:hover:bg-[#1a1c1f] p-4 flex items-start gap-4 rounded-2xl cursor-pointer hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 group border border-transparent dark:hover:border-white/5"'
);
// the icons
page = page.replace(
  /className="bg-white dark:bg-\[#131416\] border border-ai-border p-2 rounded-lg shrink-0 mt-0\.5"/g,
  'className="bg-gray-50 dark:bg-[#131416] border border-gray-100 dark:border-white/5 p-2.5 rounded-xl shrink-0 mt-0.5 group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-100 dark:group-hover:border-blue-800/30 transition-all duration-300"'
);
page = page.replace(
  /className="text-ai-text font-medium text-\[14px\]"/g,
  'className="text-ai-text font-semibold text-[14px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"'
);


fs.writeFileSync('src/app/page.tsx', page, 'utf8');

console.log("Modifications applied successfully."); 
