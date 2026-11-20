import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildFiles} from '../editorial/render.mjs';
import {publish} from '../admin/publisher.mjs';
const d=JSON.parse(await readFile(new URL('../content/editorial.json',import.meta.url),'utf8'));
const series=d.posts.filter(p=>p.category==='디지털 선교와 은혜');
assert.equal(series.length,10);assert.equal(new Set(series.map(p=>p.image)).size,10);
for(const p of series){const jpg=await readFile(new URL('..'+p.image,import.meta.url));assert.equal(jpg.readUInt16BE(0),0xffd8);assert.ok(p.body.includes('함께 읽을 성경과 신앙고백'));assert.ok(p.photoCredit.photographer);}
const before=structuredClone(d),after=structuredClone(d);
after.posts.unshift({...after.posts[0],slug:'user-next-article-check',title:'직접 작성한 새 글',image:'/assets/uploads/next.webp',photoCredit:undefined});
const base='a'.repeat(40);let tree;
const api=async(path,args={})=>{
 if(path==='git/ref/heads/main')return {object:{sha:base}};
 if(path==='git/commits/'+base)return {tree:{sha:'existing-assets-tree'}};
 if(path==='git/blobs')return {sha:'new-image'};
 if(path==='git/trees'){tree=args.body;return {sha:'next-tree'};}
 if(path==='git/commits')return {sha:'b'.repeat(40)};
 if(path==='git/refs/heads/main')return {};
 throw Error(path);
};
await publish(api,{data:after,base,previousSlugs:before.posts.filter(p=>p.published).map(p=>p.slug),uploads:[{path:'assets/uploads/next.webp',base64:'AAAA'}]});
assert.equal(tree.base_tree,'existing-assets-tree');assert.ok(tree.tree.some(e=>e.path==='assets/uploads/next.webp'));
const persisted=JSON.parse(tree.tree.find(e=>e.path==='content/editorial.json').content);
for(const old of before.posts)assert.deepEqual(persisted.posts.find(p=>p.slug===old.slug),old);
assert.ok(!tree.tree.some(e=>e.sha===null));
const files=buildFiles(persisted);for(const p of series){assert.ok(files['stories/'+p.slug+'/index.html'].includes(p.image));assert.ok(files['stories/'+p.slug+'/index.html'].includes(p.photoCredit.photographer));}
console.log('PASS: 10 licensed JPEGs; next admin publication preserves all existing articles, photos and attribution; adds user article and upload without deletions');
