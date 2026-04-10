const fs = require('fs');
const path = require('path');

const dict = {
  "Casos recientes": "Recent Cases",
  "Productos recientes": "Recent Products",
  "Ver todos": "View all",
  "Ver todas": "View all",
  "Novedades": "What's New",
  "Tumor desmoplástico": "Desmoplastic tumor",
  "Meningioma atípico": "Atypical meningioma",
  "Revisión valvular": "Valve revision",
  "Metástasis Hepáticas": "Hepatic metastases",
  "Escriba un nombre para la carpeta": "Enter folder name",
  "Mover": "Move",
  "Cancelar": "Cancel",
  "Ischemic colitis": "Ischemic colitis", // just in case
};

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [es, en] of Object.entries(dict)) {
    if (content.includes(es)) {
      content = content.split(es).join(en);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Translated in: ${file}`);
  }
}
