export class AdventureControls {
 constructor({canAct,onMove,onJump}){this.x=0;this.y=0;this.run=false;this.jump=0;this.velocity=0;const pad=document.querySelector('#joystick'),knob=pad.querySelector('span');let pointer=null;
 const move=e=>{if(pointer!==e.pointerId)return;const r=pad.getBoundingClientRect(),dx=e.clientX-r.x-r.width/2,dy=e.clientY-r.y-r.height/2,len=Math.hypot(dx,dy),scale=Math.max(38,len);this.x=dx/scale;this.y=-dy/scale;knob.style.transform=`translate(${this.x*32}px,${-this.y*32}px)`;onMove();};
 this.reset=()=>{this.x=this.y=0;this.run=false;pointer=null;knob.style.transform='';document.querySelector('#run-button').setAttribute('aria-pressed','false');};
 pad.onpointerdown=e=>{if(!canAct())return;e.preventDefault();pointer=e.pointerId;pad.setPointerCapture(pointer);move(e);};pad.onpointermove=move;pad.onpointerup=pad.onpointercancel=pad.onlostpointercapture=()=>this.reset();
 document.querySelector('#run-button').onclick=()=>{if(canAct()){this.run=!this.run;document.querySelector('#run-button').setAttribute('aria-pressed',String(this.run));}};document.querySelector('#jump-button').onclick=()=>{if(canAct())onJump();};
 addEventListener('blur',()=>this.reset());document.addEventListener('visibilitychange',()=>this.reset());
 }
 startJump(){if(this.jump===0){this.velocity=5.3;return true;}return false;}
 update(dt){this.velocity-=14*dt;this.jump=Math.max(0,this.jump+this.velocity*dt);if(this.jump===0)this.velocity=0;return this.jump;}
}
