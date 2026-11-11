// A small bounded cache: only locally authored music, decoded on demand.
const TRACKS=new Set(['village','alley','field','wonder','birth']);
export class FileScore {
 constructor(context,destination){this.ctx=context;this.destination=destination;this.buffers=new Map();this.pending=new Map();this.nodes=new Set();this.desired=null;this.current=null;this.failed=new Set();this.generation=0;}
 async buffer(id){if(this.buffers.has(id)){const b=this.buffers.get(id);this.buffers.delete(id);this.buffers.set(id,b);return b;}if(this.pending.has(id))return this.pending.get(id);
  const request=(async()=>{const response=await fetch(new URL(`../assets/audio/${id}.wav`,import.meta.url));if(!response.ok)throw new Error(`Audio ${response.status}`);const b=await this.ctx.decodeAudioData(await response.arrayBuffer());this.buffers.set(id,b);while(this.buffers.size>3)this.buffers.delete(this.buffers.keys().next().value);return b;})();
  this.pending.set(id,request);try{return await request;}finally{this.pending.delete(id);}
 }
 setZone(id){if(id&&!TRACKS.has(id))id='village';if(this.desired===id)return;this.desired=id;const generation=++this.generation;if(!id){this.fadeOut();return;}this.buffer(id).then(b=>{if(this.desired!==id||generation!==this.generation)return;this.fadeOut();const source=this.ctx.createBufferSource(),gain=this.ctx.createGain(),now=this.ctx.currentTime;source.buffer=b;source.loop=true;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.8,now+2);source.connect(gain).connect(this.destination);const node={source,gain,id,retiring:false};this.nodes.add(node);this.current=node;source.onended=()=>{source.disconnect();gain.disconnect();this.nodes.delete(node);};source.start();}).catch(()=>{if(generation===this.generation)this.failed.add(id);});}
 fadeOut(){const now=this.ctx.currentTime;for(const node of this.nodes){if(node.retiring)continue;node.retiring=true;node.gain.gain.cancelScheduledValues(now);node.gain.gain.setTargetAtTime(0,now,.45);node.source.stop(now+2);}this.current=null;}
 get ready(){return !!this.current&&!this.current.retiring;}
 stats(){return {requested:this.desired,playing:this.current?.id??null,cached:this.buffers.size,nodes:this.nodes.size,decodedBytes:[...this.buffers.values()].reduce((n,b)=>n+b.length*b.numberOfChannels*4,0),failed:[...this.failed]};}
}
