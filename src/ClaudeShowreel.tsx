import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Sequence, Easing, Audio, staticFile } from 'remotion';

const C = {
  bg: '#050507',
  cream: '#F0EDE8',
  red: '#FF1A1A',
  blue: '#2D2BFF',
  lime: '#BFFF00',
}
const BEATS = [0, 120, 240, 360, 420, 510, 630, 720, 810];

export const ClaudeShowreel: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = BEATS.some(b => Math.abs(frame - b) < 4) ? interpolate(frame % 5, [0,2,5], [0,4,0]) : 0;
  return (
    <AbsoluteFill style={{background: C.bg, overflow:'hidden', transform: `translate(${shake}px, ${shake/2}px)`}}>
      {/* Uncomment after you generate audio with Python below */}
      <Audio src={staticFile("beat.wav")} volume={0.9} />
      <Sequence from={0} durationInFrames={120}><IntroMotion /></Sequence>
      <Sequence from={90} durationInFrames={150}><KineticType /></Sequence>
      <Sequence from={240} durationInFrames={135}><Generative3D /></Sequence>
      <Sequence from={360} durationInFrames={75}><ClaudeLoader /></Sequence>
      <Sequence from={420} durationInFrames={100}><ParticleSystem /></Sequence>
      <Sequence from={510} durationInFrames={125}><GridSystems /></Sequence>
      <Sequence from={630} durationInFrames={95}><DataStories /></Sequence>
      <Sequence from={720} durationInFrames={90}><FluidForms /></Sequence>
      <Sequence from={810} durationInFrames={90}><HireMe /></Sequence>
      <OverlayHUD />
      <ProgressBar />
    </AbsoluteFill>
  );
};

const IntroMotion = () => {
  const frame = useCurrentFrame();
  const scale = spring({frame, fps:60, config:{damping:200, stiffness:100}});
  const rotate = interpolate(frame, [0,120], [0, 90]);
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center'}}>
      <div style={{position:'absolute', width:680, height:680, borderRadius:'50%', border:'1.5px solid #FF1A1A', transform:`rotate(${rotate}deg)`}} />
      <svg width={680} height={680} style={{position:'absolute'}}><circle cx={340} cy={340} r={335} fill="none" stroke="white" strokeWidth={0.6} strokeDasharray="12 18" opacity={0.6} style={{transform:`rotate(${rotate}deg)`, transformOrigin:'50% 50%'}} /></svg>
      <div style={{position:'absolute', width:480, height:480, borderRadius:'50%', background:C.red, transform:`scale(${scale})`}} />
      <h1 style={{fontSize:185, fontWeight:900, color:C.cream, letterSpacing:'-0.06em', zIndex:2, lineHeight:1, display:'flex'}}>
        M<span style={{mixBlendMode:'difference'}}>OTI</span>ON
      </h1>
      <div style={{position:'absolute', bottom:235, right:610, color:C.lime, fontFamily:'Georgia', fontStyle:'italic', fontSize:62, transform:'rotate(-8deg)'}}>designer</div>
    </AbsoluteFill>
  );
};

