import * as THREE from '../../walk/vendor/three.module.js';

// Original environment art. An evocative reconstruction, not an archaeological model.
export const layout = {
  radius: 47, spawn: [0, 29], stories: [[0, 19], [0, -15], [28, 4]],
  places: [
    {name:'마을 입구', hint:'등불을 따라 마을 안으로', at:[0,19]},
    {name:'작은 시장', hint:'천막 사이로 이어지는 골목', at:[-13,2]},
    {name:'탄생 장소', hint:'고요한 빛이 머무는 자리', at:[0,-15]},
    {name:'목자들의 들판', hint:'마을 너머, 별 아래의 쉼', at:[28,4]},
    {name:'별빛 전망대', hint:'언덕 위에서 돌아보는 베들레헴', at:[30,-23]},
  ],
};
export function groundHeight(x,z) {
  return .28*Math.sin(x*.075)*Math.cos(z*.065)
    + 2.9*Math.exp(-((x-30)**2+(z+24)**2)/250)
    + 1.25*Math.exp(-((x+21)**2+(z+22)**2)/320);
}

export function createBethlehem({stage, scene, ambient, sun, obstacles, mobile}) {
  let seed=1327;
  const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  function surfaceTexture(stone){
    const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=stone?'#b5ada0':'#a49b89';ctx.fillRect(0,0,256,256);
    for(let i=0;i<9000;i++){const v=130+Math.floor(random()*90);ctx.fillStyle=`rgba(${v},${v},${v},.12)`;ctx.fillRect(random()*256,random()*256,1+random()*3,1+random()*2);}
    if(stone)for(let row=0;row<8;row++)for(let col=-1;col<5;col++){const x=col*64+(row%2)*32,y=row*32;ctx.strokeStyle='rgba(65,53,41,.16)';ctx.lineWidth=1.5;ctx.strokeRect(x+1,y+1,61,29);ctx.fillStyle='rgba(255,240,211,.09)';ctx.fillRect(x+3,y+3,58,2);}
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.repeat.set(stone?2:30,stone?2:30);return t;
  }
  const masonry=surfaceTexture(true),earth=surfaceTexture(false);
  const wallColors=['#b5a18b','#c4ac8b','#a59487','#d1b698','#99816b','#aa9275','#9e8c79'];
  const batches=new Map(), materials=new Map(), geometry={
    box:new THREE.BoxGeometry(1,1,1), sphere:new THREE.SphereGeometry(1,12,8),
    stone:new THREE.IcosahedronGeometry(1,0), cylinder:new THREE.CylinderGeometry(1,1,1,10),
  };
  let placement=null,roomCount=0;const trees=[],cameraSolids=[];let cameraLift=0;
  const matrix=new THREE.Object3D(), swaying=[], flames=[], lightSources=[];
  const material=(color,emissive=false)=>{
    const key=color+emissive;
    if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.92,emissive:emissive?color:0,emissiveIntensity:emissive?2:0,map:wallColors.includes(color)?masonry:null}));
    return materials.get(key);
  };
  // Static detail is instanced by geometry/material, not one draw call per stone.
  function part(type,color,x,y,z,sx,sy,sz,ry=0,glow=false,rz=0){
    if(placement){const dx=x-placement.x,dz=z-placement.z,c=Math.cos(placement.a),sn=Math.sin(placement.a);x=placement.x+c*dx+sn*dz;z=placement.z-sn*dx+c*dz;ry+=placement.a;}
    const key=type+color+glow;
    if(!batches.has(key))batches.set(key,{type,mat:material(color,glow),items:[]});
    matrix.position.set(x,y,z);matrix.scale.set(sx,sy,sz);matrix.rotation.set(0,ry,rz);matrix.updateMatrix();
    batches.get(key).items.push(matrix.matrix.clone());
  }
  const box=(c,x,y,z,w,h,d,a=0)=>part('box',c,x,y,z,w,h,d,a);
  const rock=(x,z,s=1)=>{part('stone','#716d70',x,groundHeight(x,z)+s*.25,z,s,s*.55,s*.7,random()*6);};
  function block(x,z,w,d){if(placement){const dx=x-placement.x,dz=z-placement.z,c=Math.cos(placement.a),sn=Math.sin(placement.a);x=placement.x+c*dx+sn*dz;z=placement.z-sn*dx+c*dz;[w,d]=[Math.abs(c)*w+Math.abs(sn)*d,Math.abs(sn)*w+Math.abs(c)*d];}obstacles.push({rect:true,x,z,w,d});}
  function cameraBlock(box){if(placement){const m=new THREE.Matrix4().makeTranslation(placement.x,0,placement.z);m.multiply(new THREE.Matrix4().makeRotationY(placement.a)).multiply(new THREE.Matrix4().makeTranslation(-placement.x,0,-placement.z));box.applyMatrix4(m);}cameraSolids.push(box);}
  function glowTexture(){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d');const g=ctx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,226,167,.9)');g.addColorStop(.15,'rgba(255,185,95,.35)');g.addColorStop(1,'rgba(255,160,70,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
  const halo=glowTexture();
  function lantern(x,z,y=2.3,power=12){
    const savedPlacement=placement;if(placement){const dx=x-placement.x,dz=z-placement.z,c=Math.cos(placement.a),sn=Math.sin(placement.a);x=placement.x+c*dx+sn*dz;z=placement.z-sn*dx+c*dz;placement=null;}
    y=Math.min(y,1.25);const base=groundHeight(x,z),h=base+y;
    box('#93816b',x,base+y*.5,z,.28,y,.3);
    part('sphere','#a46d46',x,h,z,.23,.085,.18);part('sphere','#a46d46',x+.2,h,z,.15,.055,.07);
    part('sphere','#ffd39b',x+.28,h+.09,z,.035,.09,.035,0,true);
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:halo,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,color:'#ffce8a'}));
    sprite.position.set(x+.28,h+.08,z);sprite.scale.set(.9,.9,1);stage.add(sprite);flames.push(sprite);
    lightSources.push({x:x+.28,y:h+.1,z,power});
    // Ground pools are inexpensive, soft local illumination alongside four real lights.
    const pool=new THREE.Mesh(new THREE.PlaneGeometry(3.5,3.5),new THREE.MeshBasicMaterial({map:halo,color:'#bd773e',transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending}));
    pool.rotation.x=-Math.PI/2;pool.position.set(x,base+.045,z);stage.add(pool);placement=savedPlacement;
  }
  function jar(x,z,s=.6){const y=groundHeight(x,z);part('sphere','#ac7354',x,y+s*.55,z,s*.4,s*.6,s*.4);part('cylinder','#c88f66',x,y+s*1.12,z,s*.2,s*.12,s*.2);part('cylinder','#3e3030',x,y+s*1.19,z,s*.14,.015,s*.14);block(x,z,s*.7,s*.7);}
  const architectureTypes=['단실 주택','안뜰 주거','공방 주거','암반 저장실','가축 마당'];
  function room(x,z,w,d,h,index){roomCount++;
    const y=groundHeight(x,z)-.18,c=['#b5a18b','#c4ac8b','#a59487','#d1b698'][index%4];
    box(c,x,y+h/2,z,w,h,d);block(x,z,w+.15,d+.15);
    cameraBlock(new THREE.Box3(new THREE.Vector3(x-w/2-.15,y,z-d/2-.15),new THREE.Vector3(x+w/2+.15,y+h+.28,z+d/2+.15)));
    // Mud roof and exposed timber ends, without repeated villa parapets or cornices.
    box('#a89172',x,y+h+.04,z,w+.13,.18,d+.12);
    for(let k=0;k<Math.ceil(w/.65);k++)part('cylinder','#71583e',x-w*.42+k*.62,y+h-.15,z+d/2+.09,.065,.28,.065,0,false,Math.PI/2);
    const front=z+d/2+.03,dx=x+(index%2?-.22:.25)*w;
    box('#514439',dx,y+.88,front,.72,1.76,.05);
    for(let k=0;k<4;k++)box('#806145',dx-.27+k*.18,y+.87,front+.03,.14,1.68,.025);
    box('#c2aa87',dx,y+1.85,front,1.03,.17,.17);
    for(const side of [-1,1])box('#c2aa87',dx+side*.45,y+.9,front,.14,1.85,.16);
    if(index%3!==0){const wx=x+(index%2?.27:-.27)*w;box('#4e4339',wx,y+h*.73,front,.38,.42,.07);if(index%2)part('box','#c98c42',wx,y+h*.73,front+.04,.18,.31,.02,0,true);}
    // Uneven fieldstone footings instead of identical dressed brick rows.
    for(let k=0;k<Math.ceil(w/.46);k++){const xx=x-w*.47+k*.46;if(Math.abs(xx-dx)>.48)part('stone',index%2?'#9d8b72':'#bca78b',xx,y+.2+random()*.05,front,.26,.16,.13,random()*.3);}
    if(index%3===0)jar(x-w*.32,front+.6,.65);
    if(index%2===0)lantern(x+w*.38,front+.4,1.1,10);
  }
  function lowWall(x,z,w,d,h=.8){const y=groundHeight(x,z);box('#9e8c79',x,y+h/2,z,w,h,d);block(x,z,w,d);}
  function compound(x,z,type,i){
    const h=2.35+(i%4)*.23;
    if(type===0){room(x,z,3.6+(i%2)*.6,3,h,i);lowWall(x-2,z+2,.3,2,.65);jar(x+1.7,z+2,.8);}
    if(type===1){
      room(x-1.65,z,2.4,5,h,i);room(x+1.2,z-1.4,3.3,2.2,h-.3,i+1);
      lowWall(x+2.9,z+.5,.35,2.4);lowWall(x+1.8,z+2.4,2.2,.35,.7);
      part('cylinder','#ac9879',x+.6,groundHeight(x+.6,z+1)+.25,z+1,.5,.5,.5);
      part('cylinder','#514939',x+.6,groundHeight(x+.6,z+1)+.51,z+1,.36,.02,.36);block(x+.6,z+1,1,1);
    }
    if(type===2){
      room(x,z-1,3.9,2.8,h,i);for(const side of [-1,1]){box('#776047',x+side*1.8,groundHeight(x,z)+1.1,z+2,.11,2.2,.11);block(x+side*1.8,z+2,.15,.15);}
      box('#9f9170',x,groundHeight(x,z)+2.25,z+1.2,4.2,.09,2.1);
      box('#87664b',x,groundHeight(x,z)+.68,z+1,2.1,.16,.7);block(x,z+1,2.1,.7);
      for(let j=0;j<5;j++)jar(x-1+j*.5,z+1,.35);
    }
    if(type===3){
      room(x,z,3.6,3,1.95,i);
      for(const side of [-1,1])part('stone','#9b9585',x+side*2,groundHeight(x,z)+.8,z-.5,1,1.4,2.1,.2*side);
      for(let j=0;j<3;j++)jar(x-1.1+j*.9,z+2,.75+j*.12);
      lowWall(x-2.3,z,.8,3,1.4);lowWall(x+2.3,z,.8,3,1.4);
    }
    if(type===4){
      lowWall(x-2.6,z,.45,4.5);lowWall(x+2.6,z,.45,4.5);lowWall(x,z-2.1,5.6,.45);
      lowWall(x-1.9,z+2.1,1.5,.45,.65);lowWall(x+1.9,z+2.1,1.5,.45,.65);
      box('#978464',x,groundHeight(x,z)+1.85,z-1.2,5.2,.14,1.8);
      for(const side of [-1,1])box('#776047',x+side*2.35,groundHeight(x,z)+.9,z-.4,.13,1.8,.13);
      box('#a28b67',x,groundHeight(x,z)+.25,z-1.3,1.8,.5,.55);block(x,z-1.3,1.8,.55);
    }
  }
  // Uneven clusters follow open lanes; compounds have distinct, usable negative space.
  const homes=[[-7,13,0],[7,12,2],[-17,14,1],[18,13,4],[-7,5.5,3],[7.2,5,0],[-22,5,2],[17,4,1],[-7,-5,2],[7,-5,3],[-20,-6,0],[18,-7,4],[-8,-13,0],[8,-13,0],[-19,-17,1],[18,-18,2],[-10,-25,3],[9,-25,1],[-29,-7,3],[-28,10,4]];
  scene.background=new THREE.Color('#131f38');scene.fog=new THREE.FogExp2('#26354b',.0105);
  ambient.color.set('#a9c7ed');ambient.groundColor.set('#554137');ambient.intensity=1.5;
  sun.color.set('#bdd7ff');sun.intensity=1.65;sun.position.set(-22,38,-18);
  sun.shadow.camera.left=-50;sun.shadow.camera.right=50;sun.shadow.camera.top=50;sun.shadow.camera.bottom=-50;sun.shadow.camera.updateProjectionMatrix();
  const floorGeo=new THREE.PlaneGeometry(220,220,100,100);floorGeo.rotateX(-Math.PI/2);
  const position=floorGeo.attributes.position,colors=[];
  for(let i=0;i<position.count;i++){
    const x=position.getX(i),z=position.getZ(i);position.setY(i,groundHeight(x,z));
    const c=new THREE.Color('#756b61').lerp(new THREE.Color('#8d806d'),random()*.45);colors.push(c.r,c.g,c.b);
  }
  floorGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));floorGeo.computeVertexNormals();
  const floor=new THREE.Mesh(floorGeo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,map:earth}));floor.receiveShadow=true;floor.name='ground';stage.add(floor);
  function path(points,width=2.7){
    const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,0,z))),v=[],uv=[],indices=[];
    const count=100;
    for(let i=0;i<=count;i++){const t=i/count,p=curve.getPoint(t),n=curve.getTangent(t),wiggle=1+Math.sin(t*47)*.035;for(const side of [-1,1]){const x=p.x+n.z*side*width*.5*wiggle,z=p.z-n.x*side*width*.5*wiggle;v.push(x,groundHeight(x,z)+.035,z);uv.push(side===-1?0:1,t*20);}if(i<count){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const pm=material('#b29a79');pm.map=earth;const m=new THREE.Mesh(g,pm);m.receiveShadow=true;stage.add(m);
  }
  path([[0,40],[0,21],[-.3,11],[0,1],[0,-9],[0,-18]],3.5);
  path([[-33,1],[-22,0],[-12,0],[0,0],[12,0],[22,4],[28,4],[35,1]],2.6);
  path([[-22,18],[-12,18],[0,19],[12,19],[23,13],[28,4],[30,-8],[30,-23]],2.4);
  path([[-12,18],[-12,8],[-12,0],[-12,-10],[-12,-18],[0,-18],[12,-19],[24,-21],[30,-23]],2.2);
  path([[12,19],[12,9],[12,0],[12,-9],[12,-19]],2);
  for(let i=0;i<145;i++){const z=-16+random()*40,x=(random()-.5)*2.5;box(i%2?'#a18c73':'#bbab90',x,groundHeight(x,z)+.055,z,.2+random()*.35,.025,.16+random()*.25,random()*.4);}
  homes.forEach(([x,z,type],i)=>{placement={x,z,a:Math.sin(i*2.7)*.16};compound(x,z,type,i);placement=null;});
  // Low village entrance, interrupted rather than fortress-like city walls.
  for(const s of [-1,1]){
    box('#b6a18a',s*3,.8,23,.7,1.6,.7);block(s*3,23,.7,.7);
    lantern(s*2.3,22.5,2.6);
    for(let j=0;j<7;j++){const x=s*(4.1+j*1.15),y=groundHeight(x,23);box('#9e8c79',x,y+.65,23,1.1,1.3,.65);box('#c2ad8d',x,y+1.33,23,1.16,.15,.76);block(x,23,1.1,.7);}
  }
  // Open-sided shelter: environment only. Cast and cinematic are later production work.
  const sy=groundHeight(0,-20);
  box('#99816b',0,sy+1.8,-22.5,6.7,3.6,.5);block(0,-22.5,6.7,.5);
  for(const s of [-1,1]){box('#aa9275',s*3.3,sy+1.6,-20,.45,3.2,5);block(s*3.3,-20,.45,5);box('#70553e',s*2.8,sy+1.65,-17.6,.22,3.3,.22);block(s*2.8,-17.6,.3,.3);}
  for(let i=0;i<10;i++)box('#80654b',-3.5+i*.77,sy+3.55,-20,.17,.18,5.6);box('#aa9676',0,sy+3.7,-20,7.5,.15,5.5);
  box('#a38b61',0,sy+.12,-20,5.8,.2,4.4);
  for(let i=0;i<65;i++){const x=(random()-.5)*5,z=-20+(random()-.5)*3.4;box('#c3a570',x,sy+.24,z,.025,.02,.25+random()*.35,random()*6);}
  box('#8d806a',0,sy+.38,-20.1,1.5,.22,.85);for(const x of [-.7,.7])box('#a89a81',x,sy+.62,-20.1,.17,.5,.85);for(const z of [-20.48,-19.72])box('#aa9b80',0,sy+.62,z,1.5,.5,.15);block(0,-20.1,1.6,.9);
  lantern(-2.3,-20,2.1,10);lantern(2.3,-18.5,2,8);
  const warm=new THREE.PointLight('#ffc079',12,13,1.5);warm.position.set(0,sy+2.4,-19);stage.add(warm);
  // Folded linen only: deliberately no infant/body silhouette.
  const linenGeo=new THREE.PlaneGeometry(.76,.67,12,12);linenGeo.rotateX(-Math.PI/2);const lp=linenGeo.attributes.position;for(let i=0;i<lp.count;i++)lp.setY(i,.025*Math.sin(lp.getX(i)*23)+.018*Math.cos(lp.getZ(i)*17));linenGeo.computeVertexNormals();const linen=new THREE.Mesh(linenGeo,new THREE.MeshStandardMaterial({color:'#d6c8aa',roughness:1,side:THREE.DoubleSide}));linen.position.set(-.18,sy+.54,-20.1);stage.add(linen);
  const wellPosition=new THREE.Vector3(-3,groundHeight(-3,18),18);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;box('#a6947b',-3+Math.sin(a)*.65,wellPosition.y+.42,18+Math.cos(a)*.65,.38,.84,.32,-a);}
  block(-3,18,1.7,1.7);
  const bucket=new THREE.Mesh(new THREE.CylinderGeometry(.18,.14,.3,12),material('#8f7152'));bucket.position.copy(wellPosition).add(new THREE.Vector3(0,.5,0));stage.add(bucket);let drawWater=0;
  const observationTargets=[{id:'house',label:'가옥 외관 살펴보기',position:()=>new THREE.Vector3(-7,groundHeight(-7,15.4),15.4),description:'흙빛 벽과 평평한 지붕, 작은 문과 생활 용기를 살펴보세요. 특정 유적을 그대로 복원한 건물이 아닌 추정 재현입니다.'},{id:'well',label:'물 저장 시설 살펴보기',position:()=>wellPosition.clone(),description:'마을의 물 저장 시설을 상상해 재현했습니다. 이 위치와 형태는 고고학적으로 확인된 베들레헴 유적의 복원이 아닙니다.',interact:()=>drawWater=9},
   {id:'market',label:'시장 생활 도구 살펴보기',position:()=>new THREE.Vector3(-12.7,groundHeight(-12.7,-1),-1),description:'항아리와 낮은 작업대, 그늘을 만드는 천막을 살펴보세요. 장면의 배치와 색은 시각적 재현입니다.'},
   {id:'manger',label:'구유와 강보 살펴보기',position:()=>new THREE.Vector3(0,sy,-20.1),reference:'누가복음 2:6–7 · 공간은 추정 재현',description:'구유와 접힌 천을 통해 성경의 기록을 묵상합니다. 예수님의 직접적인 형상은 표현하지 않았습니다.'}];
  // Hand-shaped fabric: wind deformation stays on the GPU.
  function windMaterial(color,strength){const m=new THREE.MeshStandardMaterial({color,roughness:1,side:THREE.DoubleSide});m.onBeforeCompile=shader=>{shader.uniforms.uTime={value:0};shader.vertexShader='uniform float uTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\ntransformed.z += sin(position.x * 2.2 + uTime * 1.2) * ${strength} * sin(uv.y * 3.14159);`);swaying.push(shader.uniforms.uTime);};m.customProgramCacheKey=()=>`bethlehem-wind-${strength}`;return m;}
  for(let k=0;k<3;k++){
    const x=-17+k*4.3,z=-.4,y=groundHeight(x,z);
    for(const s of [-1,1]){box('#71583f',x+s*1.5,y+1.35,z-1,.09,2.7,.09);block(x+s*1.5,z-1,.16,.16);}
    const canopy=new THREE.Mesh(new THREE.PlaneGeometry(3.5,2.6,10,8),windMaterial(['#a76554','#a79975','#6e8a89'][k],'.09'));
    canopy.rotation.x=-Math.PI/2+.12;canopy.position.set(x,y+2.6,z-1.3);canopy.castShadow=true;stage.add(canopy);
    box('#8e6c4c',x,y+.8,z-1.1,2.8,.18,.75);block(x,z-1.1,2.8,.85);
    for(const s of [-1,1])box('#69533f',x+s*1.15,y+.4,z-1.1,.12,.8,.6);
    for(let i=0;i<12;i++)part('sphere',k===1?'#bd8b4d':'#8d9870',x-1+(i%6)*.36,y+1,z-1.2+Math.floor(i/6)*.25,.14,.13,.13);
    jar(x+1.8,z-.7,.8);lantern(x-1.6,z+.6,2.2);
  }
  // Olive groves: gnarled trunks and small silver leaf clusters, not round topiary.
  const leafGeo=new THREE.IcosahedronGeometry(1,1);
  for(let i=0;i<28;i++){
    const a=i/28*Math.PI*2,r=35+random()*8,x=Math.sin(a)*r,z=Math.cos(a)*r,y=groundHeight(x,z);
    if(Math.abs(x)<4&&z>0)continue;
    const tree=new THREE.Group();tree.position.set(x,y,z);stage.add(tree);block(x,z,.7,.7);
    part('cylinder','#77634e',x,y+1.1,z,.23,2.2,.23);
    for(let j=0;j<3;j++)part('cylinder','#77634e',x+(j-1)*.35,y+1.8,z,.1,1.3,.1,0,false,(j-1)*-.65);
    const crown=new THREE.InstancedMesh(leafGeo,material('#85957d'),7);crown.position.y=2.5;crown.castShadow=true;tree.add(crown);
    for(let j=0;j<7;j++){const a=j/7*Math.PI*2;matrix.position.set(Math.sin(a)*.9,random()*.5,Math.cos(a)*.7);matrix.scale.set(.9,.48,.65);matrix.rotation.set(0,a,0);matrix.updateMatrix();crown.setMatrixAt(j,matrix.matrix);}
    tree.userData.crown=crown;tree.userData.phase=i;trees.push(tree);
  }
  // Fine ground vegetation is instanced with shader wind, omitted from the shadow pass.
  const grassGeo=new THREE.PlaneGeometry(.13,.5,1,2);grassGeo.translate(0,.25,0);
  const grass=new THREE.InstancedMesh(grassGeo,windMaterial('#93967a','.12'),1100);
  for(let i=0;i<1100;i++){const x=22+random()*20,z=-12+random()*36;matrix.position.set(x,groundHeight(x,z),z);matrix.scale.setScalar(.5+random());matrix.rotation.set(0,random()*6.28,0);matrix.updateMatrix();grass.setMatrixAt(i,matrix.matrix);}stage.add(grass);
  for(let i=0;i<95;i++){const a=random()*6.28,r=32+random()*20;rock(Math.sin(a)*r,Math.cos(a)*r,.25+random()*.65);}
  // Pasture camp and low overlook wall; both reachable on continuous terrain.
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2;rock(29+Math.cos(a)*.7,8+Math.sin(a)*.7,.3);}
  for(let i=0;i<3;i++)box('#59493c',29,groundHeight(29,8)+.15,8,.18,.2,1.2,i*1.1);
  lantern(29,8,.5,18);const fireMesh=new THREE.Mesh(new THREE.ConeGeometry(.25,.65,7),new THREE.MeshBasicMaterial({color:'#e9a95d',transparent:true,opacity:.8}));fireMesh.position.set(29,groundHeight(29,8)+.43,8);stage.add(fireMesh);
  for(let i=0;i<9;i++){const x=27+i*.8,z=-26,y=groundHeight(x,z);box('#a89682',x,y+.45,z,.78,.9,.65);block(x,z,.8,.7);}
  for(const [x,z]of [[-2,13],[2,4],[-2,-5],[2,-13],[23,12],[29,-9],[29,-22]])lantern(x,z,1.9);
  // Layered ridgelines and a clear night sky.
  for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r=80+random()*25;part('sphere',i%2?'#374457':'#435064',Math.cos(a)*r,-4,Math.sin(a)*r,18+random()*12,8+random()*9,15,random()*6);}
  const stars=[];for(let i=0;i<600;i++){const a=random()*6.28,r=95+random()*40;stars.push(Math.cos(a)*r,25+random()*95,Math.sin(a)*r);}
  const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));stage.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:'#dfeafa',size:.16,fog:false})));
  const moon=new THREE.Mesh(new THREE.SphereGeometry(2,20,14),new THREE.MeshBasicMaterial({color:'#eee6d1',fog:false}));moon.position.set(-35,51,-90);stage.add(moon);
  for(const {type,mat,items} of batches.values()){
    const inst=new THREE.InstancedMesh(geometry[type],mat,items.length);items.forEach((m,i)=>inst.setMatrixAt(i,m));inst.castShadow=mat.emissive.getHex()===0;inst.receiveShadow=true;inst.computeBoundingSphere();stage.add(inst);
  }
  // Constant light count prevents shader recompilation as the visitor moves.
  const lights=Array.from({length:mobile?2:4},()=>{const l=new THREE.PointLight('#ffbd74',0,9,1.6);stage.add(l);return l;});
  const revelation=new THREE.PointLight('#e5edff',0,30,1.2);revelation.position.set(28,7,5);stage.add(revelation);const heaven=new THREE.Sprite(new THREE.SpriteMaterial({map:halo,color:'#e8edff',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));heaven.position.set(28,8,5);heaven.scale.set(6,6,1);stage.add(heaven);
  let lightTick=0;const assignments=lights.map(()=>null);
  return {floor,height:groundHeight,layout,targets:()=>observationTargets,
    constrainView(eye,look){eye.y=Math.max(eye.y,groundHeight(eye.x,eye.z)+.6);const delta=eye.clone().sub(look),length=delta.length(),ray=new THREE.Ray(look,delta.normalize()),hit=new THREE.Vector3();let allowed=length;cameraSolids.forEach(box=>{if(!box.containsPoint(look)&&ray.intersectBox(box,hit))allowed=Math.min(allowed,look.distanceTo(hit)-.3);});if(allowed<length)eye.copy(look).addScaledVector(delta,Math.max(.6,allowed));},buildingCount:roomCount,compoundCount:homes.length,architectureTypes,
    adjustCamera(position,visitor,dt){
      const origin=visitor.clone().add(new THREE.Vector3(0,1.5,0)),desired=position.clone(),hit=new THREE.Vector3(),ray=new THREE.Ray();
      const obstructed=()=>{const delta=desired.clone().sub(origin),length=delta.length();ray.set(origin,delta.normalize());return cameraSolids.some(box=>ray.intersectBox(box,hit)&&origin.distanceTo(hit)<length);};
      let lift=0;while(obstructed()&&lift<5.5){desired.y+=1.1;lift+=1.1;}
      cameraLift=lift>cameraLift?lift:THREE.MathUtils.lerp(cameraLift,lift,1-Math.exp(-dt*4));position.y+=cameraLift;
      const delta=position.clone().sub(origin),length=delta.length();ray.set(origin,delta.normalize());let allowed=length;
      cameraSolids.forEach(box=>{if(ray.intersectBox(box,hit))allowed=Math.min(allowed,origin.distanceTo(hit)-.45);});
      if(allowed<length){position.copy(origin).addScaledVector(delta,Math.max(.6,allowed));return true;}return false;
    },
    update(time,dt,visitor,reduced,event,eventTime=0){
      drawWater=Math.max(0,drawWater-dt);bucket.position.y=wellPosition.y+.5+(drawWater>0?Math.sin((9-drawWater)/9*Math.PI)*.9:0);
      fireMesh.scale.y=reduced?1:.85+Math.sin(time*7)*.12;const reveal=event==='shepherds'&&eventTime>=7?1:0;revelation.intensity=THREE.MathUtils.lerp(revelation.intensity,reveal*100,1-Math.exp(-dt*.7));heaven.material.opacity=THREE.MathUtils.lerp(heaven.material.opacity,reveal*.85,1-Math.exp(-dt*.7));
      swaying.forEach(u=>u.value=reduced?0:time);
      trees.forEach(t=>{t.userData.crown.rotation.z=reduced?0:Math.sin(time*.65+t.userData.phase)*.018;});
      flames.forEach((f,i)=>{f.material.opacity=reduced?.85:.82+Math.sin(time*3+i*1.8)*.1;});
      if((lightTick-=dt)<=0){lightTick=.5;const nearest=lightSources.map(p=>({...p,d:(p.x-visitor.x)**2+(p.z-visitor.z)**2})).sort((a,b)=>a.d-b.d).slice(0,lights.length);nearest.forEach((p,i)=>assignments[i]=p);}
      lights.forEach((l,i)=>{const p=assignments[i];if(!p)return;const relocating=Math.abs(l.position.x-p.x)+Math.abs(l.position.z-p.z)>.1;l.intensity=THREE.MathUtils.lerp(l.intensity,relocating?0:p.power,1-Math.exp(-dt*5));if(relocating&&l.intensity<.15)l.position.set(p.x,p.y,p.z);});
    },
  };
}
