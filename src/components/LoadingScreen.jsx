import { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

const TOTAL_DURATION = 3800; 
const FADE_DURATION = 800;   

const CODE_LINES = [
  { cls: "cm", text: "        return 0;" },
  { cls: "", text: "}" },
  { cls: "kw", text: "EXPORT_SYMBOL(groups_to_user);" },
  { cls: "cm", text: "/* set the group_info for a task */" },
  { cls: "", text: "{" },
  { cls: "fn", text: "    groups_free(current->group_info);" },
  { cls: "fn", text: "    current->group_info = group_info;" },
  { cls: "cm", text: "        return 0;" },
  { cls: "", text: "    }" },
  { cls: "", text: "    return NULL;" },
  { cls: "", text: " " },
  { cls: "", text: "{" },
  { cls: "fn", text: "        int i;" },
  { cls: "fn", text: "        free_page((unsigned long)group_info->blocks[i]);" },
  { cls: "", text: "    }" },
  { cls: "", text: "}" },
  { cls: "kw", text: "EXPORT_SYMBOL(groups_free);" },
];

const STATUS_SETS = [
  ['◈ sys.init','◈ arena.connect','◈ prompt.engine'],
  ['◈ kernel.boot','◈ net.handshake','◈ ai.module'],
  ['◈ memory.alloc','◈ sandbox.spawn','◈ weapons.arm'],
  ['◈ auth.verify','◈ rank.load','◈ arena.unlock'],
];

const TickMarks = () => {
  const lines = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * 2 * Math.PI, maj = i % 9 === 0, len = maj ? 9 : 4, r = 138;
    const x1 = 150 + r * Math.cos(a), y1 = 150 + r * Math.sin(a);
    const x2 = 150 + (r-len) * Math.cos(a), y2 = 150 + (r-len) * Math.sin(a);
    lines.push(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} 
            stroke={maj ? 'rgba(0,255,136,0.5)' : 'rgba(0,255,136,0.2)'} 
            strokeWidth={maj ? '2' : '1'} />
    );
  }
  return <g id="ticks">{lines}</g>;
};

function getPieWedgeD(pct) {
  if (pct <= 0) return '';
  const a = (pct/100)*2*Math.PI - Math.PI/2;
  const x = 150 + 90*Math.cos(a), y = 150 + 90*Math.sin(a);
  return `M 150 150 L 150 60 A 90 90 0 ${pct>50?1:0} 1 ${x} ${y} Z`;
}

