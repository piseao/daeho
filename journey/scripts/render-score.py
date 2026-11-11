"""Original deterministic ambient miniatures. No samples, borrowed melody or external service.
Run with Python 3; writes WAV masters to /tmp/journey-score-masters.
Distribution uses 16 kHz mono PCM WAV; no browser codec dependency.
"""
import math, wave, array, pathlib
RATE=32000
DURATION=32
OUT=pathlib.Path('/tmp/journey-score-masters');OUT.mkdir(exist_ok=True)
PROFILES={
 'village':(48,[0,7,12,16,14,7,4,12],1.5),
 'alley':(48,[0,7,4,12],3),
 'field':(45,[0,7,10,14,12,7],2.5),
 'wonder':(53,[0,7,12,16,19,16,12,7],2),
 'birth':(48,[12,16,19,14,12,7,4,7],2),
}
for name,(root,melody,spacing) in PROFILES.items():
 data=[0.0]*(RATE*DURATION)
 def note(midi,start,duration,amplitude,plucked=False):
  frequency=440*2**((midi-69)/12)
  for i in range(int(duration*RATE)):
   j=int(start*RATE)+i
   if j>=len(data):break
   t=i/RATE
   envelope=(1-math.exp(-t*(28 if plucked else 2)))*math.exp(-t/(1.5 if plucked else 3))*min(1,max(0,(duration-t)/1.2))
   vibrato=.002*math.sin(2*math.pi*4.3*t)*min(1,t)
   phase=2*math.pi*frequency*t+vibrato
   sample=math.sin(phase)+.18*math.sin(2*phase)*math.exp(-t*.7)+.06*math.sin(3*phase)*math.exp(-t)
   data[j]+=sample*envelope*amplitude
 for bar in range(4):
  shift=[0,5,0,7][bar]
  for degree,level in [(0,.055),(7,.03),(12,.02)]:note(root+shift+degree,bar*8,8,.7*level)
 for i in range(int(28/spacing)):
  note(root+12+melody[i%len(melody)],1+i*spacing,4.5,.065 if name!='alley' else .035,True)
 # Short diffuse echoes, no copyrighted impulse response.
 dry=data[:]
 for delay,amount in [(int(.173*RATE),.16),(int(.311*RATE),.11),(int(.523*RATE),.065)]:
  for i in range(delay,len(data)):data[i]+=dry[i-delay]*amount
 samples=array.array('h')
 for i,value in enumerate(data):
  t=i/RATE;fade=min(1,t/2,(DURATION-t)/3)
  samples.append(int(max(-.9,min(.9,value*fade))*32767))
 with wave.open(str(OUT/(name+'.wav')),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(RATE);f.writeframes(samples.tobytes())
 print(name, len(samples)/RATE)

# Downsample the band-limited score for static hosting (no external encoder).
DEST=pathlib.Path(__file__).resolve().parents[1]/'assets'/'audio';DEST.mkdir(parents=True,exist_ok=True)
for src in OUT.glob('*.wav'):
 with wave.open(str(src),'rb') as r: pcm=r.readframes(r.getnframes())
 with wave.open(str(DEST/src.name),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE//2)
  w.writeframes(b''.join(pcm[i:i+2] for i in range(0,len(pcm),4)))
