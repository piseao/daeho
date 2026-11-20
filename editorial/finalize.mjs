const ORIGIN='https://sodonotfear.com';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=v=>JSON.stringify(v).replace(/</g,'\\u003c');
export function finalizePage(content,path,d){
 if(typeof content!=='string')return content;
 const url=ORIGIN+'/'+(path==='index.html'?'':path.replace(/index\.html$/,''));
 const title=content.match(/<title>(.*?)<\/title>/)?.[1];
 const name=title?.replace(/ \| (?:SO DO NOT FEAR|So Do Not Fear)$/,'');
 const graph=[{'@type':'Organization','@id':ORIGIN+'/#organization',name:d.settings.name,url:ORIGIN+'/',description:d.settings.description,sameAs:[d.settings.youtube,d.settings.instagram].filter(Boolean)}, {'@type':'WebSite','@id':ORIGIN+'/#website',url:ORIGIN+'/',name:d.settings.name,publisher:{'@id':ORIGIN+'/#organization'},inLanguage:'ko-KR'}, {'@type':'WebPage','@id':url+'#webpage',url,name,isPartOf:{'@id':ORIGIN+'/#website'},about:{'@id':ORIGIN+'/#organization'},inLanguage:'ko-KR'}];
 if(path!=='index.html')graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'SO DO NOT FEAR',item:ORIGIN+'/'},...(path.startsWith('stories/')&&path!=='stories/index.html'?[{'@type':'ListItem',position:2,name:'칼럼',item:ORIGIN+'/stories/'},{'@type':'ListItem',position:3,name,item:url}]:[{'@type':'ListItem',position:2,name,item:url}])]});
 if(path==='learn/index.html')graph.push({'@type':'Service',name:'교회·선교단체 홈페이지 제작 및 AI 활용 교육',url,provider:{'@id':ORIGIN+'/#organization'},serviceType:['홈페이지 제작','AI 활용 교육','디지털 운영 지원']});
 // Use the decoded title for JSON-LD, rather than HTML entities.
 const decode=s=>s?.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
 for(const item of graph){if(item.name)item.name=decode(item.name);if(item.itemListElement)for(const crumb of item.itemListElement)crumb.name=decode(crumb.name);}
 let tags=`<script type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script>`;
 if(!content.includes('name="robots"'))tags+='<meta name="robots" content="index,follow">';
 if(!content.includes('name="google-site-verification"'))tags+='<meta name="google-site-verification" content="JJe_kR4Po0XtktfA4Ueo1ctwApZzludMs4xIx9BEOnQ">';
 if(!content.includes('name="naver-site-verification"'))tags+='<meta name="naver-site-verification" content="90a71179b111dd3c55d1baa24fe77d1b9d9706e1">';
 if(!content.includes('property="og:title"'))tags+=`<meta property="og:title" content="${title}"><meta property="og:description" content="${esc(d.settings.description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:image" content="${esc(new URL(d.settings.heroImage,ORIGIN).href)}"><meta name="twitter:card" content="summary_large_image">`;
 return content.replace('</head>',tags+'</head>');
}
