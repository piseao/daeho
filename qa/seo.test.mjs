import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {buildFiles,validate} from '../editorial/render.mjs';
const d=JSON.parse(await readFile(new URL('../content/editorial.json',import.meta.url),'utf8'));
const files=buildFiles(d), titles=new Set();let pages=0,links=0;
for(const [path,html] of Object.entries(files)){
 if(!path.endsWith('.html'))continue;
 pages++;
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title);assert.ok(!titles.has(title),`Duplicate title ${path}`);titles.add(title);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,path);
 const canonical='https://sodonotfear.com/'+(path==='index.html'?'':path.replace(/index.html$/,''));
 assert.ok(html.includes(`rel="canonical" href="${canonical}"`),path);
 assert.ok(html.includes('name="description"'));assert.ok(html.includes('name="google-site-verification"'));assert.ok(!html.includes('noindex'));
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 assert.ok(schemas.some(s=>s['@graph']?.some(x=>x['@id']==='https://sodonotfear.com/#organization')));
 assert.ok(!schemas.some(s=>s['@graph']?.some(x=>x['@type']==='FAQPage')));
 for(const [,raw] of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)){
  const u=new URL(raw,'https://sodonotfear.com');let target=u.pathname.slice(1);if(!target||target.endsWith('/'))target+='index.html';
  if(!(target in files))await access(new URL('../'+target,import.meta.url));links++;
 }
}
assert.ok(files['sitemap.xml'].includes('/digital-mission/'));
for(const slug of ['church-archive-is-ministry','church-homepage-and-social-media','ai-and-it-ministry','measure-church-homepage-growth']){
 const html=files[`stories/${slug}/index.html`];assert.ok(html.includes('"dateModified":"2026-11-20"'));assert.ok(html.includes('수정 2026-11-20'));assert.ok(html.includes('href="/digital-mission/"'));
}
const bad=structuredClone(d);bad.posts[0].relatedLinks=[{label:'bad',url:'javascript:alert(1)'}];assert.ok(validate(bad).length);
console.log(`PASS: ${pages} pages; ${links} internal resources; unique titles, canonical, headings, verification, JSON-LD, dates and guide links`);
