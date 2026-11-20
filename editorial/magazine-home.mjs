export const magazineHeader=d=>`<header class="mag-header" id="top"><button class="menu menu-toggle" aria-label="메뉴 열기" aria-expanded="false" aria-controls="site-nav">☰</button><a class="brand" href="/">${esc(d.settings.name)}</a><nav id="site-nav" aria-label="주요 메뉴">${d.settings.nav.map(n=>`<a href="${esc(n.url)}">${esc(n.label)}</a>`).join("")}</nav><a class="search" href="/stories/#search" aria-label="검색">⌕</a></header>`;
export const magazineFooter=()=>"<footer>SO DO NOT FEAR · 교회와 선교단체의 디지털 선교를 돕습니다.<p><a href=\"/digital-mission/\">디지털 선교 가이드</a> · <a href=\"/privacy/\">개인정보처리방침</a> · <a href=\"/terms/\">이용약관</a></p></footer>";
function template(d){return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>디지털 선교 · 교회 홈페이지 제작·AI 교육 | SO DO NOT FEAR</title><meta name="description" content="${esc(d.settings.description)}"><link rel="canonical" href="https://sodonotfear.com/"><link rel="stylesheet" href="${STYLESHEET_URL}"></head><body><a class="skip" href="#main">본문 바로가기</a>${magazineHeader(d)}<main></main>${magazineFooter()}<script type="module" src="${SCRIPT_URL}"></script></body></html>`;}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function magazineHome(d){
 const excluded=new Set(['our-confession','we-pray-together','bethlehem-night','a-place-to-rest']);
 const posts=columnPosts(d);
 const lead=posts.find(p=>p.slug==='ai-and-it-ministry')||posts[0];
 const rest=posts.filter(p=>p!==lead),picks=rest.filter(p=>p.featured).slice(0,8);
 const latest=rest.filter(p=>!picks.includes(p)).sort((a,b)=>b.date.localeCompare(a.date));
 const href=p=>'/stories/'+esc(p.slug)+'/';
 const slides=d.settings.slides.slice(0,3);
 const featured=`<section class="feature hero-slider" aria-label="주요 소식" aria-roledescription="캐러셀" tabindex="0">${slides.map((s,i)=>`<article class="hero-slide" ${i?'hidden':''} aria-label="${i+1} / ${slides.length}"><img src="${esc(s.image)}" alt="${esc(s.alt)}" ${i?'loading="lazy"':'fetchpriority="high"'}><div class="hero-copy"><div class="eyebrow">${esc(s.label)}</div><${i?'h2':'h1'}>${esc(s.title).replaceAll('\n','<br>')}</${i?'h2':'h1'}><p>${esc(s.summary)}</p><a class="hero-link" href="${esc(s.link)}">${esc(s.button)} ↗</a></div></article>`).join('')}<div class="hero-controls"><button type="button" data-hero-prev aria-label="이전 슬라이드">←</button><span data-hero-count>1 / ${slides.length}</span><button type="button" data-hero-next aria-label="다음 슬라이드">→</button><button type="button" data-hero-pause aria-label="자동 재생 정지">Ⅱ</button></div></section>`;
 const cards=picks.map((p,i)=>`<a class="card" href="${href(p)}"><div class="art ${['a','b','c','d'][i%4]}"><span>${['Learn.','Create.','Share.','Grow.','Connect.','Build.','Serve.','Explore.'][i]}</span></div><div class="eyebrow">${esc(p.category)}</div><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><span class="tag">#${esc(p.category)}</span></a>`).join('');
 const body=featured+(picks.length?`<div class="heading"><h2>추천 칼럼</h2><a href="/stories/">전체 보기 ＋</a></div><section class="grid">${cards}</section>`:'')+(latest.length?`<div class="heading"><h2>최신 칼럼</h2><a href="/stories/">더 보기 ＋</a></div>${latest.map(p=>`<a class="latest" href="${href(p)}"><h3>${esc(p.title)}</h3><small>${esc(p.category)} · ${esc(p.date)}</small></a>`).join('')}`:'');
 return template(d).replace(/<main>[\s\S]*?<\/main>/,`<main id="main">${body}</main>`);
}
import { STYLESHEET_URL, SCRIPT_URL } from "./assets.mjs";
import { getCategories, columnPosts, changeCategory, removeCategory } from "./catalog.mjs";