const KineticType = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [0,35], [-1400, 0], {easing:Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{background:C.bg, overflow:'hidden'}}>
      <div style={{position:'absolute', inset:0, transform:`rotate(-15deg) translateX(${sweep}px)`}}>
        {[C.cream, C.blue, C.lime, C.red, C.cream, C.blue].map((col,i)=> <div key={i} style={{height:220, background:col, width:'200%', marginLeft:'-50%'}} />)}
      </div>
      <div style={{position:'absolute', inset:-100, transform:'rotate(-12deg) scale(1.35)', opacity: interpolate(frame,[30,55],[0,1])}}>
        {Array.from({length:7}).map((_,row)=>(
          <div key={row} style={{display:'flex', whiteSpace:'nowrap', fontSize:62, fontWeight:900, lineHeight:1.08, transform:`translateX(${interpolate(frame, [0,120], [0, -380])}px)`}}>
            <span style={{color: row===3 ? 'black' : 'white', background: row===3 ? C.red : 'transparent', padding: row===3 ? '0 20px' : 0, position:'relative', display:'flex'}}>
              RHYTHM • TYPE • RHYTHM • TIMING • EASING • MOTION • KINETIC • TIMING •
              {row===3 && <div style={{position:'absolute', right:-70, top:-25, width:150, height:150, borderRadius:'50%', background:'#F0EDE8', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid white'}}><div style={{background:C.blue, color:'white', width:'100%', textAlign:'center', fontSize:22, padding:'6px 0'}}>TIMING</div></div>}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Generative3D = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background:C.bg, padding:60}}>
      <div style={{color:C.cream, fontSize:78, fontWeight:900, lineHeight:0.9}}>GENERATIVE<br/><span style={{color:C.red, fontFamily:'Georgia', fontStyle:'italic', fontWeight:400, fontSize:72}}>worlds.</span></div>
      <div style={{position:'absolute', right:110, top:175, width:720, height:540, transform:'rotateX(55deg) rotateZ(-35deg)', display:'grid', gridTemplateColumns:`repeat(15, 1fr)`, gap:6}}>
        {Array.from({length:225}).map((_,i)=>{
          const x=i%15, y=Math.floor(i/15);
          const n = Math.sin(x*0.6 + frame*0.08) * Math.cos(y*0.6 + frame*0.05);
          const h = interpolate(n, [-1,1], [14, 115]);
          const color = n > 0.6 ? C.red : n > 0.25 ? C.lime : n < -0.6 ? C.blue : '#C8C6C2';
          return <div key={i} style={{background: color, height:h, border:'1px solid rgba(0,0,0,0.2)'}} />
        })}
      </div>
      <div style={{position:'absolute', bottom:45, left:40, color:'white', fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em', opacity:0.7}}>225 PROCEDURAL BLOCKS • SIMPLEX NOISE • ZERO KEYFRAMES</div>
    </AbsoluteFill>
  );
};

const ClaudeLoader = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0,60], [0,1], {easing:Easing.inOut(Easing.cubic)});
  const textIn = spring({frame: frame-25, fps:60, config:{damping:15}});
  return (
    <AbsoluteFill style={{background:C.bg, justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
      <svg width={120} height={120} viewBox="0 0 100 100">
        <g transform="translate(50,50)">
          {[0,60,120,180,240,300].map((deg,i)=>{
            const len = 20 + progress*18;
            const opacity = interpolate(frame, [i*4, i*4+15], [0.2, 1], {extrapolateRight:'clamp'});
            return <g key={i} transform={`rotate(${deg + frame*0.9})`} opacity={opacity}><rect x={-2.2} y={-len} width={4.4} height={len} rx={2} fill={C.cream} /></g>
          })}
          <circle r={8} fill={C.cream} />
        </g>
        <circle cx={50} cy={50} r={46} fill="none" stroke={C.cream} strokeWidth={0.8} opacity={0.35} strokeDasharray={`${progress*289} 289`} transform="rotate(-90 50 50)" />
      </svg>
      <div style={{marginTop:24, overflow:'hidden', height:30}}>
        <div style={{color:C.cream, fontSize:22, letterSpacing:'0.35em', fontWeight:600, transform:`translateY(${interpolate(textIn,[0,1],[40,0])}px)`, opacity:textIn, fontFamily:'monospace'}}>
          by <span style={{fontWeight:900, color:'white'}}>claude opus 5.5</span>
        </div>
      </div>
      <div style={{color:'rgba(255,255,255,0.5)', fontSize:10, marginTop:8, letterSpacing:'0.22em', opacity: interpolate(frame,[40,60],[0,1])}}>ANTHROPIC • MOTION REEL '26</div>
    </AbsoluteFill>
  );
};

const ParticleSystem = () => {
  const frame = useCurrentFrame();
  const phase = frame < 35 ? 0 : frame < 65 ? 1 : 2;
  const text = "with Ayogwokhai Josemaria";
  return (
    <AbsoluteFill style={{background:'#050507', justifyContent:'center', alignItems:'center'}}>
      <div style={{position:'relative', width:1920, height:500, display:'flex', justifyContent:'center', alignItems:'center'}}>
        {Array.from({length:3600}).map((_,i)=>{
          const phi = Math.acos(1 - 2*(i/3600));
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const r = 225;
          const sx = r * Math.sin(phi) * Math.cos(theta + frame*0.008);
          const sy = r * Math.sin(phi) * Math.sin(theta + frame*0.008);
          const charIdx = Math.floor(i / 135) % text.length;
          const tx = (charIdx - text.length/2) * 48 + (Math.random()-0.5)*26;
          const ty = (Math.random()-0.5)*84;
          const bx = (Math.random()-0.5)*1500;
          const by = (Math.random()-0.5)*850;
          let x=0,y=0; let color = i%7===0?C.red : i%11===0?C.blue : C.cream;
          if(phase===0){ const p=interpolate(frame,[0,35],[0,1],{easing:Easing.out(Easing.cubic)}); x=interpolate(p,[0,1],[0,bx]); y=interpolate(p,[0,1],[0,by]); }
          else if(phase===1){ const p=interpolate(frame,[35,65],[0,1],{easing:Easing.inOut(Easing.cubic)}); x=interpolate(p,[0,1],[bx,sx]); y=interpolate(p,[0,1],[by,sy]); }
          else{ const p=interpolate(frame,[65,100],[0,1],{easing:Easing.inOut(Easing.cubic)}); const twist=Math.sin(frame*0.12+i*0.01)*(1-p)*22; x=interpolate(p,[0,1],[sx,tx+twist]); y=interpolate(p,[0,1],[sy,ty]); }
          return <div key={i} style={{position:'absolute', left:'50%', top:'50%', width: phase===0?13:3, height:2, background:color, transform:`translate(${x}px,${y}px)`, opacity:0.92, borderRadius:2}} />
        })}
      </div>
      <div style={{position:'absolute', bottom:38, left:40, color:'white', fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em', opacity:0.6}}>N = 3,600 PARTICLES • MORPH 02 <span style={{color:C.red}}>SPHERE → TYPE</span></div>
      {phase===2 && <div style={{position:'absolute', bottom:110, color:C.lime, fontFamily:'monospace', fontSize:11, letterSpacing:'0.15em', opacity:0.9}}>→ with Ayogwokhai Josemaria</div>}
    </AbsoluteFill>
  );
};

const GridSystems = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background:C.blue, overflow:'hidden', justifyContent:'center', alignItems:'center'}}>
      <div style={{position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(8, 1fr)', gridTemplateRows:'repeat(5, 1fr)', gap:8, padding:18, transform:'rotate(1.5deg) scale(1.08)'}}>
        {Array.from({length:40}).map((_,i)=>{
          const dist=Math.hypot(i%8-4, Math.floor(i/8)-2.5);
          const wave=Math.sin(dist*0.9 - frame*0.18);
          const scale=1+wave*0.12;
          const bg=i%3===0?C.lime:i%3===1?C.red:C.cream;
          return <div key={i} style={{background:bg, display:'flex', justifyContent:'center', alignItems:'center', transform:`scale(${scale}) rotate(${wave*5}deg)`, borderRadius: i%4===0?'50%':8}}><div style={{width:'38%', height:'38%', borderRadius:'50%', border:`4px solid black`, background: i%5===0?'black':'transparent'}}/></div>
        })}
      </div>
      <div style={{background:'black', color:'white', fontSize:68, fontWeight:900, letterSpacing:'0.42em', padding:'16px 36px', zIndex:2}}>SYSTEMS.</div>
      <div style={{position:'absolute', bottom:18, left:18, background:'black', color:'white', fontFamily:'monospace', fontSize:9, padding:'6px 10px', letterSpacing:'0.15em'}}>GRID SYSTEMS • 40 MODULES • RIPPLES LOCKED TO 120 BPM</div>
    </AbsoluteFill>
  );
};

const DataStories = () => {
  const frame = useCurrentFrame();
  const c1 = Math.floor(interpolate(frame, [0,40], [0,900]));
  const c2 = Math.floor(interpolate(frame, [5,45], [0,60]));
  const c3 = Math.floor(interpolate(frame, [20,60], [0,1]));
  return (
    <AbsoluteFill style={{background:C.blue, padding:'78px 68px'}}>
      <div style={{color:'rgba(255,255,255,0.75)', fontSize:12, letterSpacing:'0.3em', fontFamily:'monospace'}}>DATA STORIES — THIS REEL, BY THE NUMBERS</div>
      <div style={{display:'flex', gap:68, marginTop:38}}>
        <div><div style={{fontSize:132, fontWeight:900, color:C.cream, lineHeight:1}}>{c1}</div><div style={{width:330, height:2, background:'white', marginTop:8}}/><div style={{color:'rgba(255,255,255,0.8)', fontSize:11, letterSpacing:'0.2em', marginTop:8, fontFamily:'monospace'}}>FRAMES RENDERED</div></div>
        <div><div style={{fontSize:132, fontWeight:900, color:C.cream, lineHeight:1}}>{c2}</div><div style={{width:330, height:2, background:'white', marginTop:8}}/><div style={{color:'rgba(255,255,255,0.8)', fontSize:11, letterSpacing:'0.2em', marginTop:8, fontFamily:'monospace'}}>FRAMES PER SECOND</div></div>
        <div><div style={{fontSize:132, fontWeight:900, color:C.lime, lineHeight:1}}>{c3}</div><div style={{width:330, height:2, background:'white', marginTop:8}}/><div style={{color:'rgba(255,255,255,0.8)', fontSize:11, letterSpacing:'0.2em', marginTop:8, fontFamily:'monospace'}}>PROMPT. THAT'S IT.</div></div>
      </div>
      <div style={{position:'absolute', bottom:78, left:68, right:68, display:'flex', alignItems:'flex-end', gap:5, height:110}}>
        {Array.from({length:44}).map((_,i)=> <div key={i} style={{flex:1, height: 18+Math.abs(Math.sin(i*0.7+frame*0.02))*78, background: i===26?C.red:'rgba(255,255,255,0.42)'}} />)}
      </div>
    </AbsoluteFill>
  );
};

const FluidForms = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background:C.blue, justifyContent:'center', alignItems:'center'}}>
      <h1 style={{fontSize:290, fontFamily:'Georgia', fontStyle:'italic', color:'white', fontWeight:300, letterSpacing:'-0.05em'}}>fluid</h1>
      <div style={{position:'absolute', width:580, height:380}}>
        <div style={{position:'absolute', left:95, top:75, width:255, height:255, background:'radial-gradient(circle at 30% 20%, #fff, #BFFF00, #FF1A1A, #2D2BFF)', borderRadius:'60% 40% 55% 45% / 50% 60% 40% 50%', transform:`translate(${Math.sin(frame*0.06)*20}px,${Math.cos(frame*0.05)*15}px)`, boxShadow:'inset 0 0 38px rgba(255,255,255,0.85)'}} />
        <div style={{position:'absolute', left:275, top:135, width:218, height:218, background:'radial-gradient(circle at 30% 20%, #fff, #BFFF00, #4A00FF)', borderRadius:'45% 55% 40% 60% / 60% 45% 55% 40%', transform:`translate(${Math.cos(frame*0.07)*18}px,${Math.sin(frame*0.06)*12}px)`, boxShadow:'inset 0 0 38px rgba(255,255,255,0.85)'}} />
      </div>
    </AbsoluteFill>
  );
};

const HireMe = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background:C.bg, padding:58, justifyContent:'space-between'}}>
      <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
        <div style={{flex:1}}>
          <div style={{color:C.cream, fontSize:44, fontWeight:900}}>CLAUDE OPUS 5.5<span style={{color:C.lime, fontFamily:'Georgia', fontStyle:'italic', fontWeight:400}}>. motion designer.</span></div>
          <div style={{color:'rgba(255,255,255,0.62)', fontFamily:'monospace', fontSize:11, marginTop:10, lineHeight:1.8}}>SPRING PHYSICS • PROCEDURAL 3D • PARTICLE SYSTEMS • FLUID SIM • CODE ONLY</div>
          <div style={{marginTop:32, display:'flex', gap:28}}>
            <div style={{color:'white'}}><div style={{fontSize:10, opacity:0.5, fontFamily:'monospace'}}>BUILT BY</div><div style={{fontWeight:800}}>Anthropic</div></div>
            <div style={{color:'white'}}><div style={{fontSize:10, opacity:0.5, fontFamily:'monospace'}}>WITH</div><div style={{fontWeight:800, color:C.lime}}>Ayogwokhai Josemaria</div></div>
          </div>
          <div style={{marginTop:26, border:'1px solid rgba(255,255,255,0.18)', display:'inline-block', padding:'10px 16px', color:C.cream, fontFamily:'monospace', fontSize:10, letterSpacing:'0.12em'}}>900 FRAMES • 60 FPS • ONE PROMPT • NO STOCK • ALL CODE</div>
        </div>
        <div style={{width:270, height:270, borderRadius:'50%', border:'1.5px dashed rgba(255,255,255,0.38)', display:'flex', justifyContent:'center', alignItems:'center', transform:`rotate(${frame*0.35}deg)`}}>
          <div style={{width:195, height:195, borderRadius:'50%', background:C.lime, display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center', color:'black', fontWeight:900, lineHeight:1, transform:`rotate(${-frame*0.35}deg)`, fontSize:18}}>AVAILABLE<br/>FOR HIRE<br/>↗</div>
        </div>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', color:'rgba(255,255,255,0.4)', fontFamily:'monospace', fontSize:10, borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:14}}>
        <span>© 2026 CLAUDE OPUS 5.5 BY ANTHROPIC</span><span>WITH AYOGWOKHAI JOSEMARIA</span>
      </div>
    </AbsoluteFill>
  );
};

