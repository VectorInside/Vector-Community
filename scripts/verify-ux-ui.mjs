import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('prototypes/vector-comunity/dist/app.js');
const manual = read('README.md');
const inventory = JSON.parse(read('docs/ux-ui/INVENTARIO.json'));

// Evaluar las funciones reales; no mantener una segunda implementación de fórmulas.
const prefix = source.slice(0, source.indexOf('let state;'));
const calculations = source.slice(source.indexOf('function filteredLeads('), source.indexOf('function heading('));
const csv = source.slice(source.indexOf('function csvCell('), source.indexOf('function exportCSV('))
  + source.slice(source.indexOf('function parseCSV('), source.indexOf('function importDialog('));
assert.ok(prefix.length > 0 && calculations.includes('function aggregate('));
const result = vm.runInNewContext(`${prefix}
let state = seed();
${calculations}
${csv}
const all = aggregate();
const output = {
  contacts: all.leads.length, contacted: all.contacted.length,
  qualified: all.qualified.length, qualifiedAttributed: all.qualifiedAttributed.length,
  pending: all.pending.length, spend: all.spend, revenue: all.revenue,
  attributed: all.attributed, median: all.median, p90: all.p90,
  sla: all.slaResponded,
  open: all.leads.filter(l => !['Ganado', 'Perdido'].includes(l.stage)).length,
  pipeline: all.leads.filter(l => !['Ganado', 'Perdido'].includes(l.stage)).reduce((s,l)=>s+l.value,0),
  cpql: all.spend / all.qualifiedAttributed.length,
  contactability: pct(all.contacted.length, all.leads.length),
  roas: (all.attributed / all.spend).toFixed(2),
  noBase: pct(0,0),
  csvQuoted: parseCSV('a,b\\n"texto, con coma","Firma ""A"""')[1],
  csvProtected: ['=SUM(A1)', '  +formula', '@formula', '-formula'].map(csvCell)
};
let invalidCsvRejected = false;
try { parseCSV('a,b\\n"sin cerrar'); } catch { invalidCsvRejected = true; }
output.invalidCsvRejected = invalidCsvRejected;
state.period = '7';
const seven = aggregate();
output.seven = {contacts:seven.leads.length,spend:seven.spend,qualifiedAttributed:seven.qualifiedAttributed.length,cpql:seven.spend/seven.qualifiedAttributed.length,roas:(seven.attributed/seven.spend).toFixed(2)};
state.period = '30';
const direct = aggregate('direct');
output.direct = {contacts:direct.leads.length,spend:direct.spend};
JSON.stringify(output);`, { Intl, Date, URL });
const actual = JSON.parse(result);
const expected = {
  contacts:24,contacted:16,qualified:9,qualifiedAttributed:8,pending:8,
  spend:12400,revenue:38500,attributed:16800,median:44.5,p90:90,sla:10,
  open:20,pipeline:330000,cpql:1550,contactability:'66.7%',roas:'1.35',noBase:'No calculable'
};
for (const [key, value] of Object.entries(expected)) assert.equal(actual[key], value, `Contrato de manual: ${key}`);
assert.deepEqual(actual.seven,{contacts:12,spend:6700,qualifiedAttributed:2,cpql:3350,roas:'2.51'});
assert.deepEqual(actual.direct,{contacts:2,spend:0});
assert.deepEqual(actual.csvQuoted,['texto, con coma','Firma "A"']);
assert.ok(actual.csvProtected.every(cell=>cell.startsWith('"\'')), 'Protección de fórmulas CSV');
assert.equal(actual.invalidCsvRejected,true);

for (const [file, expectedHash] of Object.entries(inventory.prototype_files)) {
  const bytes=fs.readFileSync(path.join(root,file));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),expectedHash,`Integridad: ${file}`);
}

const blocks=[...manual.matchAll(/```mermaid\n([\s\S]*?)\n```/g)].map(m=>m[1].trim());
assert.equal(blocks.length,7,'Cantidad de diagramas documentados');
assert.equal(blocks.length,inventory.diagrams.length);
inventory.diagrams.forEach((file,index)=>assert.equal(read(file).trim(),blocks[index],`Diagrama editable igual al README: ${file}`));

const anchors=new Set([...manual.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]));
for (const match of manual.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)) {
  const target=match[1];
  if (/^https?:\/\//.test(target)) continue;
  if (target.startsWith('#')) { assert.ok(anchors.has(target.slice(1)),`Ancla inexistente: ${target}`); continue; }
  assert.ok(fs.existsSync(path.resolve(root,decodeURIComponent(target.split('#')[0]))),`Enlace local inexistente: ${target}`);
}

const index=read('prototypes/vector-comunity/dist/index.html');
for (const file of ['styles.css','app.js']) assert.ok(index.includes(file));
for (const file of Object.keys(inventory.prototype_files).filter(p=>p.includes('/assets/'))) assert.ok(fs.existsSync(path.join(root,file)));
console.log('OK: fórmulas y cohorte, filtros, CSV, integridad, 7 diagramas sincronizados y enlaces del manual.');
