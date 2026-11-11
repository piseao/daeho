import * as THREE from '../../walk/vendor/three.module.js';
// Own Korean summaries. No invented historical dialogue or copied Bible translation.
export const scenes=[
 {id:'arrival',title:'베들레헴에 이르는 길',duration:17,reference:'누가복음 2:1–5',audio:null,
  shots:[{at:0,eye:[-8,6,32],look:[0,1,17]},{at:8,eye:[4,4,23],look:[0,1,10]},{at:17,eye:[-2,3,15],look:[0,1,-10]}],
  cues:[{at:0,text:'호적 등록의 때, 요셉은 마리아와 함께 베들레헴으로 향했습니다.',kind:'성경 요약'},{at:8,text:'먼 길 끝의 작은 마을. 이곳에서 탄생의 이야기가 이어집니다.',kind:'장면 안내'}]},
 {id:'birth',title:'구유가 놓인 작은 자리',duration:28,reference:'누가복음 2:6–7',audio:null,
  shots:[{at:0,eye:[0,6,12],look:[0,2,-19]},{at:9,eye:[0,3.6,-9],look:[0,1.5,-20]},{at:19,eye:[-1.7,2.7,-15.7],look:[0,1,-20.1]},{at:28,eye:[1.7,2.4,-16.1],look:[0,1,-20.1]}],
  cues:[{at:0,text:'베들레헴에 머무는 동안 마리아는 첫아들을 낳았습니다.',kind:'성경 요약'},{at:10,text:'아기를 천으로 감싸 구유에 눕혔습니다. 머물 자리가 넉넉하지 않았습니다.',kind:'성경 요약'},{at:20,text:'성육신은 하나님의 아들이 우리의 삶 가운데 오셨다는 고백입니다.',kind:'묵상 해설'}]},
 {id:'shepherds',title:'들판에 전해진 기쁜 소식',duration:24,reference:'누가복음 2:8–14',audio:null,
  shots:[{at:0,eye:[22,4,22],look:[28,1,10]},{at:8,eye:[22,4.5,17],look:[28,4.2,7]},{at:16,eye:[32,4.2,18],look:[28,2.5,8]},{at:24,eye:[24,3,18],look:[28,1,8]}],
  cues:[{at:0,text:'목자들은 들에서 밤을 지내며 양 떼를 돌보고 있었습니다.',kind:'성경 요약'},{at:7,text:'주의 천사가 나타나고 빛이 그들을 둘렀습니다. 목자들은 두려워했습니다.',kind:'성경 요약'},{at:13,text:'천사는 백성에게 큰 기쁨이 될 소식을 알렸습니다. 다윗의 동네에 구주가 나셨습니다.',kind:'성경 요약'},{at:19,text:'하늘의 무리가 하나님을 찬양하며 영광과 평화를 선포했습니다.',kind:'성경 요약'}]},
];
export class Cinematics {
 constructor({camera,audio,reduced,onEnd,onRead,onCue=()=>{},constrain=()=>{},registry={bethlehem:scenes}}){
  Object.assign(this,{camera,audio,reduced,onEnd,onRead,onCue,constrain,registry});
  this.world='bethlehem';this.active=false;this.returning=0;this.elapsed=0;this.token=0;this.root=document.querySelector('#cinematic');
  document.querySelector('#cinema-skip').onclick=()=>this.finish(true);
  document.querySelector('#cinema-replay').onclick=()=>this.kind==='observation'&&this.observationTarget?this.observe(this.observationTarget):this.start(this.index);
  document.querySelector('#cinema-continue').onclick=()=>this.close();
  document.querySelector('#cinema-read').onclick=()=>{const index=this.index;this.close();if(index!==null)this.onRead(index);};
  document.addEventListener('keydown',e=>{if(e.code==='Escape'&&!this.root.hidden){e.preventDefault();this.active?this.finish(true):this.close();}});
 }
 setWorld(world){this.cancel();this.world=world;}
 start(selection){
  this.audio.stopNarration();const token=++this.token;
  this.kind=typeof selection==='number'?'story':'observation';this.index=this.kind==='story'?selection:null;
  this.data=this.kind==='story'?this.registry[this.world]?.[selection]:selection;if(!this.data)return;
  this.entryEye=this.camera.position.clone();this.entryRotation=this.camera.quaternion.clone();
  this.elapsed=0;this.returning=0;this.active=true;this.root.hidden=false;this.lastCue=-1;
  document.body.classList.add('cinematic');document.querySelector('#cinema-actions').hidden=true;
  document.querySelector('#cinema-skip').hidden=false;document.querySelector('#cinema-read').hidden=this.kind!=='story';
  document.querySelector('#cinema-heading').textContent=this.data.title;
  document.querySelector('#cinema-source').textContent=this.data.reference||'생활문화 · 추정 재현';
  document.querySelector('#cinema-note').textContent=this.data.id==='birth'?'예수님의 형상은 표현하지 않았습니다. 마리아·요셉은 연출용 시안입니다.':this.kind==='observation'?'생활 동작과 배치는 이해를 돕는 재현입니다.':'성경 요약과 시각적 재현을 구분해 살펴보세요.';
  this.audio.setDucking(this.kind==='story');
  if(this.data.audio)this.audio.playNarration(this.data.audio).then(()=>{if(token===this.token&&this.active)this.audio.setDucking(true);});
  this.tick(0);document.querySelector('#cinema-skip').focus();
 }
 observe(target){
  this.observationTarget=target;
  const p=target.position(),eye=p.clone().add(new THREE.Vector3(2.8,2,4.5)),look=p.clone().add(new THREE.Vector3(0,.9,0));
  target.interact?.();this.start({id:target.id,title:target.label,duration:9,reference:target.reference,audio:null,
   shots:[{at:0,eye:eye.toArray(),look:look.toArray()},{at:9,eye:p.clone().add(new THREE.Vector3(-1.2,2.2,4.8)).toArray(),look:look.toArray()}],
   cues:[{at:0,kind:'생활 관찰',text:target.description}]});
 }
 tick(dt){
  if(!this.active){if(this.returning>0){this.returning=Math.max(0,this.returning-dt/1.4);if(!this.reduced){const u=THREE.MathUtils.smoothstep(1-this.returning,0,1),end=this.camera.position.clone(),q=this.camera.quaternion.clone();this.camera.position.lerpVectors(this.returnEye,end,u);this.camera.quaternion.slerpQuaternions(this.returnRotation,q,u);}}return;}
  // Never rewind to zero after a voice ends or stalls; captions follow media time when available.
  const voice=this.audio.voice;
  this.elapsed=voice&&!voice.paused&&!voice.ended?Math.max(this.elapsed,voice.currentTime):this.elapsed+dt;
  const t=Math.min(this.elapsed,this.data.duration),shots=this.data.shots;
  let i=shots.findIndex((s,j)=>j<shots.length-1&&t<shots[j+1].at);if(i<0)i=shots.length-2;
  const a=shots[i],b=shots[i+1],u=this.reduced?0:THREE.MathUtils.smoothstep(t,a.at,b.at);
  const eye=new THREE.Vector3(...a.eye).lerp(new THREE.Vector3(...b.eye),u),look=new THREE.Vector3(...a.look).lerp(new THREE.Vector3(...b.look),u);
  // A portrait screen needs the same subject width, not a clipped close-up.
  if(this.camera.aspect<1)eye.sub(look).multiplyScalar(Math.min(1.6,1/this.camera.aspect)).add(look);
  this.constrain(eye,look);this.camera.position.copy(eye);this.camera.lookAt(look);
  if(!this.reduced&&t<1.2){const blend=THREE.MathUtils.smoothstep(t,0,1.2),q=this.camera.quaternion.clone();this.camera.position.lerpVectors(this.entryEye,eye,blend);this.camera.quaternion.slerpQuaternions(this.entryRotation,q,blend);}
  this.constrain(this.camera.position,look);
  let cue=0;this.data.cues.forEach((c,j)=>{if(t>=c.at)cue=j;});
  if(cue!==this.lastCue){this.lastCue=cue;const c=this.data.cues[cue];document.querySelector('#cinema-kind').textContent=c.kind;document.querySelector('#cinema-subtitle').textContent=c.text;this.onCue(this.data.id,cue);}
  document.querySelector('#cinema-progress').value=t/this.data.duration;if(t>=this.data.duration)this.finish(false);
 }
 finish(skipped){if(!this.active)return;this.returnEye=this.camera.position.clone();this.returnRotation=this.camera.quaternion.clone();this.returning=1;this.active=false;this.token++;this.audio.stopNarration();document.querySelector('#cinema-actions').hidden=false;document.querySelector('#cinema-skip').hidden=true;document.querySelector('#cinema-replay').focus();if(this.kind==='story')this.onEnd(this.index,!skipped);}
 close(){if(this.active)this.finish(true);this.root.hidden=true;document.body.classList.remove('cinematic');this.audio.stopNarration();document.querySelector('#read-story').focus();}
 cancel(){this.token++;this.returning=0;this.active=false;this.root.hidden=true;document.body.classList.remove('cinematic');this.audio.stopNarration();}
}
