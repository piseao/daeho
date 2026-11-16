import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../../walk/vendor/three.module.js';
import {createBethlehem} from '../worlds/bethlehem.js';
import {createInhabitants} from '../systems/inhabitants.js';
import {MissionStore} from '../systems/missions.js';
import {FlockMission,FLOCK_SPAWNS,FLOCK_SLOTS,FLOCK_HOME} from '../systems/flock.js';
const context={fillRect(){},strokeRect(){},createRadialGradient(){return {addColorStop(){}};}};globalThis.document={createElement:()=>({getContext:()=>context})};
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},store=new MissionStore(storage),ID='bethlehem-flock';
assert.equal(store.status(ID),'AVAILABLE');assert.equal(store.status('unknown'),'LOCKED');assert(!store.deliver(ID,0));store.start(ID);
const stage=new THREE.Group(),obstacles=[],env=createBethlehem({stage,scene:new THREE.Scene(),ambient:new THREE.HemisphereLight(),sun:new THREE.DirectionalLight(),obstacles,mobile:true});
const base=(x,z)=>Math.hypot(x,z)<=47&&!obstacles.some(o=>o.rect?Math.abs(x-o.x)<o.w/2+.3&&Math.abs(z-o.z)<o.d/2+.3:Math.hypot(x-o.x,z-o.z)<o.r+.3);
const walk=(x,z)=>base(x,z)&&base(x+.16,z)&&base(x-.16,z)&&base(x,z+.16)&&base(x,z-.16);
for(const p of [...FLOCK_SPAWNS,...FLOCK_SLOTS])assert(walk(...p),'invalid sheep position '+p);
const inhabitants=createInhabitants({stage,height:env.height,canWalk:base});const actors=inhabitants.makeQuestFlock(FLOCK_SPAWNS);
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');const route=new Function('THREE','sheep','canWalk',app.slice(app.indexOf('function route('),app.indexOf('function go('))+';return route;')(THREE,{position:new THREE.Vector3()},walk);
const player=new THREE.Vector3(28,0,4),events=[];const flock=new FlockMission({store,actors,height:env.height,walk:(x,z,a)=>walk(x,z)&&(!a||inhabitants.actorFree(x,z,a)),route:(from,to)=>route(to.x,to.z,false,from,walk),onEvent:e=>events.push(e)});
let t=0;function tick(){t+=1/60;flock.update(1/60,player);inhabitants.update(t,1/60,player,false,null);for(const a of actors){assert(walk(a.root.position.x,a.root.position.z),'sheep in obstacle');assert(Math.abs(a.root.position.y-env.height(a.root.position.x,a.root.position.z))<.001);}}
function travel(to){const points=route(to[0],to[1],false,player,walk);assert(points,'unreachable player route '+to);for(const target of points){let limit=0;while(Math.hypot(target.x-player.x,target.z-player.z)>.07){assert(limit++<600);const d=target.clone().sub(player),len=Math.hypot(d.x,d.z),step=Math.min(len,2.5/60);player.x+=d.x/len*step;player.z+=d.z/len*step;player.y=env.height(player.x,player.z);tick();}}}
for(let i=0;i<5;i++){if(actors[i].delivered)continue;travel([actors[i].root.position.x,actors[i].root.position.z+1.5]);for(let f=0;f<120;f++)tick();assert(actors[i].following,'sheep failed to follow '+i);travel(FLOCK_HOME);for(let f=0;f<600;f++)tick();assert(actors[i].delivered,'sheep not delivered '+i+' '+JSON.stringify(flock.stats()));}
assert.equal(store.status(ID),'COMPLETED');assert.equal(store.record(ID).collected.length,5);assert.equal(events.filter(e=>e==='complete').length,1);
const reloaded=new MissionStore(storage);assert.equal(reloaded.status(ID),'COMPLETED');assert(reloaded.record(ID).everCompleted);reloaded.start(ID,true);assert.equal(reloaded.status(ID),'ACTIVE');assert(reloaded.record(ID).everCompleted);assert.equal(reloaded.record(ID).collected.length,0);assert(reloaded.deliver(ID,0));assert(!reloaded.deliver(ID,0));assert.equal(new MissionStore(storage).record(ID).collected.length,1);
console.log(JSON.stringify({passed:true,simulationSeconds:Math.round(t),collected:5,events,savedReplayHistory:true}));
// The pen's side wall must block direct attraction and routing must find its opening.
assert(!flock.clear(new THREE.Vector3(18,0,13),new THREE.Vector3(22,0,13)));
const penExit=route(22,13,false,new THREE.Vector3(18,0,13),walk);assert(penExit?.length);assert(penExit.some(p=>p.z>14.5),'pen path must use southern opening');
// Rushing startles; a calm approach at a respectful distance earns attention.
const reactionStore=new MissionStore({getItem:()=>null,setItem(){}});reactionStore.start(ID);
const reactionActors=FLOCK_SPAWNS.map(p=>({root:new THREE.Group()}));const reactions=[];
const reaction=new FlockMission({store:reactionStore,actors:reactionActors,height:env.height,walk,route:(from,to)=>route(to.x,to.z,false,from,walk),onEvent:e=>reactions.push(e)});
const visitor=new THREE.Vector3(32,0,-1);for(let f=0;f<45;f++){visitor.z-=5.4/60;reaction.update(1/60,visitor);}
assert(reactions.includes('startle'),'rushing must startle sheep');assert(!reactionActors[4].following);
for(let f=0;f<180;f++)reaction.update(1/60,visitor);
const p4=reactionActors[4].root.position;visitor.set(p4.x,0,p4.z+2.7);reaction.lastPlayer={x:visitor.x,z:visitor.z};reaction.speed=0;
for(let f=0;f<330;f++)reaction.update(1/60,visitor);
assert(reactionActors[4].following,'calm approach should restore confidence');
console.log('PASS: side-wall obstruction, opening route, startled reaction and calm recovery');
// Gravity and jump return exactly to ground, including long stationary updates.
const {AdventureControls}=await import('../systems/controls.js');
const physics=Object.create(AdventureControls.prototype);physics.jump=physics.velocity=0;assert(physics.startJump());let peak=0;for(let i=0;i<240;i++){physics.update(1/60);peak=Math.max(peak,physics.jump);assert(physics.jump>=0);}assert(peak>.8&&peak<1.2);assert.equal(physics.jump,0);assert.equal(physics.velocity,0);
const legacyStorage=new Map([['sdnf-journey-progress-v1','{"bethlehem":[1,2]}']]);const adapter={getItem:k=>legacyStorage.get(k),setItem:(k,v)=>legacyStorage.set(k,v)};const independent=new MissionStore(adapter);independent.start(ID);independent.deliver(ID,2);independent.discover('bethlehem','passage');const restored=new MissionStore(adapter);assert.deepEqual(restored.record(ID).collected,[2]);assert.deepEqual(restored.data.discoveries.bethlehem,['passage']);assert.equal(legacyStorage.get('sdnf-journey-progress-v1'),'{"bethlehem":[1,2]}');
console.log('PASS: jump landing, discovery persistence, partial progress and legacy save isolation');
