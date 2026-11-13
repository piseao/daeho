import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {buildFiles} from '../editorial/render.mjs';
const d=JSON.parse(await readFile(new URL('../content/editorial.json',import.meta.url),'utf8'));
for(const [path,content] of Object.entries(buildFiles(d))){const url=new URL('../'+path,import.meta.url);await mkdir(new URL('.',url),{recursive:true});await writeFile(url,content);}
console.log('Editorial pages built. Existing walk and journey untouched.');
