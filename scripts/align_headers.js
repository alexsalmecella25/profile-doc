const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// Align left side header and search bar on the same row.
const leftHeaderRegex = /<div className="w-full flex flex-col gap-8 mb-6">\s*<h2 className="text-\[20px\] font-medium text-ai-text shrink-0">\s*Recent Cases\s*<\/h2>\s*<div className="flex items-center w-full justify-between">/m;
const newLeftHeader = `<div className="w-full flex items-center justify-between mb-6">
                            <h2 className="text-[20px] font-medium text-ai-text shrink-0">
                              Recent Cases
                            </h2>
                            <div className="flex items-center shrink-0">`;
page = page.replace(leftHeaderRegex, newLeftHeader);

// Adjust right side margins to match mb-6
page = page.replace(
  '<div className="flex items-center justify-between mb-4">\n                            <h3 className="text-[20px] font-medium text-ai-text">Recent Products</h3>',
  '<div className="flex items-center justify-between mb-6">\n                            <h3 className="text-[20px] font-medium text-ai-text">Recent Products</h3>'
);

page = page.replace(
  '<div className="flex items-center justify-between mb-4">\n                            <h3 className="text-[20px] font-medium text-ai-text">What\'s New</h3>',
  '<div className="flex items-center justify-between mb-6">\n                            <h3 className="text-[20px] font-medium text-ai-text">What\'s New</h3>'
);

fs.writeFileSync('src/app/page.tsx', page, 'utf8');
console.log("Alignments updated");
