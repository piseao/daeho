import * as THREE from '../../walk/vendor/three.module.js';
// Original lightweight supporting cast. These are production prototypes, not final hero models.
export function createInhabitants({stage,height,canWalk}) {
 const actors=[],materials=new Map(),sphere=new THREE.SphereGeometry(1,14,10),shoe=new THREE.SphereGeometry(1,10,7);
 const mat=c=>{if(!materials.has(c))materials.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.95}));return materials.get(c);};
 function ell(parent,c,x,y,z,sx,sy,sz,geo=sphere){const m=new THREE.Mesh(geo,mat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
 function cloth(parent,c,points){const g=new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),16),p=g.attributes.position;for(let i=0;i<p.count;i++){const angle=Math.atan2(p.getZ(i),p.getX(i)),fold=1+.045*Math.sin(angle*8);p.setX(i,p.getX(i)*fold);p.setZ(i,p.getZ(i)*fold);}g.computeVertexNormals();const m=new THREE.Mesh(g,mat(c));m.castShadow=true;parent.add(m);return m;}
 function human(c,carry=false){const root=new THREE.Group(),torso=new THREE.Group(),head=new THREE.Group();root.add(torso);torso.position.y=.28;
 cloth(torso,c,[[.29,0],[.32,.12],[.25,.58],[.22,.9],[.28,1.05],[.2,1.14],[.12,1.18]]);
 const belt=cloth(torso,'#68523d',[[.253,.54],[.253,.6]]);head.position.y=1.38;torso.add(head);
 ell(head,'#72513c',0,.02,0,.19,.23,.17);ell(head,'#b98a64',0,-.01,.045,.17,.205,.16);
 ell(head,'#c39870',0,-.015,.202,.035,.055,.045);for(const side of [-1,1]){ell(head,'#2f2924',side*.069,.035,.185,.017,.019,.012);ell(head,'#b98a64',side*.168,0,0,.035,.065,.04);}
 ell(head,'#87785a',0,.16,-.03,.215,.12,.2);const drape=ell(head,'#87785a',0,-.12,-.12,.21,.29,.07);drape.rotation.x=-.12;
 const arms=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.25,1.03,0);torso.add(arm);ell(arm,c,side*.015,-.13,0,.09,.23,.1);const fore=new THREE.Group();fore.position.set(side*.02,-.32,0);arm.add(fore);ell(fore,c,0,-.09,0,.075,.16,.08);ell(fore,'#b98a64',0,-.23,.02,.07,.09,.055);if(carry){arm.rotation.x=-.45;fore.rotation.x=-.9;}arms.push(arm);}
 const legs=[];for(const side of [-1,1]){const leg=new THREE.Group();leg.position.set(side*.12,.32,0);root.add(leg);ell(leg,'#a58a68',0,-.1,0,.07,.22,.08);ell(leg,'#5d4936',0,-.26,.055,.1,.06,.17,shoe);legs.push(leg);}
 if(carry){ell(torso,'#b77b53',0,.62,.37,.22,.3,.22);cloth(torso,'#a8704c',[[.1,0],[.1,.1]]).position.set(0,.89,.37);}
 return {root,torso,head,arms,legs,carry};
 }
 function sheep(){const root=new THREE.Group(),torso=new THREE.Group(),head=new THREE.Group();root.add(torso);ell(torso,'#e9ddbf',0,.56,0,.37,.35,.55);const wool=new THREE.InstancedMesh(sphere,mat('#f1e6cc'),8),m=new THREE.Object3D();wool.castShadow=true;torso.add(wool);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;m.position.set(Math.sin(a)*.29,.63+Math.cos(a)*.13,Math.cos(a)*.34);m.scale.set(.2,.22,.22);m.updateMatrix();wool.setMatrixAt(i,m.matrix);}head.position.set(0,.8,.47);torso.add(head);ell(head,'#bca47f',0,0,.12,.17,.2,.25);for(const side of [-1,1]){ell(head,'#cfb998',side*.21,.02,.06,.15,.065,.08);ell(head,'#38372e',side*.11,.04,.31,.023,.026,.02);}const legs=[];for(const x of [-.23,.23])for(const z of [-.3,.3]){const l=new THREE.Group();l.position.set(x,.37,z);root.add(l);ell(l,'#8b7d65',0,-.17,0,.055,.2,.06);legs.push(l);}return {root,torso,head,legs,arms:[]};}
 function add(kind,path,phase,color,carry=false){const model=kind==='sheep'?sheep():human(color,carry);const a={...model,kind,path,index:1%path.length,state:'pause',timer:1+phase*.7,phase,walked:0,radius:kind==='sheep'?.42:.32};a.root.position.set(path[0][0],height(...path[0]),path[0][1]);a.details=[];a.root.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&Math.max(o.scale.x,o.scale.y,o.scale.z)<.12)a.details.push(o);});stage.add(a.root);actors.push(a);return a;}
 add('resident',[[-.9,18],[-.9,8],[-.9,0],[-.9,-9],[-.9,0],[-.9,8]],.4,'#a08465',true);
 add('resident',[[.9,-9],[.9,0],[.9,8],[.9,18],[.9,8],[.9,0]],2,'#7c8e8a');
 add('resident',[[-14,2],[-14,3.5]],4,'#a77c65');
 const worker=add('resident',[[-16,2.5]],6,'#8b8f6d');worker.state='work';worker.tool=ell(worker.arms[0],'#79664f',0,-.52,.06,.045,.05,.3);
 const resting=add('resident',[[-18,3.5]],9,'#9c887a');resting.state='sit';
 add('shepherd',[[26,5],[26,8],[27,10]],3,'#958164');
 add('shepherd',[[32,5],[33,8]],8,'#a38f6d');
 for(let i=0;i<7;i++){const x=26+(i%3)*2.4,z=11+Math.floor(i/3)*2.2;add('sheep',[[x,z],[x+1.1,z+1],[x-.8,z+.4]],i+1);}
 const mary=add('mary',[[-1.35,-19.5]],2,'#778d9c');const joseph=add('joseph',[[1.4,-20]],4,'#9e8567');mary.root.rotation.y=1.5;joseph.root.rotation.y=-1.3;
 function free(x,z,actor,visitor){return canWalk(x,z)&&(Math.hypot(x-visitor.x,z-visitor.z)>actor.radius+.55||Math.hypot(x-visitor.x,z-visitor.z)>Math.hypot(actor.root.position.x-visitor.x,actor.root.position.z-visitor.z))&&!actors.some(b=>b!==actor&&Math.hypot(x-b.root.position.x,z-b.root.position.z)<actor.radius+b.radius+.12);}
 return {
  targets:()=>actors.filter(a=>!['mary','joseph'].includes(a.kind)).map((a,i)=>({id:'actor-'+i,label:a.kind==='sheep'?'양 떼 살펴보기':a.kind==='shepherd'?'목자 살펴보기':a.carry?'물항아리를 나르는 주민':'주민의 생활 살펴보기',position:()=>a.root.position.clone(),description:a.kind==='sheep'?'풀을 뜯고 쉬며 천천히 이동하는 양 떼입니다.':'일상의 동작을 관찰해 보세요. 특정 성경 인물의 실제 행동이나 발언을 재현한 것은 아닙니다.',interact:()=>{a.state='look';a.timer=10;}})),
  isFree:(x,z)=>!actors.some(a=>Math.hypot(x-a.root.position.x,z-a.root.position.z)<a.radius+.28),
  stats:()=>actors.map(a=>({kind:a.kind,state:a.state,position:a.root.position.toArray(),valid:canWalk(a.root.position.x,a.root.position.z)})),
  update(time,dt,visitor,reduced,event){
   for(const a of actors){const distance=a.root.position.distanceTo(visitor);a.details.forEach(o=>o.visible=distance<18);if(distance>55)continue;const active=distance<25;a.timer-=dt;
    if(a.timer<=0&&a.path.length===1&&a.kind==='resident'){a.state=a.tool?'work':'sit';a.timer=8;}
    if(a.timer<=0&&a.path.length>1){a.state=a.state==='walk'?(a.kind==='sheep'?'graze':a.phase>5?'sit':'look'):'walk';a.timer=a.state==='walk'?7+a.phase*.3:3+a.phase*.45;}
    const alert=event==='shepherds'&&a.kind==='shepherd';let walking=false;
    if(a.state==='walk'&&a.path.length>1&&!alert){const target=a.path[a.index],p=a.root.position,dx=target[0]-p.x,dz=target[1]-p.z,length=Math.hypot(dx,dz);if(length<.15){a.index=(a.index+1)%a.path.length;a.state=a.kind==='sheep'?'graze':'look';a.timer=2+a.phase*.25;}else{const speed=a.kind==='sheep'?.42:.65,nx=p.x+dx/length*dt*speed,nz=p.z+dz/length*dt*speed;if(free(nx,nz,a,visitor)){p.x=nx;p.z=nz;p.y=height(nx,nz);walking=true;a.walked+=dt*speed;}const angle=Math.atan2(dx,dz);a.root.rotation.y+=Math.atan2(Math.sin(angle-a.root.rotation.y),Math.cos(angle-a.root.rotation.y))*Math.min(1,dt*4);}}
    if(!active&&!alert)continue;const cycle=time*(a.kind==='sheep'?4:3.6)+a.phase;
    const blend=1-Math.exp(-dt*5);a.legs.forEach((l,i)=>l.rotation.x=THREE.MathUtils.lerp(l.rotation.x,walking&&!reduced?Math.sin(cycle+i*Math.PI)*.28:0,blend));
    const seated=a.state==='sit'&&!walking&&!alert;a.torso.position.y=THREE.MathUtils.lerp(a.torso.position.y,a.kind==='sheep'?0:seated?.05:.28,blend);
    if(a.kind==='sheep'){a.head.rotation.x=THREE.MathUtils.lerp(a.head.rotation.x,a.state==='graze'?.65:0,blend);a.head.rotation.y=reduced?0:Math.sin(time*.6+a.phase)*.1;}
    else{const look=distance<4?Math.atan2(visitor.x-a.root.position.x,visitor.z-a.root.position.z)-a.root.rotation.y:Math.sin(time*.35+a.phase)*.22;a.head.rotation.y=Math.max(-.65,Math.min(.65,Math.atan2(Math.sin(look),Math.cos(look))));a.head.rotation.x=THREE.MathUtils.lerp(a.head.rotation.x,alert?-.45:['mary','joseph'].includes(a.kind)?.25:0,blend);a.arms.forEach((arm,i)=>{if(!a.carry)arm.rotation.x=THREE.MathUtils.lerp(arm.rotation.x,alert?-.45:a.state==='work'?-.6+Math.sin(time*1.7+a.phase)*.15:walking&&!reduced?Math.sin(cycle+i*Math.PI)*.22:a.state==='look'&&!reduced?-.12+Math.sin(time*.7+a.phase)*.08:0,blend);});}
    a.torso.rotation.z=reduced?0:Math.sin(time*1.2+a.phase)*.008;
   }
  },
 };
}