export default function LoadingScreen({ onComplete }) {
  const [progressPct, setProgressPct] = useState(0); 
  const [phase, setPhase] = useState("loading"); // loading | granted | entering | done
  const [grantedText, setGrantedText] = useState("ACCESS GRANTED");
  
  const [statusIndex, setStatusIndex] = useState(0);
  const [codeKey, setCodeKey] = useState(0);

  const frameRef = useRef(null);
  const startRef = useRef(null);

  // Status cycling
  useEffect(() => {
    if (phase !== "loading") return;
    const int = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_SETS.length);
    }, 900);
    return () => clearInterval(int);
  }, [phase]);

  // Code looping
  useEffect(() => {
    if (phase !== "loading") return;
    const int = setInterval(() => {
      setCodeKey(prev => prev + 1);
    }, 4500);
    return () => clearInterval(int);
  }, [phase]);

  // Phase 1: Animate gauge
  useEffect(() => {
    const animateGauge = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = Math.min(elapsed / TOTAL_DURATION, 1);
      
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const pct = e * 100;
      
      setProgressPct(pct);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(animateGauge);
      } else {
        // Phase 2 triggers
        setStatusIndex(3); // hold last state
        
        setTimeout(() => {
          setPhase("granted");
          
          // Glitch sequence for Access Granted
          setGrantedText("ACCE55 GR4NTED");
          setTimeout(() => setGrantedText("ACC3SS GRANT3D"), 260);
          setTimeout(() => setGrantedText("ACCESS GRANTED"), 520);
          setTimeout(() => setGrantedText("> ENTERING..."), 780);
          setTimeout(() => setGrantedText("ACCESS GRANTED"), 1040);
          
          setTimeout(() => {
            setPhase("done");
            setTimeout(() => {
              onComplete?.();
            }, FADE_DURATION);
          }, 1800);
        }, 500); 
      }
    };

    frameRef.current = requestAnimationFrame(animateGauge);

    // Initial enter animation wrapper if needed
    anime({
      targets: "#loading-screen",
      opacity: [0, 1],
      duration: 600,
      easing: "easeOutExpo"
    });

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [onComplete]);

  const C = 2 * Math.PI * 120; // 753.98

  return (
    <>
      <style>{`
        :root {
          --cyan: #00ff88;
          --cyan-dim: #00cc6a;
          --cyan-dark: #006635;
          --bg: #010a05;
          --text-code: #33ff99;
        }

        #loading-screen {
          position: fixed; inset: 0; z-index: 9999;
          background: var(--bg);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: opacity 0.8s ease;
        }
        #loading-screen.out { opacity: 0; pointer-events: none; }

        .bg-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: bgGridDrift 20s linear infinite;
        }
        @keyframes bgGridDrift { to { background-position: 48px 48px; } }

        .corner { position: absolute; width: 40px; height: 40px; opacity: 0.4; }
        .corner::before, .corner::after { content: ''; position: absolute; background: var(--cyan); }
        .corner::before { width: 100%; height: 2px; top: 0; }
        .corner::after  { width: 2px; height: 100%; top: 0; }
        .corner.tl { top: 16px; left: 16px; }
        .corner.tr { top: 16px; right: 16px; transform: scaleX(-1); }
        .corner.bl { bottom: 16px; left: 16px; transform: scaleY(-1); }
        .corner.br { bottom: 16px; right: 16px; transform: scale(-1); }

        .load-inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
        .load-title {
          font-family: 'Share Tech Mono', sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 10px; color: rgba(0,255,136,0.5);
          text-transform: uppercase; margin-bottom: 48px;
        }

        .main-row { display: flex; align-items: center; gap: 72px; }
        
        @media (max-width: 768px) {
          .main-row { flex-direction: column; gap: 32px; }
        }

        .gauge-wrap { position: relative; width: 300px; height: 300px; flex-shrink: 0; }
        .ring-outer {
          position: absolute; inset: -12px; border-radius: 50%;
          border: 2px solid rgba(0,255,136,0.12);
          box-shadow: inset 0 0 30px rgba(0,255,136,0.05), 0 0 40px rgba(0,255,136,0.07);
        }
        .ticks-svg { position: absolute; inset: 0; width: 100%; height: 100%; animation: tickSpin 30s linear infinite; }
        @keyframes tickSpin { to { transform: rotate(360deg); } }
        .gauge-svg { width: 100%; height: 100%; transform: rotate(-90deg); filter: drop-shadow(0 0 18px var(--cyan)); }
        .gauge-center {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
        }
        .gauge-pct {
          font-family: 'Share Tech Mono', sans-serif; font-size: 56px; font-weight: 900;
          color: var(--cyan); text-shadow: 0 0 20px var(--cyan), 0 0 40px var(--cyan-dim);
          letter-spacing: -2px; line-height: 1;
        }
        .gauge-label { font-size: 11px; color: var(--cyan-dim); letter-spacing: 4px; text-transform: uppercase; opacity: 0.7; }

        .code-panel { width: 390px; }
        @media (max-width: 768px) {
          .code-panel { width: 300px; overflow: hidden; }
        }
        .code-line {
          font-family: 'Share Tech Mono', monospace; font-size: 13px;
          color: var(--text-code); line-height: 1.75; white-space: pre;
          opacity: 0; transform: translateX(-8px);
          animation: lineIn 0.3s ease forwards;
        }
        .code-line.cm { color: #2d8a64; }
        .code-line.kw { color: #00ff88; }
        .code-line.fn { color: #80ffd4; }
        @keyframes lineIn { to { opacity: 1; transform: translateX(0); } }
        .cur {
          display: inline-block; width: 8px; height: 14px;
          background: var(--cyan); vertical-align: middle;
          animation: blink 0.9s step-end infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

        .status-bar {
          display: flex; gap: 36px; margin-top: 40px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 3px;
          color: rgba(0,255,136,0.35); text-transform: uppercase;
        }
        @media (max-width: 768px) {
           .status-bar { gap: 12px; margin-top: 20px; font-size: 8px; flex-wrap: wrap; justify-content: center; }
        }
        .status-bar span { animation: sPulse 2s ease-in-out infinite; }
        .status-bar span:nth-child(2) { animation-delay:0.4s; }
        .status-bar span:nth-child(3) { animation-delay:0.8s; }
        @keyframes sPulse { 0%,100%{opacity:0.35;}50%{opacity:0.85;} }

        /* ACCESS GRANTED */
        #access-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(1, 10, 5, 0.9); backdrop-filter: blur(10px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none;
          transition: opacity 0.25s ease;
        }
        #access-overlay.show { opacity: 1; pointer-events: all; }
        #access-overlay.out  { opacity: 0; }

        .scan-line {
          position: absolute; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          opacity: 0.6; animation: scanDown 1s linear infinite;
        }
        @keyframes scanDown { from{top:-3px;} to{top:100%;} }

        .access-box {
          border: 2px solid var(--cyan); padding: 44px 88px; text-align: center; position: relative;
          box-shadow: 0 0 80px rgba(0,255,136,0.4), inset 0 0 50px rgba(0,255,136,0.07);
          animation: abPulse 0.4s ease-in-out infinite alternate;
        }
        @media (max-width: 768px) {
           .access-box { padding: 30px 40px; }
        }
        @keyframes abPulse {
          from { box-shadow: 0 0 40px rgba(0,255,136,0.3), inset 0 0 30px rgba(0,255,136,0.05); }
          to   { box-shadow: 0 0 100px rgba(0,255,136,0.65), inset 0 0 70px rgba(0,255,136,0.12); }
        }
        .ac { position: absolute; width: 16px; height: 16px; }
        .ac::before,.ac::after { content:''; position:absolute; background:var(--cyan); }
        .ac::before { width:100%; height:2px; top:0; }
        .ac::after  { width:2px; height:100%; top:0; }
        .ac.tl{top:-2px;left:-2px;} .ac.tr{top:-2px;right:-2px;transform:scaleX(-1);}
        .ac.bl{bottom:-2px;left:-2px;transform:scaleY(-1);} .ac.br{bottom:-2px;right:-2px;transform:scale(-1);}

        .access-text {
          font-family: 'Share Tech Mono', sans-serif; font-size: 52px; font-weight: 900;
          color: var(--cyan); letter-spacing: 6px;
          text-shadow: 0 0 20px var(--cyan), 0 0 60px var(--cyan-dim);
        }
        @media (max-width: 768px) {
          .access-text { font-size: 28px; letter-spacing: 2px; }
        }
        .access-sub {
          font-family: 'Share Tech Mono', monospace; font-size: 12px;
          color: rgba(0,255,136,0.55); letter-spacing: 6px; margin-top: 14px; text-transform: uppercase;
        }
      `}</style>
      
      {/* PHASE 1: LOADING SCREEN */}
      <div id="loading-screen" className={phase === "done" ? "out" : ""}>
        <div className="bg-grid"></div>
        <div className="corner tl"></div><div className="corner tr"></div>
        <div className="corner bl"></div><div className="corner br"></div>
        <div className="load-inner" style={{ opacity: phase === "granted" ? 0 : 1, filter: phase === "granted" ? "blur(10px)" : "none", transition: "all 0.4s ease" }}>
          
          <div className="load-title">PROMPTWAR &nbsp;/&nbsp; INITIALIZING</div>
          
          <div className="main-row">
            <div className="gauge-wrap">
              <div className="ring-outer"></div>
              <svg className="ticks-svg" viewBox="0 0 300 300">
                <TickMarks />
              </svg>
              <svg className="gauge-svg" viewBox="0 0 300 300">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="arcG" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#006635"/>
                    <stop offset="100%" stopColor="#00ff88"/>
                  </linearGradient>
                </defs>
                <circle cx="150" cy="150" r="120" fill="none" stroke="#0a2a20" strokeWidth="16"/>
                <circle id="dial-fill" cx="150" cy="150" r="120"
                  fill="none" stroke="url(#arcG)" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={C} strokeDashoffset={C * (1 - progressPct / 100)} filter="url(#glow)"/>
                <path id="pie-wedge" d={getPieWedgeD(progressPct)} fill="rgba(0,180,120,0.1)"/>
              </svg>
              <div className="gauge-center">
                <div className="gauge-pct">{Math.round(progressPct)}%</div>
                <div className="gauge-label">{progressPct >= 100 ? 'complete' : 'loading'}</div>
              </div>
            </div>

            <div className="code-panel" key={codeKey /* forces re-render of CSS animations */}>
              <div id="code-block">
                {CODE_LINES.map((l, i) => (
                  <div key={i} className={`code-line ${l.cls}`} style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
                    {l.text}
                    {i === CODE_LINES.length - 1 && <span className="cur"></span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="status-bar">
            <span>{progressPct >= 100 ? "◈ sys.ready" : STATUS_SETS[statusIndex][0]}</span>
            <span>{progressPct >= 100 ? "◈ arena.online" : STATUS_SETS[statusIndex][1]}</span>
            <span>{progressPct >= 100 ? "◈ access.auth" : STATUS_SETS[statusIndex][2]}</span>
          </div>

        </div>
      </div>

      {/* PHASE 2: ACCESS GRANTED OVERLAY */}
      <div id="access-overlay" className={`${(phase === "granted" || phase === "done") ? "show" : ""} ${phase === "done" ? "out" : ""}`}>
        <div className="scan-line"></div>
        <div className="access-box">
          <div className="ac tl"></div><div className="ac tr"></div>
          <div className="ac bl"></div><div className="ac br"></div>
          <div className="access-text">{grantedText}</div>
          <div className="access-sub">PROMPTWAR SYSTEM ONLINE</div>
        </div>
      </div>
    </>
  );
}