const OverlayHUD: React.FC = () => {
  const frame = useCurrentFrame();
  const tc = `TC 00:00:${String(Math.floor(frame/60)).padStart(2,'0')}:${String(frame%60).padStart(2,'0')}`;
  const chapter = Math.min(8, Math.floor(frame / 112.5) + 1);
  return (
    <>
      <div style={{position:'absolute', top:18, left:22, color:'white', fontFamily:'monospace', fontSize:10, letterSpacing:'0.14em', opacity:0.8}}>SUPERAPP — MOTION REEL '26</div>
      <div style={{position:'absolute', top:18, right:22, color:'white', fontFamily:'monospace', fontSize:10, opacity:0.8}}>{tc}</div>
      <div style={{position:'absolute', bottom:14, left:22, color:'white', fontFamily:'monospace', fontSize:9, letterSpacing:'0.16em', opacity:0.7}}>0{chapter} / 08 &nbsp; {['INTRO','KINETIC TYPE','GENERATIVE 3D','CLAUDE LOADER','PARTICLE SYSTEMS','GRID SYSTEMS','DATA STORIES','FLUID / HIRE'][chapter-1]}</div>
      <div style={{position:'absolute', bottom:14, right:22, color:'white', fontFamily:'monospace', fontSize:9, opacity:0.6}}>1920×1080 • 60 FPS • F{frame.toString().padStart(3,'0')}</div>
      <div style={{position:'absolute', top:20, left:'50%', width:1, height:16, background:'rgba(255,255,255,0.3)', transform:'translateX(-50%)'}} />
      <div style={{position:'absolute', top:'50%', left:0, width:16, height:1, background:'rgba(255,255,255,0.3)', transform:'translateY(-50%)'}} />
    </>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position:'absolute', bottom:0, left:0, right:0, height:3, background:'rgba(255,255,255,0.12)'}}>
      <div style={{width:`${(frame/durationInFrames)*100}%`, height:'100%', background:`linear-gradient(90deg, ${C.blue}, ${C.red}, ${C.lime})`}} />
      <div style={{position:'absolute', bottom:5, left:0, right:0, display:'flex', justifyContent:'space-between', padding:'0 22px'}}>
        {Array.from({length:9}).map((_,i)=> <div key={i} style={{width:2, height:6, background: frame >= BEATS[i] ? 'white' : 'rgba(255,255,255,0.25)'}} />)}
      </div>
    </div>
  );
};
