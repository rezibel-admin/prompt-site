import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Trash2, X, Lock, LogOut, Crown, RefreshCw, Cpu, Atom, Gem, Briefcase, 
  Plus, CheckCircle2, ArrowUp, ArrowDown, Save, QrCode, Image as ImageIcon, 
  MessageSquare, Target, Wand2, Bot, Zap, Loader2, Volume2, VolumeX
} from 'lucide-react';

// --- CONFIG & CREDENTIALS ---
const supabaseUrl = 'https://bibgekufrjfokauiksca.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpYmdla3Vmcmpmb2thdWlrc2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODM4MDYsImV4cCI6MjA4NjY1OTgwNn0.VcBiqjnYS4adCa-mzp00Z-Ki3keWECi9qea3iYJk_Yw';
const ADMIN_CREDENTIALS = { user: "RezibelRr845", pass: "RezaRezibel13845" };

const GREETING_URL = "https://bibgekufrjfokauiksca.supabase.co/storage/v1/object/public/audio/ElevenLabs_2026-02-15T18_14_14_Donovan%20-%20Articulate,%20Strong%20and%20Deep_pvc_sp100_s50_sb75_v3.mp3"; 
const BG_MUSIC_URL = "https://bibgekufrjfokauiksca.supabase.co/storage/v1/object/public/audio/starostin-ambient-ambient-music-484374.mp3";

const formatPersianText = (text) => {
  if (!text) return "";
  const parts = text.split(/(\d+(?:[\.\-\/]\d+)?(?:\s*[xX]|\s*K|\s*s|\s*م)?|AI|FPV|T|M|4K|SEO)/g);
  return parts.map((part, i) => {
    if (/(\d+(?:[\.\-\/]\d+)?(?:\s*[xX]|\s*K|\s*s|\s*م)?|AI|FPV|T|M|4K|SEO)/g.test(part)) {
      return <span key={i} dir="ltr" className="inline-block px-1 font-sans font-bold text-[#40E0D0]">{part}</span>;
    }
    return part;
  });
};

