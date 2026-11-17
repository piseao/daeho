import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {buildFiles} from '../editorial/render.mjs';
import {serviceHome} from '../editorial/service-home.mjs';
const d=JSON.parse(await readFile(new URL('../content/editorial.json',import.meta.url),'utf8'));
const files=buildFiles(d);files['index.html']=serviceHome(d).replace('</body>','<script type="module" src="/editorial/service-home.js?v=1"></script></body>');for(const [path,content] of Object.entries(files)){const url=new URL('../'+path,import.meta.url);await mkdir(new URL('.',url),{recursive:true});await writeFile(url,content);}
console.log('Editorial pages built. Existing walk and journey untouched.');
