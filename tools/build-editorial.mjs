import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {buildFiles} from '../editorial/render.mjs';
import {serviceHome} from '../editorial/service-home.mjs';
const d=JSON.parse(await readFile(new URL('../content/editorial.json',import.meta.url),'utf8'));
const files=buildFiles(d);const schema=JSON.stringify({'@context':'https://schema.org','@type':'ProfessionalService','name':'SO DO NOT FEAR','url':'https://sodonotfear.com/','description':d.settings.description,'serviceType':['AI 홈페이지 제작','AI 제작 환경 구축','교회 홈페이지 운영 지원']});files['index.html']=serviceHome(d).replace('</head>',`<script type="application/ld+json">${schema}</script></head>`).replace('</body>','<script type="module" src="/editorial/service-home.js?v=1"></script></body>');for(const [path,content] of Object.entries(files)){const url=new URL('../'+path,import.meta.url);await mkdir(new URL('.',url),{recursive:true});await writeFile(url,content);}
console.log('Editorial pages built. Existing walk and journey untouched.');
