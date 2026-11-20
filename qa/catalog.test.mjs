import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {columnPosts,getCategories,changeCategory,removeCategory} from '../editorial/catalog.mjs';
import {article,archive,validate} from '../editorial/render.mjs';
const d=JSON.parse(await readFile(new URL('../content/editorial.json',import.meta.url)));
const visible=new Set(columnPosts(d).map(p=>p.slug));
for(const p of d.posts){const related=article(d,p).split('class="story-grid related"')[1];for(const m of related.matchAll(/href="\/stories\/([^/]+)\//g))assert.ok(visible.has(m[1]));}
assert.ok(!archive(d).includes('data-filter="선교 현장"'));
const old=d.posts[0].category;
changeCategory(d,old,'수정한 분류');assert.equal(d.posts[0].category,'수정한 분류');assert.deepEqual(validate(d),[]);
changeCategory(d,null,'추가 분류');assert.throws(()=>changeCategory(d,null,'추가 분류'));
assert.throws(()=>removeCategory(d,'수정한 분류','없는 분류'));
removeCategory(d,'수정한 분류','추가 분류');assert.equal(d.posts[0].category,'추가 분류');assert.ok(!getCategories(d).includes('수정한 분류'));assert.deepEqual(validate(d),[]);
console.log('PASS: related/list consistency, empty filters, category rename and reassignment');

// A newly published column appears in latest even when also recommended.
const {magazineHome}=await import('../editorial/magazine-home.mjs');
const current=JSON.parse(await readFile(new URL('../content/editorial.json',import.meta.url)));
const fresh=structuredClone(current.posts.find(p=>p.photoCredit));
fresh.slug='future-recommended-column';fresh.title='새 추천 칼럼';fresh.date='2026-11-21';fresh.published=true;fresh.featured=true;
current.posts.unshift(fresh);
const output=magazineHome(current);
const recommended=output.split('<h2>추천 칼럼</h2>')[1].split('<h2>최신 칼럼</h2>')[0];
const latest=output.split('<h2>최신 칼럼</h2>')[1];
assert.ok(recommended.includes('/stories/'+fresh.slug+'/'));
assert.ok(recommended.includes('class="column-photo"'));
assert.ok(latest.includes('/stories/'+fresh.slug+'/'));
fresh.featured=false;current.posts[0]=fresh;
assert.ok(magazineHome(current).split('<h2>최신 칼럼</h2>')[1].includes('/stories/'+fresh.slug+'/'));
console.log('PASS: latest columns update regardless of recommendation; recommended columns display photos');
