// All movement is physical: proximity recruits sheep; arrival in the pasture delivers them.
export const FLOCK_SPAWNS=[[18,13],[14,20],[8,18],[23,-4],[32,-8]];
export const FLOCK_HOME=[28,4];
export const FLOCK_SLOTS=[[30,1],[32,1],[34,1],[34,3],[34,5]];
export class FlockMission {
 constructor({store,actors,height,walk,route,onEvent=()=>{}}){Object.assign(this,{store,actors,height,walk,route,onEvent});this.id='bethlehem-flock';this.time=0;this.lastPlayer=null;this.speed=0;this.reset();}
 reset(){const r=this.store.record(this.id);this.actors.forEach((a,i)=>{a.quest=true;a.questIndex=i;a.following=false;a.trust=0;a.fright=0;a.delivered=r.collected.includes(i);a.state=a.delivered?'home':'graze';a.nav=[];a.repath=0;const p=a.delivered?FLOCK_SLOTS[i]:FLOCK_SPAWNS[i];a.root.position.set(p[0],this.height(...p),p[1]);});}
 clear(a,b){const length=Math.hypot(b.x-a.x,b.z-a.z);for(let d=0;d<=length;d+=.15){const u=length?d/length:0;if(!this.walk(a.x+(b.x-a.x)*u,a.z+(b.z-a.z)*u))return false;}return this.walk(b.x,b.z);}
 update(dt,player){if(dt<=0)return;this.time+=dt;const measured=this.lastPlayer?Math.hypot(player.x-this.lastPlayer.x,player.z-this.lastPlayer.z)/dt:0;this.speed+=(measured-this.speed)*(1-Math.exp(-dt*8));this.lastPlayer={x:player.x,z:player.z};const active=this.store.status(this.id)==='ACTIVE';for(const a of this.actors){const p=a.root.position,i=a.questIndex,d=Math.hypot(player.x-p.x,player.z-p.z);a.questWalking=false;if(a.delivered){a.state='home';continue;}
 const visible=d<7&&this.clear(p,player);a.fright=Math.max(0,(a.fright||0)-dt);
 if(active&&visible&&d<5&&this.speed>4.3&&a.fright<.1){a.fright=2.5;a.trust=0;a.following=false;a.nav=[];this.onEvent('startle',i);}
 const crowded=active&&visible&&d<1.7;
 if(active&&!a.following&&a.fright===0&&visible&&d>=1.7&&d<4.3&&this.speed<3.8){a.trust=Math.min(1,(a.trust||0)+dt/.9);}else if(!a.following)a.trust=Math.max(0,(a.trust||0)-dt*.4);
 if(a.trust>=1&&!a.following){a.following=true;a.repath=0;this.onEvent('follow',i);}

 if(a.following&&d>10){a.following=false;a.nav=[];this.onEvent('wait',i);}
 let target=null;if(a.fright>0||crowded){a.state=a.fright>0?'startled':'space';const length=Math.max(.01,d);target={x:p.x+(p.x-player.x)/length*2,z:p.z+(p.z-player.z)/length*2};}
 else if(a.following){a.state='follow';if(d>1.6+i*.13){a.repath-=dt;if(this.clear(p,player)){target=player;a.nav=[];}else{if(a.repath<=0){a.nav=this.route(p,player)||[];a.repath=1.2+i*.12;}while(a.nav.length&&Math.hypot(a.nav[0].x-p.x,a.nav[0].z-p.z)<.16)a.nav.shift();target=a.nav[0];}}}
 else{a.state=a.trust>.05?'curious':Math.sin(this.time*.5+i)>0?'graze':'wander';if(a.state==='wander'){const spawn=FLOCK_SPAWNS[i];target={x:spawn[0]+Math.sin(this.time*.27+i)*.55,z:spawn[1]+Math.cos(this.time*.31+i)*.55};}}
 if(target){const dx=target.x-p.x,dz=target.z-p.z,len=Math.hypot(dx,dz),step=Math.min(len,dt*(a.fright>0?2.6:crowded?1.2:a.following?3.65:.3));if(len>.03){const candidates=[[dx/len,dz/len]];for(const angle of [.6,-.6,1,-1])candidates.push([(dx*Math.cos(angle)-dz*Math.sin(angle))/len,(dx*Math.sin(angle)+dz*Math.cos(angle))/len]);for(const [vx,vz]of candidates){const nx=p.x+vx*step,nz=p.z+vz*step;if(!this.walk(nx,nz,a)||Math.hypot(nx-player.x,nz-player.z)<1.05||this.actors.some(b=>b!==a&&Math.hypot(nx-b.root.position.x,nz-b.root.position.z)<.9))continue;p.x=nx;p.z=nz;a.questWalking=true;const angle=Math.atan2(vx,vz);a.root.rotation.y+=Math.atan2(Math.sin(angle-a.root.rotation.y),Math.cos(angle-a.root.rotation.y))*Math.min(1,dt*5);break;}}}
 p.y=this.height(p.x,p.z);
 if(active&&a.following&&Math.hypot(p.x-FLOCK_HOME[0],p.z-FLOCK_HOME[1])<3.8&&this.store.deliver(this.id,i)){a.delivered=true;a.following=false;a.state='home';a.homeTarget=FLOCK_SLOTS[i];this.onEvent(this.store.status(this.id)==='COMPLETED'?'complete':'deliver',i);}
 }
 // Arrived sheep walk into their resting formation; no teleport on delivery.
 for(const a of this.actors.filter(a=>a.delivered)){const p=a.root.position,t=FLOCK_SLOTS[a.questIndex],len=Math.hypot(t[0]-p.x,t[1]-p.z);if(len>.12){const nx=p.x+(t[0]-p.x)/len*dt*.65,nz=p.z+(t[1]-p.z)/len*dt*.65;if(this.walk(nx,nz,a)&&!this.actors.some(b=>b!==a&&Math.hypot(nx-b.root.position.x,nz-b.root.position.z)<.9)&&Math.hypot(nx-player.x,nz-player.z)>1.05){p.set(nx,this.height(nx,nz),nz);a.root.rotation.y=Math.atan2(t[0]-p.x,t[1]-p.z);a.questWalking=true;}}}
 }
 stats(){return this.actors.map(a=>({id:a.questIndex,position:a.root.position.toArray(),state:a.state,trust:Math.round((a.trust||0)*100)/100,following:a.following,delivered:a.delivered}));}
}