const PRESET_PACKAGES = [
  { id: 'pkg_core', name: 'CORE', display_title: 'CORE', price: '25', type: 'Core', details: ["۱ عدد تصویربرداری حضوری (سینمایی)", "۵ شات عکاسی 4K صنعتی", "۴ عدد ویدئو با AI", "سناریونویسی خلاقانه", "آنالیز رشد", "ادمینی و فروش"] },
  { id: 'pkg_fusion', name: 'FUSION', display_title: 'FUSION', price: '45', type: 'Fusion', details: ["۴ عدد تصویربرداری حضوری (FPV)", "۱۰ شات عکاسی 4K صنعتی", "ترکیب ویدیو با AI", "۸ عدد ویدئو با AI", "لوگو و هویت بصری", "مدیریت فروش"] },
  { id: 'pkg_quantum', name: 'QUANTUM', display_title: 'QUANTUM', price: '85', type: 'Quantum', details: ["۸ عدد تصویربرداری حضوری", "۲۰ شات عکاسی 4K سینمایی", "۱۲ عدد ویدئو با AI", "طراحی بیزنس‌پلن", "سفیر برند مجازی", "سئو استراتژیک"] },
  { id: 'pkg_tactical', name: 'TACTICAL', display_title: 'خدمات تکی', price: 'Variable', type: 'Tactical', details: ["انیمیشن اختصاصی", "مدیریت گوگل‌مپ", "فیلمبرداری تک جلسه", "عکاسی صنعتی", "طراحی سایت"] }
];

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [entered, setEntered] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [previewPackage, setPreviewPackage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [supabase, setSupabase] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', video_url: '', cover_url: '' });
  const [videoLoading, setVideoLoading] = useState(true);

  const bgMusic = useRef(new Audio(BG_MUSIC_URL));
  const greeting = useRef(new Audio(GREETING_URL));

  useEffect(() => {
    if (window.supabase) {
      setSupabase(window.supabase.createClient(supabaseUrl, supabaseKey));
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async = true;
      script.onload = () => setSupabase(window.supabase.createClient(supabaseUrl, supabaseKey));
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (supabase) {
      const fetchData = async () => {
        const { data } = await supabase.from('archives').select('*').order('order_index', { ascending: true });
        if (data) setPortfolio(data);
      };
      fetchData();
    }
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.35;
  }, [supabase]);

  const initializeProtocol = () => {
    setEntered(true);
    greeting.current.play();
    bgMusic.current.play();
  };

  const handleVideoOpen = (video) => {
    setActiveVideo(video);
    setVideoLoading(true);
    bgMusic.current.pause();
  };

  const handleVideoClose = () => {
    setActiveVideo(null);
    if (!isMuted) bgMusic.current.play();
  };

  const moveVideo = (index, direction) => {
    const newP = [...portfolio];
    if (direction === 'up' && index > 0) [newP[index], newP[index-1]] = [newP[index-1], newP[index]];
    else if (direction === 'down' && index < newP.length - 1) [newP[index], newP[index+1]] = [newP[index+1], newP[index]];
    setPortfolio(newP);
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("Delete Asset?")) return;
    setPortfolio(prev => prev.filter(v => v.id !== id));
    await supabase.from('archives').delete().eq('id', id);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-[#40E0D0]/30 pb-20 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face { font-family: 'Vazirmatn'; src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2') format('woff2'); }
        body { font-family: 'Vazirmatn', sans-serif; background-color: #050505; }
        
        /* 2026 Grainy Texture Overlay */
        body::before { content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; background: url(https://grainy-gradients.vercel.app/noise.svg); opacity: 0.05; z-index: 9999; }
        
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .breathing-core { animation: breathe 5s infinite ease-in-out; }
        @keyframes breathe { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 30px #40E0D033); } 50% { transform: scale(1.02); filter: drop-shadow(0 0 60px #40E0D066); } }
        
        /* Fluid Typography Fix */
        .hero-text { font-size: clamp(3rem, 15vw, 10rem); line-height: 0.9; }
        .section-title { font-size: clamp(2rem, 8vw, 5rem); }
        
        /* Hide Download Button in Chrome */
        video::-internal-media-controls-download-button { display:none; }
        video::-webkit-media-controls-enclosure { overflow:hidden; }
        video::-webkit-media-controls-panel { width: calc(100% + 30px); }
      `}} />

      {/* --- SPLASH SCREEN --- */}
      {!entered && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center">
          <h1 className="hero-text font-black breathing-core tracking-tighter text-white select-none italic mb-10">PROMPT</h1>
          <button onClick={initializeProtocol} className="group relative px-12 py-5 border border-[#40E0D0]/40 hover:border-[#40E0D0] transition-all overflow-hidden rounded-full">
            <span className="relative z-10 text-[#40E0D0] font-black tracking-[0.5em] text-[10px] uppercase group-hover:text-black">Enter Sovereign Vault</span>
            <div className="absolute inset-0 bg-[#40E0D0] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      )}

      {/* --- MAIN UI --- */}
      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Navigation */}
        <nav className="p-6 md:p-10 flex justify-between items-center fixed top-0 w-full z-[100] backdrop-blur-xl bg-black/40 border-b border-white/5">
           <div className="flex gap-4">
             <button onClick={() => setIsMuted(!isMuted)} className="p-3 glass rounded-full hover:bg-white/5 transition-all">
               {isMuted ? <VolumeX className="text-red-500" /> : <Volume2 className="text-[#40E0D0]" />}
             </button>
             <button onClick={() => setShowLoginModal(true)} className="p-3 glass rounded-full hover:text-[#40E0D0] transition-all">
               <Lock size={20}/>
             </button>
             {isAdmin && (
               <button onClick={async () => {
                 const updates = portfolio.map((item, index) => ({ ...item, order_index: index }));
                 await supabase.from('archives').upsert(updates);
                 alert("SYNCED");
               }} className="flex items-center gap-2 px-6 py-3 bg-[#40E0D0]/10 border border-[#40E0D0]/30 rounded-full text-[#40E0D0] hover:bg-[#40E0D0] hover:text-black transition-all">
                 <Save size={16}/> <span className="text-[10px] font-black uppercase tracking-widest">Update Vault</span>
               </button>
             )}
           </div>

           <div className="text-right">
             <div className="text-xl md:text-2xl font-black tracking-tighter">PROMPT</div>
             <div className="text-[7px] tracking-[0.4em] text-[#40E0D0] uppercase">Sovereign Authority</div>
           </div>
        </nav>

        <main className="max-w-[1600px] mx-auto px-6 py-40">
          <header className="text-center mb-64 relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-[#40E0D0]/5 blur-[120px] rounded-full" />
            <h1 className="hero-text font-black tracking-tighter uppercase select-none relative z-10">
              VISUAL <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] via-white to-[#40E0D0] bg-[length:200%_auto] animate-[shimmer_5s_linear_infinite]">SUPREMACY</span>
            </h1>
          </header>

          {/* Archives Section */}
          <section className="mb-80">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 border-b border-white/5 pb-10 gap-4">
               <h2 className="section-title font-black tracking-tight uppercase italic">Archives</h2>
               <p className="text-[#40E0D0] tracking-[0.5em] text-[10px] uppercase font-bold">Neural Cinematic Repository</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
              {portfolio.map((item, index) => (
                <div key={item.id} className="group relative aspect-[9/16] md:aspect-[3/4] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/5 bg-zinc-900/50 shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:border-[#40E0D0]/20">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => handleVideoOpen(item)}>
                    <img src={item.cover_url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-1000 grayscale group-hover:grayscale-0" alt=""/>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-black via-transparent">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#40E0D0]/40 flex items-center justify-center text-[#40E0D0] mb-6 glass group-hover:bg-[#40E0D0] group-hover:text-black transition-all duration-500 scale-90 group-hover:scale-110">
                        <Play size={24} fill="currentColor"/>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest drop-shadow-2xl">{item.title}</h3>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-6 right-6 p-4 flex flex-col gap-2 z-20 glass rounded-3xl">
                      <button onClick={() => moveVideo(index, 'up')} className="p-2 hover:text-[#40E0D0] transition-colors"><ArrowUp size={16}/></button>
                      <button onClick={() => moveVideo(index, 'down')} className="p-2 hover:text-[#40E0D0] transition-colors"><ArrowDown size={16}/></button>
                      <button onClick={() => deleteVideo(item.id)} className="p-2 text-red-500 hover:scale-125 transition-transform"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Proposals Section */}
          <section className="mb-80 relative">
             <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#40E0D0]/5 blur-[150px] rounded-full" />
             <div className="text-center mb-32">
               <h2 className="section-title font-black uppercase tracking-tighter mb-4">Proposals / خدمات</h2>
               <p className="text-zinc-500 tracking-[0.4em] uppercase text-[9px] font-bold">Elite Strategic Alliances</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {PRESET_PACKAGES.map(pkg => (
                  <div key={pkg.id} onClick={() => setPreviewPackage(pkg)} className={`p-10 rounded-[3rem] min-h-[550px] flex flex-col justify-between cursor-pointer border border-white/5 glass hover:bg-white/5 transition-all duration-500 ${pkg.type === 'Fusion' ? 'border-[#40E0D0]/40 bg-[#40E0D0]/5 scale-105 z-10' : ''}`}>
                      <div>
                        <div className={`mb-8 p-5 rounded-3xl inline-block ${pkg.type === 'Fusion' ? 'bg-[#40E0D0]/20 text-[#40E0D0]' : 'bg-white/5 text-zinc-400'}`}>
                          {pkg.type === 'Core' && <Cpu size={32}/>}
                          {pkg.type === 'Fusion' && <Atom size={32}/>}
                          {pkg.type === 'Quantum' && <Gem size={32} className="text-[#D4AF37]"/>}
                          {pkg.type === 'Tactical' && <Briefcase size={32}/>}
                        </div>
                        <h3 className="text-3xl font-black mb-3 tracking-tighter">{pkg.display_title}</h3>
                        <div className="text-4xl font-black text-[#40E0D0] tracking-tighter">
                          {pkg.price} <span className="text-[10px] text-white opacity-40 font-normal">M T / Sovereign</span>
                        </div>
                      </div>
                      <div className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">Protocol Specs <Plus size={14}/></div>
                  </div>
                ))}
             </div>
          </section>
        </main>

        <footer className="mt-64 border-t border-white/5 bg-[#030303] py-32 relative">
            <div className="max-w-[1600px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-16">
               <div className="flex flex-col items-center md:items-start gap-8 group">
                  <div className="p-8 rounded-[3.5rem] glass group-hover:border-[#40E0D0]/30 transition-all duration-1000">
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}&color=40E0D0&bgcolor=000&margin=4`} className="w-20 h-20 rounded-2xl opacity-60 group-hover:opacity-100 transition-all duration-700" alt="Sovereign QR" />
                  </div>
               </div>
               <div className="text-center md:text-right">
                  <h2 className="text-7xl md:text-[10rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800 select-none">REZIBEL</h2>
                  <div className="flex items-center justify-center md:justify-end gap-5 mt-10">
                     <div className="h-[1px] w-20 bg-[#40E0D0]/30 hidden md:block" />
                     <span className="text-[#40E0D0] text-[10px] font-black tracking-[0.4em] uppercase">Core Architect & Sovereign Director</span>
                  </div>
                  <p className="text-[8px] text-zinc-800 tracking-[0.5em] uppercase mt-20 font-bold">© 2026 Sovereign Authority | Visual Hegemony Reserved</p>
               </div>
            </div>
        </footer>
      </div>

      {/* --- ELITE MODALS (NO DOWNLOAD FIXED) --- */}
      {activeVideo && (
        <div className="fixed inset-0 z-[5000] bg-black/98 flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl" onContextMenu={(e) => e.preventDefault()}>
          <button onClick={handleVideoClose} className="absolute top-6 left-6 md:top-12 md:left-12 p-5 glass rounded-full hover:bg-white hover:text-black z-50 transition-all duration-500"><X size={32}/></button>
          <div className="w-full max-w-lg md:max-w-xl aspect-[9/16] rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-[#40E0D0]/20 shadow-[0_0_150px_rgba(64,224,208,0.1)] relative">
            {videoLoading && <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-10"><Loader2 className="animate-spin text-[#40E0D0]" size={48}/></div>}
            <video 
              controls 
              autoPlay 
              className="w-full h-full object-cover" 
              controlsList="nodownload" 
              onContextMenu={(e) => e.preventDefault()}
              poster={activeVideo.cover_url} 
              onLoadedData={() => setVideoLoading(false)}
            >
              <source src={activeVideo.video_url} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* Admin Verification Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[6000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="w-full max-w-md p-14 rounded-[4rem] border border-white/10 glass text-center">
            <Crown className="mx-auto text-[#40E0D0] mb-10 breathing-core" size={56}/>
            <h3 className="text-xl font-black mb-10 tracking-[0.4em] uppercase">Identity Verification</h3>
            <form onSubmit={(e) => { e.preventDefault(); if(loginForm.user === ADMIN_CREDENTIALS.user && loginForm.pass === ADMIN_CREDENTIALS.pass) { setIsAdmin(true); setShowLoginModal(false); } else alert("ACCESS DENIED BY SOVEREIGN SYSTEM"); }}>
              <input className="w-full bg-black/50 border border-white/10 p-5 rounded-3xl text-center mb-5 outline-none focus:border-[#40E0D0] transition-all" placeholder="ADMIN ID" value={loginForm.user} onChange={e=>setLoginForm({...loginForm, user:e.target.value})}/>
              <input className="w-full bg-black/50 border border-white/10 p-5 rounded-3xl text-center mb-8 outline-none focus:border-[#40E0D0] transition-all" type="password" placeholder="CRYPTO KEY" value={loginForm.pass} onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
              <button className="w-full py-5 bg-[#40E0D0] text-black font-black rounded-3xl uppercase tracking-widest text-xs hover:bg-white transition-all">Authorize Entry</button>
            </form>
          </div>
        </div>
      )}

      {/* Package Specs Modal */}
      {previewPackage && (
        <div className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-2xl" onClick={() => setPreviewPackage(null)}>
           <div className="max-w-4xl w-full p-14 glass rounded-[4rem] text-right border border-[#40E0D0]/20 max-h-[85vh] overflow-y-auto relative" onClick={e=>e.stopPropagation()}>
             <h2 className="text-5xl md:text-7xl font-black mb-14 text-white tracking-tighter uppercase italic">{previewPackage.display_title}</h2>
             <div className="space-y-6" dir="rtl">
               {previewPackage.details.map((d,i) => (
                 <div key={i} className="flex items-center gap-5 text-xl md:text-2xl text-zinc-300 border-b border-white/5 pb-6 hover:text-[#40E0D0] transition-colors">
                   <CheckCircle2 className="text-[#40E0D0]" size={24}/> {formatPersianText(d)}
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
