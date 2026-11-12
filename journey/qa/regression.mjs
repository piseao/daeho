// Run: node journey/qa/regression.mjs. CPU integration checks; not a browser/FPS substitute.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../../walk/vendor/three.module.js';
import {worlds} from '../worlds.js';
import {createBethlehem} from '../worlds/bethlehem.js';
import {createInhabitants} from '../systems/inhabitants.js';
import {JourneyAudio,scores} from '../systems/audio.js';
import {scenes} from '../systems/cinematics.js';
const context={fillRect(){},strokeRect(){},createRadialGradient(){return {addColorStop(){}};}};
globalThis.document={createElement:()=>({getContext:()=>context})};
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)};
const stage=new THREE.Group(),scene=new THREE.Scene(),ambient=new THREE.HemisphereLight(),sun=new THREE.DirectionalLight(),obstacles=[];
const env=createBethlehem({stage,scene,ambient,sun,obstacles,mobile:false});
const walk=(x,z)=>Math.hypot(x,z)<=env.layout.radius&&!obstacles.some(o=>o.rect?Math.abs(x-o.x)<o.w/2+.3&&Math.abs(z-o.z)<o.d/2+.3:Math.hypot(x-o.x,z-o.z)<o.r+.3);
assert.equal(worlds.length,11);assert.equal(worlds.reduce((s,w)=>s+w.stories.length,0),33);
assert.equal(new Set(env.architectureTypes).size,5);
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const routeSource=app.slice(app.indexOf('function route('),app.indexOf('function go('));
const avatar={position:new THREE.Vector3(...[env.layout.spawn[0],0,env.layout.spawn[1]])};
const route=new Function('THREE','sheep','canWalk',routeSource+';return route;')(THREE,avatar,walk);
const targets=[...env.layout.places.map(p=>p.at),...env.layout.stories,[26,-15.5],[26,-20.5]];let routes=0;
for(const from of [env.layout.spawn,...env.layout.places.map(p=>p.at)]){
 avatar.position.set(from[0],env.height(...from),from[1]);
 for(const to of targets){assert(walk(...to),'destination intersects obstacle');const points=route(...to);assert(points,`No route ${from} -> ${to}`);let previous=avatar.position;
  for(const p of points){const len=Math.hypot(p.x-previous.x,p.z-previous.z);for(let d=.05;d<len;d+=.05){const u=d/len;assert(walk(previous.x+(p.x-previous.x)*u,previous.z+(p.z-previous.z)*u),'route clips a wall');}previous=p;}
  routes++;
 }
}
const inhabitants=createInhabitants({stage,height:env.height,canWalk:walk});const starts=inhabitants.stats();const states=new Set();let minimumGap=Infinity;
const observer=new THREE.Vector3(0,0,29);
for(let frame=0;frame<60*90;frame++){
 inhabitants.update(frame/60,1/60,observer,false,null);
 if(frame%15)continue;const cast=inhabitants.stats();
 for(const a of cast){assert(a.valid,`${a.kind} entered obstacle`);states.add(a.state);assert(Math.abs(a.position[1]-env.height(a.position[0],a.position[2]))<.001,'actor floats above terrain');}
 for(let i=0;i<cast.length;i++)for(let j=i+1;j<cast.length;j++){const a=cast[i],b=cast[j],gap=Math.hypot(a.position[0]-b.position[0],a.position[2]-b.position[2])-(a.kind==='sheep'?.42:.32)-(b.kind==='sheep'?.42:.32);minimumGap=Math.min(minimumGap,gap);assert(gap>=-.01,'actor bodies overlap');}
}
const ends=inhabitants.stats();const moved=ends.filter((a,i)=>Math.hypot(a.position[0]-starts[i].position[0],a.position[2]-starts[i].position[2])>.15).length;assert(moved>=8,'too many stationary actors');assert(states.has('graze')&&states.has('look')&&states.has('walk')&&states.has('work')&&states.has('sit'));
assert.equal(ends.filter(a=>['mary','joseph'].includes(a.kind)).length,2);
assert.equal(env.targets().length,5);
assert(inhabitants.targets().every(t=>!['mary','joseph','jesus'].includes(t.id)));
for(const target of env.targets()){const p=target.position();assert([p.x,p.y,p.z].every(Number.isFinite));const eye=p.clone().add(new THREE.Vector3(3,2,5));env.constrainView(eye,p);assert(eye.toArray().every(Number.isFinite));}
const audio=new JourneyAudio();assert.equal(audio.ctx,undefined,'audio must not start before interaction');assert.equal(audio.settings.enabled,false);audio.set('musicVolume',2);assert.equal(audio.settings.musicVolume,1);audio.set('ambienceVolume',-1);assert.equal(audio.settings.ambienceVolume,0);audio.set('narrationVolume',NaN);assert.equal(audio.settings.narrationVolume,0);assert.equal(new JourneyAudio().settings.musicVolume,1);for(const w of worlds)assert(scores[w.id],'missing world score');
for(const s of scenes){assert(s.cues.length>=2);assert.equal(s.shots[0].at,0);assert.equal(s.shots.at(-1).at,s.duration);let previous=-1;for(const cue of s.cues){assert(cue.at>previous&&cue.at<s.duration);assert(['성경 요약','묵상 해설','장면 안내'].includes(cue.kind));previous=cue.at;}for(const shot of s.shots)assert([...shot.eye,...shot.look].every(Number.isFinite));}
console.log(JSON.stringify({passed:true,worlds:worlds.length,stories:33,architecture:env.architectureTypes,compounds:env.compoundCount,roofedRooms:env.buildingCount,routes,simulationSeconds:90,actors:ends.length,moved,states:[...states],minimumActorGap:minimumGap,audioProfiles:Object.keys(scores).length,scenes:scenes.length},null,2));
