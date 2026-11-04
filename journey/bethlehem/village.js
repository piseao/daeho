import * as THREE from '../../walk/vendor/three.module.js';

// Bethlehem alone owns these assets, actors and effects. No network assets or API.
export function createBethlehem({stage, scene, ambient, sun, mobile, reduced, openStory, stopWalking, toast}) {
  const palette = {stone:'#c7b79f', light:'#deceb1', earth:'#a49980', dark:'#6d665d', wood:'#92795b', leaf:'#879784'};
  const geometry = new Map(), materials = new Map(), obstacles = [], actors = [], foliage = [], roofs = [];
  const staticRoot = new THREE.Group(), movingRoot = new THREE.Group();
  const clamp = THREE.MathUtils.clamp, mix = THREE.MathUtils.lerp;
  const smooth = x => {x=clamp(x,0,1); return x*x*(3-2*x);};
  const houses = [
    [-12,7,5,4,3.6],[-12,-1,4.5,5,4.6],[-13,-10,5.5,4.5,3.1],
    [-5,-6,4,4,3.8],[7,7,4.4,4,3.2],[8,-1,4.5,4.5,4.7],
    [9,-10,4,4,3.4],[-5,15,4,3.4,2.8]
  ];
  function naturalHeight(x,z) {
    return .15 + 2.7*Math.exp(-((x-20)**2+(z+15)**2)/135)
      + 1.2*Math.exp(-((x+16)**2+(z+13)**2)/150)
      + .28*Math.sin(x*.13)*Math.cos(z*.12);
  }
  function heightAt(x,z) {
    let y=naturalHeight(x,z);
    for(const [hx,hz,w,d] of [...houses,[0,-14,6,5]]) {
      const edge=Math.max(Math.abs(x-hx)-w/2,Math.abs(z-hz)-d/2);
      const weight=1-smooth(edge/1.4);
      y=mix(y,naturalHeight(hx,hz),weight);
    }
    return y;
  }
  function material(color,glow=false) {
    const key=color+(glow?'glow':'');
    if(!materials.has(key)) materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.95,flatShading:true,
      ...(glow?{emissive:color,emissiveIntensity:1.1}:{})}));
    return materials.get(key);
  }
  function geom(kind) {
    if(!geometry.has(kind)) geometry.set(kind,kind==='box'?new THREE.BoxGeometry(1,1,1):
      kind==='ball'?new THREE.SphereGeometry(1,8,6):kind==='cone'?new THREE.ConeGeometry(1,1,7):
      kind==='bowl'?new THREE.CylinderGeometry(1,.72,1,8):new THREE.CylinderGeometry(1,1,1,8));
    return geometry.get(kind);
  }
  function part(parent,kind,color,x,y,z,sx,sy,sz=sx,glow=false) {
    const mesh=new THREE.Mesh(geom(kind),material(color,glow));
    mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;
  }
  const box=(p,c,x,y,z,w,h,d)=>part(p,'box',c,x,y,z,w,h,d);
  const ball=(p,c,x,y,z,w,h=w,d=w)=>part(p,'ball',c,x,y,z,w,h,d);
  function group(x,z,parent=staticRoot,y=heightAt(x,z)) {const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
  function rect(x,z,w,d){obstacles.push({x,z,w,d,rect:true});}
  function circle(x,z,r){obstacles.push({x,z,r});}
  function walkable(x,z,r=.3){return Math.hypot(x,z)<33 && !obstacles.some(o=>o.rect?
    Math.abs(x-o.x)<o.w/2+r&&Math.abs(z-o.z)<o.d/2+r:Math.hypot(x-o.x,z-o.z)<o.r+r);}

  scene.background=new THREE.Color('#1d2b46');scene.fog=new THREE.Fog('#263950',34,110);
  ambient.color.set('#bccce3');ambient.groundColor.set('#6e736b');ambient.intensity=1.15;
  sun.color.set('#bdcff0');sun.intensity=1.15;sun.position.set(-18,30,8);
  sun.shadow.mapSize.set(mobile?512:1024,mobile?512:1024);sun.shadow.normalBias=.035;
  const floorGeometry=new THREE.PlaneGeometry(74,74,mobile?64:96,mobile?64:96);
  floorGeometry.rotateX(-Math.PI/2);const vertices=floorGeometry.attributes.position;
  for(let i=0;i<vertices.count;i++)vertices.setY(i,heightAt(vertices.getX(i),vertices.getZ(i)));
  floorGeometry.computeVertexNormals();
  const floor=new THREE.Mesh(floorGeometry,material('#92958a'));floor.receiveShadow=true;floor.name='bethlehem-terrain';stage.add(floor);

  // Ground-following ribbons establish connected lanes, not isolated decorations.
  function lane(points,width=2,color='#b5aa92') {
    const v=[],ix=[];let n=0;
    for(let p=1;p<points.length;p++){
      const a=points[p-1],b=points[p],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),steps=Math.ceil(len*2),nx=-dz/len*width/2,nz=dx/len*width/2;
      for(let j=0;j<=steps;j++){
        const t=j/steps,x=mix(a[0],b[0],t),z=mix(a[1],b[1],t);
        for(const s of [-1,1])v.push(x+nx*s,heightAt(x+nx*s,z+nz*s)+.04,z+nz*s);
        if(j){const k=n-2;ix.push(k,k+1,n,k+1,n+1,n);}n+=2;
      }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();
    const m=new THREE.Mesh(g,material(color));m.receiveShadow=true;stage.add(m);
  }
  lane([[0,23],[0,12],[-3,7],[-5,1],[-2,-4],[0,-10]],2.5);
  lane([[-5,1],[-8,1],[-8,-6],[-9,-6]],1.7);
  lane([[-3,7],[3,4],[13,4],[16,0],[19,-5],[20,-14]],2);
  lane([[-2,-4],[4,-6],[8,-6],[14,-8],[20,-14]],1.6);
  lane([[-3,7],[-12,11]],1.8);lane([[3,4],[7,10]],1.5);

  function jar(x,z,size=1){const g=group(x,z);part(g,'bowl','#b28a6c',0,.37*size,0,.32*size,.65*size);part(g,'cylinder','#82664e',0,.73*size,0,.17*size,.12*size);circle(x,z,.32*size);}
  function basket(x,z){const g=group(x,z);part(g,'bowl','#a58b62',0,.25,0,.38,.5);part(g,'cylinder','#c1a373',0,.52,0,.4,.06);for(let i=0;i<3;i++)ball(g,'#baaa72',-.19+i*.18,.55,0,.13,.1);circle(x,z,.4);}
  const lamps=[];
  function lamp(x,z,y=1.8){const g=group(x,z);for(const dy of [-.24,.24])box(g,'#665e52',0,y+dy,0,.32,.045,.32);for(const side of [-1,1])box(g,'#665e52',side*.13,y,-.13,.025,.48,.025);part(g,'ball','#ffd894',0,y,0,.11,.19,.11,true);lamps.push(g);}
  function house([x,z,w,d,h],i){
    const g=group(x,z),c=['#c4b49d','#d2c1a3','#b7ac99'][i%3],wall=.3,door=1.65;
    box(g,c,0,h/2,-d/2,w,h,wall);rect(x,z-d/2,w,wall);
    for(const side of [-1,1]){
      box(g,c,side*w/2,h/2,0,wall,h,d);rect(x+side*w/2,z,wall,d);
      const width=(w-door)/2;
      box(g,c,side*(door/2+width/2),h/2,d/2,width,h,wall);rect(x+side*(door/2+width/2),z+d/2,width,wall);
      box(g,'#ddccac',side*(door/2+.12),1.05,d/2+.08,.18,2.1,.42);
      // Window recess, lintel, low stone courses and parapet.
      box(g,'#665e52',side*w*.32,h*.65,d/2+.17,.55,.7,.035);
      box(g,'#d9c7a7',side*w*.32,h*.65+.4,d/2+.2,.7,.14,.18);
    }
    box(g,c,0,(h+2.05)/2,d/2,door,h-2.05,wall);
    box(g,'#ab9d81',0,.045,0,w,.06,d);
    const roof=group(x,z,movingRoot,g.position.y);box(roof,'#dbccb0',0,h+.12,0,w+.35,.24,d+.35);
    for(const side of [-1,1])box(roof,c,side*w/2,h+.43,0,.2,.5,d+.3);
    box(roof,c,0,h+.43,-d/2,w,.5,.2);roofs.push({root:roof,x,z,w,d});
    for(let k=0;k<3;k++)box(g,'#a59781',-w/2+.4+k*.7,.18,d/2+.16,.5,.2,.08);
    jar(x-w/2-.65,z+d/2-.4,.85);lamp(x+door/2+.35,z+d/2+.35,1.7);
  }
  houses.forEach(house);
  // A low wall frames the entrance without blocking the road.
  for(const side of [-1,1]){
    const g=group(side*6,20);box(g,'#b3aa98',0,.6,0,9,1.2,.65);rect(side*6,20,9,.65);
    for(let i=0;i<10;i++)box(g,'#c6bca6',-4+i*.85,1.25,0,.7,.18,.8);
    lamp(side*1.8,20,1.6);
  }
  const stall=group(-7,10);for(const x of [-1.5,1.5])box(stall,palette.wood,x,1.35,0,.12,2.7,.12);
  const cloth=box(stall,'#aaa9b5',0,2.65,0,3.6,.08,2.3);cloth.rotation.z=.07;
  rect(-8.5,10,.15,.15);rect(-5.5,10,.15,.15);basket(-7.8,9.4);jar(-6.4,9.4);
  for(const [x,z] of [[-15,10],[10,10],[-15,-5],[11,-6]])basket(x,z);
  // A sheltered, open-front birth space. The exact building is an artistic reconstruction.
  const stable=group(0,-14),base=stable.position.y;
  box(stable,'#b3a68b',0,1.8,-2.5,6,3.6,.4);rect(0,-16.5,6,.4);
  for(const side of [-1,1]){box(stable,'#bdaf91',side*3,1.7,0,.35,3.4,5);rect(side*3,-14,.35,5);box(stable,'#8c775b',side*2.7,1.65,2.3,.18,3.3,.18);rect(side*2.7,-11.7,.18,.18);}
  const stableRoof=group(0,-14,movingRoot,base);const rr=box(stableRoof,'#a28d6c',0,3.5,-.4,6.4,.2,4.8);rr.rotation.x=-.09;
  roofs.push({root:stableRoof,x:0,z:-14,w:6,d:5});
  for(let i=0;i<8;i++)box(stable,'#d3ba84',-.9+(i%4)*.5,.06,.2+Math.floor(i/4)*.6,.7,.035,.07).rotation.y=i*.73;
  // Manger, straw, swaddling and a visible small face, not an abstract pillar.
  const manger=group(0,-14.1);box(manger,'#8f7556',0,.55,0,1.55,.48,.85);
  for(const x of [-.62,.62])for(const z of [-.3,.3])box(manger,'#79634a',x,.3,z,.12,.6,.12);
  box(manger,'#d9bd81',0,.83,0,1.45,.12,.78);
  const baby=ball(manger,'#f3e7ca',.12,.98,0,.46,.16,.24);baby.rotation.y=.1;
  ball(manger,'#d4b291',-.38,1.02,0,.15,.16,.14);ball(manger,'#e7dbbf',-.4,1.09,-.05,.15,.1,.14);
  circle(0,-14.1,.85);jar(2,-15,.9);basket(-2,-15.4);lamp(-1.8,-14.8,1.7);lamp(1.8,-12.8,1.7);
  const warm=new THREE.PointLight('#ffcc87',14,13,2);warm.position.set(0,base+2.4,-13);stage.add(warm);
  const streetLight=new THREE.PointLight('#ffd4a1',6,13,2);streetLight.position.set(-5,3,6);stage.add(streetLight);

  function person(x,z,{robe='#aeb5a5',headcloth='#d2c5ac',scale=1,seated=false,carry=false,angle=0}={}){
    const root=group(x,z,movingRoot);root.scale.setScalar(scale);root.rotation.y=angle;
    const torso=new THREE.Group();root.add(torso);torso.position.y=seated?-.42:0;
    part(torso,'bowl',robe,0,.85,0,.28,.9,.26);box(torso,'#8b7b67',0,.88,.01,.59,.07,.51);
    const head=new THREE.Group();head.position.set(0,1.57,0);torso.add(head);
    ball(head,'#c7a27f',0,0,.035,.19,.23,.18);ball(head,headcloth,0,.13,-.045,.23,.18,.22);
    box(head,headcloth,0,-.04,-.17,.4,.39,.12);
    for(const s of [-1,1])ball(head,'#5d5145',s*.07,.015,.197,.018,.022,.015);
    const arms=[],legs=[];
    for(const side of [-1,1]){
      const arm=new THREE.Group();arm.position.set(side*.31,1.16,0);torso.add(arm);
      part(arm,'cylinder',robe,0,-.22,0,.09,.44);ball(arm,'#c7a27f',0,-.46,.015,.075,.09);arms.push(arm);
      arm.rotation.x=carry?-1.05:0;
      const leg=new THREE.Group();leg.position.set(side*.14,.48,0);root.add(leg);
      part(leg,'cylinder',robe,0,-.19,0,.095,.4);ball(leg,'#6f6251',0,-.42,.07,.11,.065,.18);legs.push(leg);
      if(seated)leg.rotation.x=-1.3;
    }
    if(carry){box(torso,'#aa8b60',0,.9,.48,.65,.5,.45);for(let i=0;i<3;i++)box(torso,'#c4a375',0,.75+i*.15,.72,.67,.035,.03);}
    return {root,head,arms,legs,torso,seated,carry,radius:.34,phase:actors.length*1.7,route:null,index:0,pause:0,speed:.6};
  }
  const mary=person(-1.25,-14.1,{robe:'#9bafbf',headcloth:'#ded5c4',angle:.8});
  const joseph=person(1.35,-14.6,{robe:'#b29a7a',headcloth:'#b5aa8f',angle:-.7});
  actors.push(mary,joseph);circle(-1.25,-14.1,.32);circle(1.35,-14.6,.32);
  function walker(route,options={}){const a=person(...route[0],options);a.route=route;a.index=1;a.speed=options.carry?.48:.65;actors.push(a);return a;}
  walker([[-4,6],[-5,2],[-2,-3],[0,-5],[-2,-3],[-5,2]],{robe:'#b6b9aa'});
  walker([[-8,2],[-8,-4],[-8,-6],[-8,0]],{robe:'#c0a894',carry:true});
  const seated=person(-10,10,{robe:'#aeb7bf',seated:true,angle:.6});actors.push(seated);circle(-10,10,.5);
  const seat=group(-10,10);box(seat,'#aa9c82',0,.28,0,1.1,.56,.8);
  // Shepherd pasture, fire, and a quiet flock with bounded, obstacle-tested routes.
  const fire=group(19,3,movingRoot);for(let i=0;i<7;i++){const a=i/7*Math.PI*2;ball(fire,'#a9aa9d',Math.sin(a)*.55,.12,Math.cos(a)*.55,.2,.13,.18);}
  const flames=[];for(let i=0;i<3;i++)flames.push(part(fire,'cone',i?'#ffd99c':'#e8a371',(i-1)*.16,.47,0,.19,.65,.2,true));circle(19,3,.8);
  const fireLight=new THREE.PointLight('#ffbc7b',9,11,2);fireLight.position.set(19,heightAt(19,3)+1,3);stage.add(fireLight);
  const shepherd=person(17,4.8,{robe:'#a5ad99',headcloth:'#cbbd9d',angle:2.4});actors.push(shepherd);circle(17,4.8,.4);
  box(shepherd.root,'#8e775b',.43,1,0,.06,2,.06);
  walker([[22,1],[24,-3],[22,-6],[21,-3]],{robe:'#b9aa92',headcloth:'#c5bda9'});
  function flockSheep(x,z,i){
    const root=group(x,z,movingRoot);ball(root,'#e9e1cc',0,.58,0,.48,.37,.68);
    const legs=[];for(const side of [-1,1])for(const z of [-.36,.36]){const leg=new THREE.Group();leg.position.set(side*.28,.4,z);root.add(leg);part(leg,'cylinder','#b8aa91',0,-.18,0,.075,.38);legs.push(leg);}
    const head=ball(root,'#cfb798',0,.76,.6,.22,.23,.28);for(const side of [-1,1])ball(root,'#ddd2b8',side*.25,.85,.57,.17,.07,.08);
    const a={root,head,arms:[],legs,radius:.48,phase:i*2,route:[[x,z],[x+1,z-1.7],[x-1,z-2]],index:1,pause:i*.6,speed:.23,sheep:true};actors.push(a);
  }
  for(let i=0;i<(mobile?5:8);i++)flockSheep(16+(i%3)*3,-1-Math.floor(i/3)*2.8,i);
  // Terrain contours and distant silhouettes establish depth without playable clutter.
  for(const [x,z,s]of [[-20,13,1],[-19,-4,1.1],[13,15,.9],[27,-9,1.1],[18,-20,.8],[-5,-22,1.2],[25,9,.8]]){
    const g=group(x,z);part(g,'cylinder','#84765f',0,1.1,0,.18,2.2);circle(x,z,.35);
    const crown=group(x,z,movingRoot);crown.position.y+=2.4;
    for(let i=0;i<3;i++)ball(crown,['#7d907d','#96a58e','#a2af96'][i],(i-1)*.65,.15*(i%2),0,1*s,.85*s,1*s);
    foliage.push({root:crown,phase:x*.3,baseY:crown.position.y});
  }
  for(let i=0;i<14;i++){
    const a=i/14*Math.PI*2,x=Math.sin(a)*65,z=Math.cos(a)*65,g=group(x,z,staticRoot,-3);
    part(g,'cone',i%2?'#53677a':'#42556c',0,0,0,13+(i%3)*5,14+(i%4)*4,14);
  }
  for(let i=0;i<9;i++){const x=-27+i*5,g=group(x,-34,staticRoot,1.1);box(g,'#8e9295',0,1.2,0,2.6,2.4+(i%3),2.5);box(g,'#bbc2bd',.3,1.5,1.27,.18,.25,.02);}
  const moon=new THREE.Mesh(new THREE.SphereGeometry(2.2,12,8),new THREE.MeshBasicMaterial({color:'#dfebef'}));moon.position.set(-27,14,-80);stage.add(moon);
  const starsGeometry=new THREE.BufferGeometry(),stars=[];
  let seed=71;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<(mobile?140:260);i++){const a=random()*Math.PI*2,r=65+random()*30;stars.push(Math.sin(a)*r,5+random()*50,Math.cos(a)*r);}
  starsGeometry.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));
  const starMaterial=new THREE.PointsMaterial({color:'#eee5cf',size:.19,transparent:true,opacity:.85,fog:false});stage.add(new THREE.Points(starsGeometry,starMaterial));
  const skyGlow=new THREE.Mesh(new THREE.SphereGeometry(3,12,8),new THREE.MeshBasicMaterial({color:'#fff0cc',transparent:true,opacity:0,depthWrite:false,fog:false}));skyGlow.position.set(19,15,-1);stage.add(skyGlow);
  const revelation=new THREE.PointLight('#fff0d2',0,34,2);revelation.position.copy(skyGlow.position);stage.add(revelation);

  // Batch repeated static AND animated pieces by geometry/material. Models stay off-scene.
  // Animation updates instance transforms; hundreds of parts do not become hundreds of draw calls.
  const batches=new Map(),identity=new THREE.Matrix4();
  for(const [root,dynamic] of [[staticRoot,false],[movingRoot,true]]){
    root.updateMatrixWorld(true);root.traverse(o=>{if(!o.isMesh)return;const key=o.geometry.uuid+o.material.uuid;
      if(!batches.has(key))batches.set(key,{geometry:o.geometry,material:o.material,sources:[],dynamic:false});
      const b=batches.get(key);b.sources.push({node:o,dynamic});b.dynamic ||= dynamic;
    });
  }
  for(const b of batches.values()){
    b.mesh=new THREE.InstancedMesh(b.geometry,b.material,b.sources.length);b.mesh.castShadow=true;b.mesh.receiveShadow=true;
    b.mesh.frustumCulled=false;if(b.dynamic)b.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    b.sources.forEach((s,i)=>b.mesh.setMatrixAt(i,s.node.matrixWorld));stage.add(b.mesh);
  }

  const places=[
    {id:'entry',title:'마을 입구 · 호적 등록',x:0,z:17,story:0},
    {id:'birth',title:'구유 곁에 머물기',x:0,z:-10,story:1},
    {id:'field',title:'목자들의 들판',x:15,z:2,story:2},
    {id:'alley',title:'다윗의 동네, 베들레헴',x:-8,z:1,reference:'누가복음 2:4 · 미가 5:2',text:'누가복음은 요셉이 다윗의 집과 족속에 속하여 베들레헴으로 올라갔다고 전합니다. 미가서는 작은 베들레헴에서 이스라엘을 다스릴 이가 나올 것을 말합니다. 지금 걷는 골목과 가옥은 당시 삶을 상상하도록 구성한 예술적 재구성입니다.'},
    {id:'lookout',title:'우리 가운데 거하신 말씀',x:20,z:-14,reference:'요한복음 1:14',text:'요한복음은 말씀이 육신이 되어 우리 가운데 거하셨다고 전합니다. 성육신은 하나님의 아들이 참 사람이 되어 오신 사건입니다. 마을의 작은 불빛을 바라보며, 우리 가운데 오신 예수님을 묵상해 보세요.'}
  ];
  // Ground-level pools of light mark places gently, without score or collectible icons.
  for(const p of places){const ring=new THREE.Mesh(new THREE.RingGeometry(.8,.9,32),new THREE.MeshBasicMaterial({color:'#e4cf99',transparent:true,opacity:.45,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(p.x,heightAt(p.x,p.z)+.08,p.z);stage.add(ring);}
  const hud=document.createElement('section');hud.id='bethlehem-hud';hud.setAttribute('aria-label','베들레헴 탐험');
  hud.innerHTML='<details id="village-guide"><summary>마을 둘러보기</summary><p>목적지를 고르면 양이 길을 따라 걷습니다.</p><div class="village-places"></div><small>공간·인물 동작은 본문 이해를 돕는 예술적 재구성입니다.</small></details><button id="village-sound" type="button" aria-pressed="false">환경음 켜기</button>';
  document.body.append(hud);
  const cinema=document.createElement('section');cinema.id='bethlehem-cinema';cinema.hidden=true;
  cinema.innerHTML='<div class="cinema-top"><span>성경 본문을 바탕으로 한 예술적 재구성</span><button type="button">연출 건너뛰기 →</button></div><div class="cinema-caption" aria-live="polite"><p></p><small></small></div>';document.body.append(cinema);
  const discovery=document.createElement('dialog');discovery.id='bethlehem-discovery';
  discovery.innerHTML='<button class="close" aria-label="닫기">×</button><p class="eyebrow">BETHLEHEM · 잠시 머물러 보기</p><h2></h2><p class="discovery-body"></p><p class="discovery-ref"></p><p class="source-note">성경 본문을 바탕으로 작성한 요약입니다. 마을과 인물의 모습은 예술적 재구성입니다.</p><button class="primary">마을로 돌아가기 →</button>';document.body.append(discovery);
  discovery.querySelectorAll('button').forEach(b=>b.onclick=()=>discovery.close());
  let audio=null,audioEnabled=false,cinematic=null,returning=null,nearest=null,disposed=false;
  const visited=new Set(),audioButton=hud.querySelector('#village-sound');
  function setAudioGain(value){if(audio)audio.gain.gain.setTargetAtTime(value,audio.context.currentTime,.7);}
  audioButton.onclick=async()=>{
    try{
      if(!audio){
        const context=new (window.AudioContext||window.webkitAudioContext)(),gain=context.createGain(),filter=context.createBiquadFilter();
        const buffer=context.createBuffer(1,context.sampleRate*3,context.sampleRate),data=buffer.getChannelData(0);let last=0;
        for(let i=0;i<data.length;i++){last=(last+(Math.random()*2-1)*.02)/1.02;data[i]=last*3;}
        const wind=context.createBufferSource();wind.buffer=buffer;wind.loop=true;filter.type='lowpass';filter.frequency.value=350;
        gain.gain.value=0;wind.connect(filter).connect(gain).connect(context.destination);wind.start();audio={context,gain,wind};
      }
      await audio.context.resume();if(disposed)return;audioEnabled=!audioEnabled;
      setAudioGain(audioEnabled?(cinematic?.008:.09):0);audioButton.textContent=audioEnabled?'환경음 끄기':'환경음 켜기';audioButton.setAttribute('aria-pressed',String(audioEnabled));
    }catch{toast('이 브라우저에서는 환경음을 재생할 수 없어요. 소리 없이도 모든 장면을 볼 수 있습니다.');}
  };
  function showDiscovery(p){stopWalking();discovery.querySelector('h2').textContent=p.title;discovery.querySelector('.discovery-body').textContent=p.text;discovery.querySelector('.discovery-ref').textContent=p.reference;discovery.showModal();}
  function begin(kind,camera){
    if(cinematic||returning)return;stopWalking();visited.add(kind);
    cinematic={kind,time:0,start:camera.position.clone(),startLook:new THREE.Vector3(),index:-1};
    camera.getWorldDirection(cinematic.startLook);cinematic.startLook.multiplyScalar(10).add(camera.position);
    cinema.hidden=false;document.body.classList.add('village-cinematic');setAudioGain(audioEnabled?.008:0);
    cinema.querySelector('button').focus({preventScroll:true});
  }
  function finish(camera,showText=true){
    if(!cinematic)return;const kind=cinematic.kind;cinematic=null;cinema.hidden=true;document.body.classList.remove('village-cinematic');
    returning={time:0,start:camera.position.clone(),look:new THREE.Vector3(),kind,showText};camera.getWorldDirection(returning.look);returning.look.multiplyScalar(9).add(camera.position);
    setAudioGain(audioEnabled?.09:0);
  }
  let activeCamera=null;
  cinema.querySelector('button').onclick=()=>finish(activeCamera);
  const escape=e=>{if(e.key==='Escape'&&cinematic){e.preventDefault();finish(activeCamera);}};document.addEventListener('keydown',escape);
  const visibility=()=>{if(audio)document.hidden?audio.context.suspend():audioEnabled&&audio.context.resume().catch(()=>{});};document.addEventListener('visibilitychange',visibility);
  function encounter(index,camera){const p=places[index];if(!p)return;if(p.id==='birth'||p.id==='field')begin(p.id,camera);else if(p.story!==undefined)openStory(p.story);else showDiscovery(p);}
  function connectTravel(go,camera){
    places.forEach((p,i)=>{const button=document.createElement('button');button.textContent=p.title;button.onclick=()=>{hud.querySelector('details').open=false;go(p.x,p.z,()=>encounter(i,camera));};hud.querySelector('.village-places').append(button);});
  }
  const shotData={birth:[
    {duration:4,pos:[4,3.6,-7],look:[0,1.3,-14],text:'작은 마을의 밤, 구유 곁으로',ref:'먼저 장면을 바라보세요.'},
    {duration:4,pos:[2,2.9,-10.5],look:[-.1,1.1,-14.2],text:'마리아와 요셉, 구유에 누인 아기',ref:'누가복음 2:6–7, 16 · 인물의 자세는 예술적 재구성입니다.'},
    {duration:5,pos:[.9,2,-12.1],look:[-.1,.95,-14.1],text:'강보에 싸여 구유에 누이신 예수님',ref:'누가복음 2:7 · 본문 요약'},
    {duration:4,pos:[-2,2.8,-10.4],look:[0,1.05,-14],text:'낮고 작은 자리로 오신 주님',ref:'잠시 이 장면 곁에 머물러 보세요.'}
  ],field:[
    {duration:4,pos:[12,4,9],look:[19,1,1],text:'밤에 들에서 양 떼를 지키던 목자들',ref:'누가복음 2:8 · 본문 요약'},
    {duration:5,pos:[12,5,5],look:[19,8,-1],text:'주의 천사가 나타나고 주의 영광이 비쳤습니다.',ref:'누가복음 2:9 · 빛은 사건을 표현한 예술적 연출입니다.'},
    {duration:5,pos:[15,3.5,7],look:[19,2,0],text:'천사는 큰 기쁨의 소식을 전했습니다. 다윗의 동네에 구주가 나셨습니다.',ref:'누가복음 2:10–12 · 본문 요약'},
    {duration:4,pos:[13,5,8],look:[19,6,-1],text:'하늘의 군대가 하나님을 찬송하며 영광과 평화를 선포했습니다.',ref:'누가복음 2:13–14 · 본문 요약'}
  ]};
  function cameraPoint(values,kind){return new THREE.Vector3(values[0],values[1]+(kind==='birth'?base:heightAt(19,1)),values[2]);}
  function shotPosition(shot,kind,camera){
    const look=cameraPoint(shot.look,kind),offset=cameraPoint(shot.pos,kind).sub(look);
    if(camera.aspect<.8){offset.multiplyScalar(Math.min(2.2,.95/camera.aspect));if(kind==='birth')offset.x*=.35;}
    return look.add(offset);
  }
  const scratch=new THREE.Vector3();
  function update(dt,{time,camera,sheep,paused,normalPosition,normalLook}){
    activeCamera=camera;
    for(const a of actors){
      let walking=false;
      if(a.route&&!paused){
        if(a.pause>0)a.pause-=dt;
        else{
          const target=a.route[a.index],dx=target[0]-a.root.position.x,dz=target[1]-a.root.position.z,len=Math.hypot(dx,dz);
          if(len<.12){a.index=(a.index+1)%a.route.length;a.pause=a.sheep?2.4:1.5;}
          else{const step=Math.min(len,dt*a.speed),x=a.root.position.x+dx/len*step,z=a.root.position.z+dz/len*step;
            const occupied=actors.some(b=>b!==a&&Math.hypot(x-b.root.position.x,z-b.root.position.z)<a.radius+b.radius+.08)||Math.hypot(x-sheep.position.x,z-sheep.position.z)<a.radius+.5;
            if(walkable(x,z,a.radius)&&!occupied){a.root.position.set(x,heightAt(x,z),z);walking=true;}
            const yaw=Math.atan2(dx,dz);a.root.rotation.y+=Math.atan2(Math.sin(yaw-a.root.rotation.y),Math.cos(yaw-a.root.rotation.y))*Math.min(1,dt*3);
          }
        }
      }
      if(!reduced){
        if(a.sheep){a.legs.forEach((leg,i)=>leg.rotation.x=walking?Math.sin(time*4+a.phase+(i===0||i===3?0:Math.PI))*.22:0);a.head.rotation.x=walking?0:.18+Math.sin(time*.8+a.phase)*.12;}
        else{a.head.rotation.y=Math.sin(time*.35+a.phase)*.14;
          a.legs.forEach((l,i)=>l.rotation.x=a.seated?-1.3:walking?Math.sin(time*5+a.phase+i*Math.PI)*.35:0);
          a.arms.forEach((l,i)=>l.rotation.x=a.carry?-1.05:walking?Math.sin(time*5+a.phase+i*Math.PI)*.2:0);}
      }
    }
    foliage.forEach(f=>{f.root.rotation.z=reduced?0:Math.sin(time*.7+f.phase)*.025;f.root.rotation.x=reduced?0:Math.sin(time*.45+f.phase)*.016;});
    flames.forEach((f,i)=>{f.scale.y=reduced?.65:.58+Math.sin(time*3+i)*.09;});
    fireLight.intensity=reduced?8:8+Math.sin(time*4)*.5+Math.sin(time*7)*.3;
    material('#ffd894',true).emissiveIntensity=reduced?1.1:1.1+Math.sin(time*2)*.12;
    starMaterial.opacity=reduced?.85:.83+Math.sin(time*.65)*.06;
    for(const roof of roofs){const inside=Math.abs(sheep.position.x-roof.x)<roof.w/2+.3&&Math.abs(sheep.position.z-roof.z)<roof.d/2+.4;
      roof.root.scale.setScalar(inside||(cinematic?.kind==='birth'&&roof.x===0)?0:1);}
    movingRoot.updateMatrixWorld(true);
    for(const b of batches.values())if(b.dynamic){b.sources.forEach((s,i)=>{if(s.dynamic)b.mesh.setMatrixAt(i,s.node.matrixWorld);});b.mesh.instanceMatrix.needsUpdate=true;}
    nearest=null;places.forEach((p,i)=>{if(Math.hypot(sheep.position.x-p.x,sheep.position.z-p.z)<2)nearest=i;});
    if(!paused&&!cinematic&&!returning&&nearest!==null){const p=places[nearest];if((p.id==='birth'||p.id==='field')&&!visited.has(p.id))begin(p.id,camera);}
    if(cinematic){
      cinematic.time+=dt;const shots=shotData[cinematic.kind];let index=0,elapsed=cinematic.time;
      while(index<shots.length&&elapsed>=shots[index].duration){elapsed-=shots[index].duration;index++;}
      if(index===shots.length){finish(camera);}
      else{
        const shot=shots[index],prev=index?shots[index-1]:null,blend=smooth(elapsed/shot.duration);
        if(cinematic.index!==index){cinema.querySelector('.cinema-caption p').textContent=shot.text;cinema.querySelector('.cinema-caption small').textContent=shot.ref;cinematic.index=index;}
        const target=shotPosition(shot,cinematic.kind,camera),look=cameraPoint(shot.look,cinematic.kind);
        if(reduced){camera.position.copy(shotPosition(shots[1],cinematic.kind,camera));camera.lookAt(cameraPoint(shots[1].look,cinematic.kind));}
        else{camera.position.lerpVectors(prev?shotPosition(prev,cinematic.kind,camera):cinematic.start,target,blend);scratch.lerpVectors(prev?cameraPoint(prev.look,cinematic.kind):cinematic.startLook,look,blend);camera.lookAt(scratch);}
      }
    }
    const lightTarget=cinematic?.kind==='field'?smooth((cinematic.time-3)/4):0;
    revelation.intensity=mix(revelation.intensity,lightTarget*85,Math.min(1,dt*2));skyGlow.material.opacity=mix(skyGlow.material.opacity,lightTarget*.48,Math.min(1,dt*2));
    warm.intensity=mix(warm.intensity,cinematic?.kind==='birth'?22:14,Math.min(1,dt));
    if(returning){returning.time+=dt;const blend=reduced?1:smooth(returning.time/1.5);camera.position.lerpVectors(returning.start,normalPosition,blend);scratch.lerpVectors(returning.look,normalLook,blend);camera.lookAt(scratch);
      if(blend>=1){const done=returning;returning=null;if(done.showText)openStory(done.kind==='birth'?1:2);}}
  }
  function dispose(){disposed=true;document.removeEventListener('keydown',escape);document.removeEventListener('visibilitychange',visibility);hud.remove();cinema.remove();discovery.remove();document.body.classList.remove('village-cinematic');if(audio){audio.wind.stop();audio.context.close().catch(()=>{});} }
  return {floor,obstacles,heightAt,walkable,places,connectTravel,encounter,update,dispose,
    get locked(){return !!cinematic||!!returning;},get nearest(){return nearest;},get actors(){return actors;},
    spawn:[0,23],camera:{yaw:-.24,pitch:.34,distance:19},
    stats:()=>({batches:batches.size,actors:actors.length,instances:[...batches.values()].reduce((n,b)=>n+b.sources.length,0)})};
}
