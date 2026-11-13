import {buildFiles,validate} from '../editorial/render.mjs';
export const REPO='piseao/daeho',BRANCH='main';
const decode64=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),c=>c.charCodeAt(0)));
export function github(token,fetcher=fetch){return async(path,{method='GET',body}={})=>{const res=await fetcher(`https://api.github.com/repos/${REPO}/${path}`,{method,cache:'no-store',headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});if(!res.ok){const message=({401:'인증이 만료되었거나 토큰이 올바르지 않습니다.',403:'저장소 Contents 쓰기 권한 또는 API 사용 한도를 확인하세요.',404:'저장소 접근 권한 또는 콘텐츠 파일을 확인하세요.',409:'다른 수정이 먼저 저장되었습니다. 최신 내용을 불러와 다시 편집하세요.',422:'발행 중 다른 수정이 감지되었거나 저장소 규칙이 적용되었습니다. 최신 내용을 확인하세요.'})[res.status]||`GitHub 요청 실패 (${res.status}). 잠시 후 다시 시도하세요.`;throw new Error(message);}return res.status===204?null:res.json();};}
export async function loadRemote(api){const ref=await api(`git/ref/heads/${BRANCH}`);const file=await api(`contents/content/editorial.json?ref=${ref.object.sha}`);if(!file.content)throw new Error('콘텐츠 파일을 읽을 수 없습니다.');const data=JSON.parse(decode64(file.content));const errors=validate(data);if(errors.length)throw new Error('원격 콘텐츠 형식을 확인하세요: '+errors[0]);return {data,base:ref.object.sha};}
export async function publish(api,{data,base,previousSlugs,uploads=[]},progress=()=>{}){
 const errors=validate(data);if(errors.length)throw new Error(errors.join('\n'));if(!/^[a-f0-9]{40}$/.test(base||''))throw new Error('먼저 저장소를 연결하세요.');
 const ref=await api(`git/ref/heads/${BRANCH}`);if(ref.object.sha!==base)throw new Error('다른 수정이 먼저 발행되었습니다. 초안을 백업한 뒤 최신 내용을 불러와 반영하세요. 자동 덮어쓰기는 하지 않습니다.');
 const parent=await api(`git/commits/${base}`);const files=buildFiles(data,previousSlugs);const tree=[];
 for(const u of uploads){if(!/^assets\/uploads\/[a-zA-Z0-9-]+\.(webp|png|jpg)$/.test(u.path)||u.base64.length>3000000)throw new Error('업로드 이미지 형식 또는 용량 오류');progress('이미지 저장 중…');const b=await api('git/blobs',{method:'POST',body:{content:u.base64,encoding:'base64'}});tree.push({path:u.path,mode:'100644',type:'blob',sha:b.sha});}
 progress('글과 페이지 저장 중…');for(const [path,content]of Object.entries(files)){tree.push(content===null?{path,mode:'100644',type:'blob',sha:null}:{path,mode:'100644',type:'blob',content});}
 const nextTree=await api('git/trees',{method:'POST',body:{base_tree:parent.tree.sha,tree}});const commit=await api('git/commits',{method:'POST',body:{message:'Publish website content from SDNF editor',tree:nextTree.sha,parents:[base]}});
 progress('발행 확정 중…');await api(`git/refs/heads/${BRANCH}`,{method:'PATCH',body:{sha:commit.sha,force:false}});return commit.sha;
}
