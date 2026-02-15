import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Trash2, X, Lock, LogOut, Crown, Hexagon, Star, 
  RefreshCw, Cpu, Atom, Gem, Briefcase, Plus, CheckCircle2, ShieldCheck, 
  MousePointer2, ArrowUp, ArrowDown, Save, QrCode, Image as ImageIcon, 
  MessageSquare, Target, Wand2, Sparkles, Bot, Zap, Loader2, Volume2, VolumeX
} from 'lucide-react';

// --- CONFIG & CREDENTIALS ---
const supabaseUrl = 'https://bibgekufrjfokauiksca.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpYmdla3Vmcmpmb2thdWlrc2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODM4MDYsImV4cCI6MjA4NjY1OTgwNn0.VcBiqjnYS4adCa-mzp00Z-Ki3keWECi9qea3iYJk_Yw';
const ADMIN_CREDENTIALS = { user: "RezibelRr845", pass: "RezaRezibel13845" };

// --- AUDIO ASSETS ---
const GREETING_URL = "https://bibgekufrjfokauiksca.supabase.co/storage/v1/object/public/audio/ElevenLabs_2026-02-15T18_14_14_Donovan%20-%20Articulate,%20Strong%20and%20Deep_pvc_sp100_s50_sb75_v3.mp3"; 
const BG_MUSIC_URL = "https://bibgekufrjfokauiksca.supabase.co/storage/v1/object/public/audio/starostin-ambient-ambient-music-484374.mp3";

// --- HELPERS ---
const formatPersianText = (text) => {
  if (!text) return "";
  const parts = text.split(/(\d+(?:[\.\-\/]\d+)?(?:\s*[xX]|\s*K|\s*s|\s*م)?|AI|FPV|T|M|4K|Sales|Admin|SEO)/g);
  return parts.map((part, i) => {
    if (/(\d+(?:[\.\-\/]\d+)?(?:\s*[xX]|\s*K|\s*s|\s*م)?|AI|FPV|T|M|4K|Sales|Admin|SEO)/g.test(part)) {
      return <span key={i} dir="ltr" className="inline-block px-1 font-sans font-bold text-[#40E0D0]">{part}</span>;
    }
    return part;
  });
};

const PRESET_PACKAGES = [
  { id: 'pkg_core', name: 'CORE', display_title: 'CORE', price: '25', type: 'Core', details: ["۱ عدد تصویربرداری حضوری (سینمایی)", "۵ شات عکاسی 4K صنعتی", "۴ عدد ویدئو با AI", "سناریونویسی خلاقانه", "آنالیز و گزارش رشد", "ادمینی و فروش"] },
  { id: 'pkg_fusion', name: 'FUSION', display_title: 'FUSION', price: '45', type: 'Fusion', details: ["۴ عدد تصویربرداری حضوری (شامل FPV)", "۱۰ شات عکاسی 4K صنعتی", "ترکیب حرفه‌ای ویدیو با AI", "۸ عدد ویدئو با AI", "لوگو و لوگوموشن", "مدیریت کامل ادمینی و فروش"] },
  { id: 'pkg_quantum', name: 'QUANTUM', display_title: 'QUANTUM', price: '85', type: 'Quantum', details: ["۸ عدد تصویربرداری حضوری (شامل FPV)", "۲۰ شات عکاسی 4K سینمایی", "۱۲ عدد ویدئو با AI", "طراحی بیزنس‌پلن اختصاصی", "سفیر برند مجازی", "مدیریت استراتژیک فروش و سئو"] },
  { id: 'pkg_tactical', name: 'TACTICAL', display_title: 'خدمات تکی', price: 'Variable', type: 'Tactical', details: ["تولید انیمیشن اختصاصی", "مدیریت تخصصی گوگل‌مپ", "پکیج فیلمبرداری تک جلسه", "عکاسی صنعتی", "طراحی و پشتیبانی سایت"] }
];

