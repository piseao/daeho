const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('#site-nav');
const setMenu=open=>{menu?.setAttribute('aria-expanded',String(open));nav?.classList.toggle('open',open);};
menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
nav?.addEventListener('click',()=>setMenu(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}});
const form=document.querySelector('#search'),query=document.querySelector('#story-query');let category='전체';
function filter(){let n=0;const q=query.value.trim().toLowerCase();document.querySelectorAll('.archive .story-card').forEach(c=>{c.hidden=!(c.dataset.search.includes(q)&&(category==='전체'||c.dataset.category===category));if(!c.hidden)n++;});document.querySelector('#search-count').textContent=`${n}편의 이야기`;document.querySelector('#empty-results').hidden=n>0;}
if(form){form.addEventListener('submit',e=>{e.preventDefault();filter();});query.addEventListener('input',filter);document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter();}));filter();}
document.querySelector('[data-share]')?.addEventListener('click',async()=>{const status=document.querySelector('#share-status');try{await navigator.clipboard.writeText(location.href);status.textContent=' 주소를 복사했습니다.';}catch{status.textContent=' 주소창에서 이 페이지의 주소를 복사해 주세요.';}});
const legacy={mission:'/about/#mission',faith:'/about/#faith','ai-mission':'/about/#ai-mission',worship:'/worship/',prayer:'/worship/#message',notice:'/worship/#notice','free-homepage':'/learn/',faq:'/learn/#faq',contact:'/contact/','lecture-contact':'/contact/#lecture-contact'};if(location.pathname==='/'&&legacy[location.hash.slice(1)])location.replace(legacy[location.hash.slice(1)]);
const hero=document.querySelector('.hero-slider');
if(hero){
 const slides=[...hero.querySelectorAll('.hero-slide')],pause=hero.querySelector('[data-hero-pause]');
 let current=0,timer,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const show=n=>{current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==current);hero.querySelector('[data-hero-count]').textContent=`${current+1} / ${slides.length}`;};
 const stop=()=>clearInterval(timer);
 const start=()=>{stop();if(playing&&slides.length>1&&!document.hidden)timer=setInterval(()=>show(current+1),6000);};
 const label=()=>{pause.textContent=playing?'Ⅱ':'▶';pause.setAttribute('aria-label',playing?'자동 재생 정지':'자동 재생 시작');};
 const manual=n=>{playing=false;stop();label();show(n);};
 hero.querySelector('[data-hero-prev]').addEventListener('click',()=>manual(current-1));
 hero.querySelector('[data-hero-next]').addEventListener('click',()=>manual(current+1));
 pause.addEventListener('click',()=>{playing=!playing;label();start();});
 hero.addEventListener('mouseenter',stop);hero.addEventListener('mouseleave',()=>{if(!hero.contains(document.activeElement))start();});
 hero.addEventListener('focusin',stop);hero.addEventListener('focusout',e=>{if(!hero.contains(e.relatedTarget))start();});
 hero.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();manual(current+(e.key==='ArrowLeft'?-1:1));}});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());label();start();
}
