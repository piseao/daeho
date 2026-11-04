// Phase 1 only: authored scenery, lighting accents and ambient motion.
// No NPC, story, cinematic or persistent-state changes live in this module.
export function dressEnvironment({THREE,stage,staticRoot,movingRoot,houses,heightAt,walkable,group,box,ball,part,rect,circle,material,lamp,jar,basket,mobile,reduced}) {
  let seed=20261104;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const cloths=[];
  // Original procedural lime-plaster/stone surface, not a downloaded texture.
  const masonryCanvas=document.createElement('canvas');masonryCanvas.width=masonryCanvas.height=256;
  const masonry=masonryCanvas.getContext('2d');masonry.fillStyle='#dedbd5';masonry.fillRect(0,0,256,256);
  for(let row=0;row<6;row++)for(let col=-1;col<5;col++){
    const tone=Math.floor(218+random()*24),x=col*66+(row%2)*33,y=row*44;
    masonry.fillStyle=`rgb(${tone},${tone},${tone})`;masonry.fillRect(x+1,y+1,63,41);
    for(let grain=0;grain<18;grain++){masonry.fillStyle='rgba(130,120,100,.06)';masonry.fillRect(x+random()*63,y+random()*41,1+random()*3,1);}
  }
  const masonryMap=new THREE.CanvasTexture(masonryCanvas);masonryMap.colorSpace=THREE.SRGBColorSpace;masonryMap.wrapS=masonryMap.wrapT=THREE.RepeatWrapping;masonryMap.anisotropy=2;
  for(const color of ['#c4b49d','#d2c1a3','#b7ac99','#b3a68b','#bdaf91'])material(color).map=masonryMap;
  // A single hand-generated light mask is shared by every window/lantern pool.
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,1,64,64,64);
  gradient.addColorStop(0,'rgba(255,200,117,.7)');gradient.addColorStop(.4,'rgba(255,184,99,.3)');gradient.addColorStop(1,'rgba(255,174,91,0)');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const glowMap=new THREE.CanvasTexture(canvas);glowMap.colorSpace=THREE.SRGBColorSpace;
  const glowMaterial=new THREE.MeshBasicMaterial({map:glowMap,transparent:true,opacity:.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  const pools=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),glowMaterial,houses.length+3),transform=new THREE.Object3D();
  const poolPositions=houses.map(([x,z,w,d])=>[x,z+d/2+.8,3.5,2.7]);poolPositions.push([0,-10.8,6,5],[-7,7,5,4],[19,3,4,4]);
  poolPositions.forEach(([x,z,w,d],i)=>{transform.position.set(x,heightAt(x,z)+.055,z);transform.rotation.set(-Math.PI/2,0,0);transform.scale.set(w,d,1);transform.updateMatrix();pools.setMatrixAt(i,transform.matrix);});
  pools.computeBoundingSphere();stage.add(pools);

  function canopy(x,z,width,depth,color){
    const base=heightAt(x,z),clothGeometry=new THREE.PlaneGeometry(width,depth,10,6);clothGeometry.rotateX(-Math.PI/2);
    const positions=clothGeometry.attributes.position,original=[];
    for(let i=0;i<positions.count;i++){
      const px=positions.getX(i),pz=positions.getZ(i),y=2.65-.23*(1-(px/(width/2))**2)+.05*Math.cos(pz*3);
      positions.setY(i,y);original.push(y);
    }
    clothGeometry.computeVertexNormals();
    const clothMaterial=new THREE.MeshStandardMaterial({color,roughness:1,side:THREE.DoubleSide});
    const mesh=new THREE.Mesh(clothGeometry,clothMaterial);mesh.position.set(x,base,z);mesh.castShadow=true;mesh.receiveShadow=true;stage.add(mesh);
    cloths.push({mesh,original,phase:x});
    for(const side of [-1,1])for(const front of [-1,1]){const px=x+side*width*.48,pz=z+front*depth*.48,g=group(px,pz);box(g,'#92795b',0,1.35,0,.09,2.7,.09);circle(px,pz,.09);}
  }
  // Market stalls sit along the westward route; the middle remains a passage.
  canopy(-7,10,3.6,2.3,'#aaa9b5');canopy(-14,11.5,3.2,2,'#b99b83');canopy(-10,3.3,2.8,1.8,'#a6aba0');
  for(const [x,z] of [[-14,11.3],[-10,3.2]]){
    const g=group(x,z);box(g,'#92795b',0,.7,0,2.5,.12,.72);rect(x,z,2.5,.75);
    for(const side of [-1,1])box(g,'#92795b',side, .35,0,.12,.7,.55);
    for(let i=0;i<6;i++)ball(g,'#d3ba84',-.9+i*.32,.84,0,.14,.08,.11);
    basket(x+1.6,z+.5);jar(x-1.8,z+.2,.8);
  }
  // Courtyard work areas: woven racks, stacked wood, small stone ovens.
  for(const index of [0,2,8,10,14,18]){
    const [x,z,w,d]=houses[index],g=group(x-w/2-.7,z-d/2+.8);
    for(let i=0;i<4;i++){const log=part(g,'cylinder','#92795b',(i%2)*.23,.14+Math.floor(i/2)*.19,0,.1,1);log.rotation.x=Math.PI/2;}
    circle(g.position.x,g.position.z,.5);
    const roof=group(x,z,staticRoot,heightAt(x,z));
    for(let i=0;i<4;i++)box(roof,'#92795b',-w/2+.5+i*.55,houses[index][4]+.26,-d/2+.5,.32,.09,.65);
  }
  const oven=group(-18,8);ball(oven,'#a59781',0,.6,0,.85,.7,.8);ball(oven,'#665e52',0,.35,.74,.32,.3,.06);circle(-18,8,.85);

  // Low terrace walls hold the western hillside without sealing off the lanes.
  for(const [x,z,length,angle] of [[-27,0,8,0],[-19,-18,5,0],[-5,-19,4,0],[14,-19,5,0],[26,-14,5,Math.PI/2]]){
    const g=group(x,z);g.rotation.y=angle;
    for(let row=0;row<2;row++)for(let i=0;i<Math.floor(length/.65);i++)box(g,row?'#c4b49d':'#a59781',-length/2+i*.65+(row?.2:0),.17+row*.32,0,.59,.28,.5);
    rect(x,z,angle?.6:length,angle?length:.6);
  }
  // Shallow stepping stones follow the actual elevation on the lookout path.
  for(let i=0;i<9;i++){const x=19+i*.12,z=-7-i*.65,g=group(x,z);box(g,'#c4b49d',0,.025,0,1.5,.055,.42);}
  const lookout=group(21,-16.5);box(lookout,'#92795b',0,.63,0,2.1,.13,.55);
  for(const x of [-.8,.8])box(lookout,'#92795b',x,.3,0,.14,.6,.5);rect(21,-16.5,2.1,.65);
  lamp(22,-14,1.15);

  // Rounded rocks, gravel and olive undergrowth soften the building silhouettes.
  for(const [x,z,s] of [[-28,10,1.1],[-26,-20,1.5],[27,-17,1.2],[26,4,.8],[10,26,.65],[-12,25,.8]]){
    const g=group(x,z);ball(g,'#a59781',0,.35*s,0,.8*s,.5*s,.65*s);ball(g,'#c4b49d',.55*s,.18*s,.2*s,.4*s,.3*s,.4*s);circle(x,z,.8*s);
  }
  for(let i=0;i<(mobile?45:90);i++){
    const a=random()*Math.PI*2,r=18+random()*14,x=Math.sin(a)*r,z=Math.cos(a)*r;
    if(!walkable(x,z)||houses.some(([hx,hz,w,d])=>Math.abs(x-hx)<w/2+1&&Math.abs(z-hz)<d/2+1))continue;
    const g=group(x,z);g.rotation.y=random()*Math.PI;box(g,'#a59781',0,.035,0,.08+random()*.16,.07,.12);
  }
  const grassGeometry=new THREE.BufferGeometry(),bladeVertices=[],bladeIndices=[];
  for(let blade=0;blade<3;blade++){
    const angle=blade*Math.PI*2/3,cs=Math.cos(angle),sn=Math.sin(angle),offset=blade*5;
    for(const [x,y,z] of [[-.035,0,0],[.035,0,0],[-.015,.25,0],[.035,.25,0],[.065,.43,0]])bladeVertices.push(x*cs+z*sn,y,-x*sn+z*cs);
    bladeIndices.push(offset,offset+1,offset+2,offset+1,offset+3,offset+2,offset+2,offset+3,offset+4);
  }
  grassGeometry.setAttribute('position',new THREE.Float32BufferAttribute(bladeVertices,3));grassGeometry.setIndex(bladeIndices);grassGeometry.computeVertexNormals();
  const wind={value:0},grassMaterial=new THREE.MeshStandardMaterial({color:'#a5aa80',roughness:1,side:THREE.DoubleSide});
  grassMaterial.onBeforeCompile=shader=>{shader.uniforms.windTime=wind;shader.vertexShader='uniform float windTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
    transformed.x += sin(windTime + instanceMatrix[3].x * .7 + instanceMatrix[3].z) * position.y * .15;`);};
  grassMaterial.customProgramCacheKey=()=> 'bethlehem-grass-v1';
  const count=mobile?180:380,grass=new THREE.InstancedMesh(grassGeometry,grassMaterial,count);let planted=0;
  for(let attempt=0;planted<count&&attempt<count*6;attempt++){
    const a=random()*Math.PI*2,r=17+random()*15,x=Math.sin(a)*r,z=Math.cos(a)*r;
    if(!walkable(x,z)||houses.some(([hx,hz,w,d])=>Math.abs(x-hx)<w/2+1&&Math.abs(z-hz)<d/2+1))continue;
    transform.position.set(x,heightAt(x,z),z);transform.rotation.set(0,random()*Math.PI,0);transform.scale.setScalar(.55+random()*.8);transform.updateMatrix();grass.setMatrixAt(planted++,transform.matrix);
  }
  grass.count=planted;grass.computeBoundingSphere();stage.add(grass);

  // Far ground prevents the playable terrain reading as a floating square.
  const farGround=new THREE.Mesh(new THREE.CircleGeometry(140,64),new THREE.MeshStandardMaterial({color:'#7e8279',roughness:1}));farGround.rotation.x=-Math.PI/2;farGround.position.y=-2.1;farGround.receiveShadow=false;stage.add(farGround);
  // A restrained sky gradient; no post-processing pass or full-screen bloom cost.
  const sky=new THREE.Mesh(new THREE.SphereGeometry(170,24,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color('#101d35')},horizon:{value:new THREE.Color('#566278')}},vertexShader:'varying vec3 skyPosition;void main(){skyPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform vec3 top;uniform vec3 horizon;varying vec3 skyPosition;void main(){float t=smoothstep(-.04,.5,normalize(skyPosition).y);gl_FragColor=vec4(mix(horizon,top,t),1.0);}'}));sky.renderOrder=-10;stage.add(sky);
  let lastClothTime=-1;
  function update(time,camera){
    wind.value=reduced?0:time*.9;
    // Cloth is only updated near the viewer and at 15 Hz on mobile / 24 Hz desktop.
    if(reduced||time-lastClothTime<(mobile?1/15:1/24))return;lastClothTime=time;
    for(const {mesh,original,phase} of cloths){
      if(mesh.position.distanceToSquared(camera.position)>1600)continue;
      const attr=mesh.geometry.attributes.position;
      for(let i=0;i<attr.count;i++){const x=attr.getX(i),z=attr.getZ(i);attr.setY(i,original[i]+Math.sin(time*1.15+x*1.8+phase)*.035*Math.cos(z));}
      attr.needsUpdate=true;mesh.geometry.computeVertexNormals();
    }
  }
  return {update,dispose(){/* Stage disposal owns geometry, materials and glowMap. */},stats:{houses:houses.length,canopies:cloths.length,grass:planted,shadowLights:1,extraPointLights:0}};
}