const NEURAL_MODULES = [
  { id: 'visual_engine', title: 'Visual Engine', fa_title: 'موتور تصویرسازی', limit: 5, icon: <ImageIcon size={24}/>, desc: 'توصیف صحنه را بنویسید تا هوش مصنوعی آن را به تصویر تبدیل کند.', type: 'image' },
  { id: 'quantum_script', title: 'Quantum Script', fa_title: 'سناریو نویس', limit: 3, icon: <MessageSquare size={24}/>, desc: 'موضوع محصول را بنویسید تا سناریوی ویروسی دریافت کنید.', type: 'text' },
  { id: 'oracle', title: 'Oracle Strategy', fa_title: 'مشاور استراتژیک', limit: 5, icon: <Target size={24}/>, desc: 'سوالات خود درباره رشد پیج و فروش را بپرسید.', type: 'text' },
  { id: 'nexus', title: 'Nexus Protocol', fa_title: 'نگارش رسمی', limit: 10, icon: <Wand2 size={24}/>, desc: 'متن ساده را به متن اداری و با پرستیژ تبدیل می‌کند.', type: 'text' }
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
  const [videoLoading, setVideoLoading] = useState(true);

  // Audio Configuration
  const bgMusic = useRef(new Audio(BG_MUSIC_URL));
  const greeting = useRef(new Audio(GREETING_URL));

  // Initialize Supabase and Audio Properties
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
    // Setup Audio
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.35;
  }, []);

  // Fetch Archives
  useEffect(() => {
    if (supabase) {
      const fetchData = async () => {
        const { data } = await supabase.from('archives').select('*').order('order_index', { ascending: true });
        if (data) setPortfolio(data);
      };
      fetchData();
    }
  }, [supabase]);

  // Actions
  const initializeProtocol = () => {
    setEntered(true);
    greeting.current.play().catch(e => console.error("Greeting Playback Failed:", e));
    bgMusic.current.play().catch(e => console.error("Music Playback Failed:", e));
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    nextMute ? bgMusic.current.pause() : bgMusic.current.play();
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
    if (!window.confirm("PERMANENTLY remove this video?")) return;
    setPortfolio(prev => prev.filter(v => v.id !== id));
    await supabase.from('archives').delete().eq('id', id);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-x-hidden font-sans selection:bg-[#40E0D0]/30 pb-20">
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face { font-family: 'Vazirmatn'; src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2') format('woff2'); }
        body { font-family: 'Vazirmatn', sans-serif; }
        .breathing-core { animation: breathe 4s infinite ease-in-out; }
        @keyframes breathe { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px #40E0D044); } 50% { transform: scale(1.03); filter: drop-shadow(0 0 50px #40E0D088); } }
        .shimmer-text { background: linear-gradient(90deg, #fff 0%, #40E0D0 50%, #fff 100%); background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s infinite linear; }
        @keyframes shimmer { to { background-position: 200%; } }
      `}} />

      {/* --- SPLASH SCREEN --- */}
      {!entered && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-[18vw] md:text-[15rem] font-black breathing-core tracking-tighter text-white leading-none mb-10 select-none uppercase">PROMPT</h1>
          <button 
            onClick={initializeProtocol} 
            className="group relative px-10 py-5 border border-[#40E0D0]/50 hover:border-[#40E0D0] transition-all overflow-hidden"
          >
            <span className="relative z-10 text-[#40E0D0] font-black tracking-[0.5em] text-xs uppercase group-hover:text-black">INITIALIZE PROTOCOL</span>
            <div className="absolute inset-0 bg-[#40E0D0] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* --- MAIN UI --- */}
      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Navbar */}
        <nav className="p-8 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-[100] bg-black/80">
           <div className="flex gap-4">
             <button onClick={toggleMute} className="p-3 border border-white/10 rounded-full hover:bg-white/10 transition-all">
               {isMuted ? <VolumeX className="text-red-500" /> : <Volume2 className="text-[#40E0D0]" />}
             </button>
             {isAdmin ? (
               <button onClick={() => setIsAdmin(false)} className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-full text-red-500"><LogOut size={16}/></button>
             ) : (
               <button onClick={() => setShowLoginModal(true)} className="p-3 border border-white/10 rounded-full hover:text-[#40E0D0]"><Lock size={20}/></button>
             )}
             {isAdmin && (
               <button className="flex items-center gap-2 px-6 py-3 bg-[#40E0D0]/10 border border-[#40E0D0]/30 rounded-full text-[#40E0D0] hover:bg-[#40E0D0] hover:text-black"><Save size={16}/></button>
             )}
           </div>

           <div className="text-right">
             <div className="text-2xl font-black tracking-tighter">PROMPT</div>
             <div className="text-[8px] tracking-[0.4em] text-[#40E0D0] uppercase">Sovereign Authority</div>
           </div>
        </nav>

        <main className="max-w-[1800px] mx-auto px-6 py-24">
          <header className="text-center mb-40">
            <h1 className="text-8xl md:text-[12rem] font-black leading-none mb-8 tracking-tighter uppercase select-none">
              VISUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-white">SUPREMACY</span>
            </h1>
          </header>

          {/* Archives Section */}
          <section className="mb-64">
            <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-8">
               <h2 className="text-6xl font-black tracking-tight uppercase">Archives</h2>
               <p className="text-[#40E0D0] tracking-widest text-sm uppercase">Cinematic Vault</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {portfolio.map((item, index) => (
                <div key={item.id} className="group relative aspect-[9/16] rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => handleVideoOpen(item)}>
                    <img src={item.cover_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" alt=""/>
                    <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black via-transparent">
                      <div className="w-16 h-16 rounded-full border border-[#40E0D0] flex items-center justify-center text-[#40E0D0] mb-6 backdrop-blur-md group-hover:bg-[#40E0D0] group-hover:text-black transition-all"><Play size={24} fill="currentColor"/></div>
                      <h3 className="text-2xl font-black uppercase tracking-widest">{item.title}</h3>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-6 right-6 p-4 flex flex-col gap-2 z-20 bg-black/50 backdrop-blur-sm rounded-3xl border border-white/10">
                      <button onClick={() => moveVideo(index, 'up')} className="p-2 hover:text-[#40E0D0]"><ArrowUp size={16}/></button>
                      <button onClick={() => moveVideo(index, 'down')} className="p-2 hover:text-[#40E0D0]"><ArrowDown size={16}/></button>
                      <button onClick={() => deleteVideo(item.id)} className="p-2 text-red-500 hover:scale-110"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Proposals Section */}
          <section className="mb-64">
             <div className="text-center mb-24">
               <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">PROPOSALS / خدمات</h2>
               <p className="text-zinc-500 tracking-[0.3em] uppercase">لیست پکیج های همکاری</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {PRESET_PACKAGES.map(pkg => (
                  <div key={pkg.id} onClick={() => setPreviewPackage(pkg)} className={`p-10 rounded-[3rem] min-h-[500px] flex flex-col justify-between cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 transition-all ${pkg.type === 'Fusion' ? 'border-[#40E0D0] bg-[#40E0D0]/5 scale-105 z-10' : ''}`}>
                      <div>
                        <div className={`mb-6 p-4 rounded-2xl inline-block ${pkg.type === 'Fusion' ? 'bg-[#40E0D0]/10 text-[#40E0D0]' : 'bg-white/5 text-zinc-400'}`}>
                          {pkg.type === 'Core' && <Cpu size={32}/>}
                          {pkg.type === 'Fusion' && <Atom size={32}/>}
                          {pkg.type === 'Quantum' && <Gem size={32} className="text-[#D4AF37]"/>}
                          {pkg.type === 'Tactical' && <Briefcase size={32}/>}
                        </div>
                        <h3 className="text-4xl font-black mb-2 uppercase">{pkg.display_title}</h3>
                        <div className="text-3xl font-black text-[#40E0D0]">{pkg.price} <span className="text-xs text-white opacity-50">M T</span></div>
                      </div>
                      <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-50">View Details <Plus size={14}/></div>
                  </div>
                ))}
             </div>
          </section>

          {/* Neural Grid Section */}
          <section className="mb-64">
            <div className="text-center mb-24">
               <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#40E0D0]/10 text-[#40E0D0] border border-[#40E0D0]/30 animate-pulse"><Bot size={16}/> <span>NEURAL CORE ACTIVE</span></div>
               <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">NEURAL GRID</h2>
               <p className="text-zinc-500 tracking-[0.3em] uppercase">ابزارهای هوشمند تولید محتوا</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {NEURAL_MODULES.map((module) => (
                <div key={module.id} className="p-8 rounded-[3rem] border border-white/10 hover:border-[#40E0D0]/50 transition-all flex flex-col h-[500px] bg-white/5">
                  <div className="mt-8 mb-4 text-[#40E0D0] bg-white/5 p-4 rounded-2xl w-fit">{module.icon}</div>
                  <h3 className="text-2xl font-black text-white uppercase">{module.title}</h3>
                  <p className="text-sm text-[#40E0D0] mb-4 font-[Vazirmatn]">{module.fa_title}</p>
                  <p className="text-xs text-zinc-400 leading-loose mb-6 font-[Vazirmatn]">{module.desc}</p>
                  <div className="mt-auto flex flex-col gap-4">
                    <textarea className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-right text-xs text-white outline-none focus:border-[#40E0D0] resize-none h-20" placeholder="متن خود را وارد کنید..."/>
                    <button className="w-full py-4 bg-white text-black font-black text-[10px] tracking-[0.2em] rounded-xl hover:bg-[#40E0D0] transition-all uppercase">Execute Protocol</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-40 border-t border-white/5 bg-black py-24 relative overflow-hidden text-center md:text-right">
            <div className="max-w-[1800px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-12">
               <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}&color=40E0D0&bgcolor=000&margin=2`} className="w-24 h-24 rounded-2xl opacity-80" alt="Site QR" />
               </div>
               <div>
                  <h2 className="text-7xl md:text-9xl font-black shimmer-text leading-none tracking-tighter select-none">REZIBEL</h2>
                  <p className="text-[#40E0D0] text-xs font-black tracking-[0.3em] uppercase mt-6">Core Architect & Director</p>
                  <p className="text-[9px] text-zinc-700 tracking-[0.4em] uppercase mt-12">© 2026 Sovereign Authority | All Rights Reserved</p>
               </div>
            </div>
        </footer>
      </div>

      {/* --- MODALS --- */}
      {activeVideo && (
        <div className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-3xl">
          <button onClick={handleVideoClose} className="absolute top-8 left-8 p-4 bg-white/10 rounded-full hover:bg-white hover:text-black z-50 transition-all"><X size={32}/></button>
          <div className="w-full max-w-lg aspect-[9/16] rounded-[3rem] overflow-hidden border border-[#40E0D0]/20 relative">
            {videoLoading && <div className="absolute inset-0 flex items-center justify-center bg-zinc-900"><Loader2 className="animate-spin text-[#40E0D0]" size={48}/></div>}
            <video controls autoPlay className="w-full h-full object-cover" poster={activeVideo.cover_url} onLoadedData={() => setVideoLoading(false)}>
              <source src={activeVideo.video_url} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[6000] bg-black/98 flex items-center justify-center p-6">
          <div className="w-full max-w-md p-12 rounded-[3rem] border border-white/10 bg-zinc-900 text-center">
            <Crown className="mx-auto text-[#40E0D0] mb-8" size={48}/>
            <form onSubmit={(e) => { e.preventDefault(); if(loginForm.user === ADMIN_CREDENTIALS.user && loginForm.pass === ADMIN_CREDENTIALS.pass) { setIsAdmin(true); setShowLoginModal(false); } else alert("DENIED"); }}>
              <input className="w-full bg-black border border-white/10 p-4 rounded-2xl text-center mb-4 outline-none focus:border-[#40E0D0]" placeholder="ID" value={loginForm.user} onChange={e=>setLoginForm({...loginForm, user:e.target.value})}/>
              <input className="w-full bg-black border border-white/10 p-4 rounded-2xl text-center mb-6 outline-none focus:border-[#40E0D0]" type="password" placeholder="KEY" value={loginForm.pass} onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
              <button className="w-full py-4 bg-[#40E0D0] text-black font-black rounded-2xl uppercase tracking-widest text-xs">Authorize</button>
            </form>
          </div>
        </div>
      )}

      {previewPackage && (
        <div className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl" onClick={() => setPreviewPackage(null)}>
           <div className="max-w-4xl w-full p-12 bg-zinc-900 rounded-[3rem] text-right border border-[#40E0D0]/20 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
             <h2 className="text-6xl font-black mb-12 text-white uppercase">{previewPackage.display_title}</h2>
             <div className="space-y-4" dir="rtl">
               {previewPackage.details.map((d,i) => (
                 <div key={i} className="flex items-center gap-4 text-xl text-zinc-300 border-b border-white/5 pb-4"><CheckCircle2 className="text-[#40E0D0]" size={20}/> {formatPersianText(d)}</div>
               ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
