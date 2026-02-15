import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Trash2, X, Lock, LogOut, Crown, RefreshCw, Cpu, Atom, Gem, Briefcase, 
  Plus, CheckCircle2, ArrowUp, ArrowDown, Save, QrCode, Image as ImageIcon, 
  MessageSquare, Target, Wand2, Bot, Zap, Loader2, Volume2, VolumeX, ChevronRight, ChevronLeft, MousePointer2
} from 'lucide-react';

// --- CONFIG ---
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
  { id: 'pkg_quantum', name: 'QUANTUM', display_title: 'QUANTUM', price: '85', type: 'Quantum', details: ["۸ عدد تصویربرداری حضوری", "۲۰ شات عکاسی 4K سینمایی", "۱۲ عدد ویدئو با AI", "طراحی بیزنس‌پلن اختصاصی", "سفیر برند مجازی", "سئو استراتژیک"] },
  { id: 'pkg_tactical', name: 'TACTICAL', display_title: 'خدمات تکی', price: 'Variable', type: 'Tactical', details: ["تولید انیمیشن اختصاصی", "مدیریت تخصصی گوگل‌مپ", "فیلمبرداری تک جلسه", "عکاسی صنعتی", "طراحی و پشتیبانی سایت"] }
];

const NEURAL_MODULES = [
  { id: 'visual_engine', title: 'Visual Engine', fa_title: 'موتور تصویرسازی', limit: 5, icon: <ImageIcon size={24}/>, desc: 'توصیف صحنه را بنویسید تا هوش مصنوعی آن را به تصویر تبدیل کند.', type: 'image' },
  { id: 'quantum_script', title: 'Quantum Script', fa_title: 'سناریو نویس', limit: 3, icon: <MessageSquare size={24}/>, desc: 'موضوع محصول را بنویسید تا سناریوی ویروسی دریافت کنید.', type: 'text' },
  { id: 'oracle', title: 'Oracle Strategy', fa_title: 'مشاور استراتژیک', limit: 5, icon: <Target size={24}/>, desc: 'سوالات خود درباره رشد پیج را بپرسید.', type: 'text' },
  { id: 'nexus', title: 'Nexus Protocol', fa_title: 'نگارش رسمی', limit: 10, icon: <Wand2 size={24}/>, desc: 'تبدیل متن به اداری و با پرستیژ.', type: 'text' }
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

  const bgMusic = useRef(new Audio(BG_MUSIC_URL));
  const greeting = useRef(new Audio(GREETING_URL));
  const scrollRef = useRef(null);

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
    greeting.current.play().catch(e => console.log(e));
    bgMusic.current.play().catch(e => console.log(e));
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
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

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-x-hidden font-sans selection:bg-[#40E0D0]/30 pb-20 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face { font-family: 'Vazirmatn'; src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2') format('woff2'); }
        body { font-family: 'Vazirmatn', sans-serif; background: #020202; }
        .halo-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }
        .halo-1 { position: absolute; top: -10%; left: -10%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(192,192,192,0.06) 0%, transparent 70%); animation: drift 20s infinite alternate; }
        .halo-2 { position: absolute; bottom: -10%; right: -10%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(64,224,208,0.04) 0%, transparent 70%); animation: drift 25s infinite alternate-reverse; }
        @keyframes drift { from { transform: translate(0,0) scale(1); } to { transform: translate(10%, 10%) scale(1.1); } }
        .glass-luxury { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .responsive-title { font-size: clamp(2.5rem, 13vw, 11rem); line-height: 0.9; }
        video::-internal-media-controls-download-button { display:none; }
        video::-webkit-media-controls-enclosure { overflow:hidden; }
        video::-webkit-media-controls-panel { width: calc(100% + 30px); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="halo-bg">
        <div className="halo-1" /><div className="halo-2" />
      </div>

      {!entered && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center cursor-pointer" onClick={initializeProtocol}>
          <h1 className="responsive-title font-black tracking-tighter text-white select-none italic mb-12 animate-pulse uppercase">PROMPT</h1>
          <div className="flex items-center gap-4 text-zinc-500 text-[10px] tracking-[0.5em] uppercase">
            <MousePointer2 size={16}/> <span>Initialize Protocol</span>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        <nav className="p-6 md:p-10 flex justify-between items-center fixed top-0 w-full z-[100] backdrop-blur-3xl bg-black/30 border-b border-white/5">
           <div className="flex gap-4">
             <button onClick={() => setIsMuted(!isMuted)} className="p-3 glass-luxury rounded-full">{isMuted ? <VolumeX className="text-red-500" /> : <Volume2 className="text-[#40E0D0]" />}</button>
             <button onClick={() => setShowLoginModal(true)} className="p-3 glass-luxury rounded-full hover:text-[#40E0D0]"><Lock size={20}/></button>
           </div>
           <div className="text-right"><div className="text-xl md:text-2xl font-black tracking-tighter">PROMPT</div><div className="text-[7px] tracking-[0.4em] text-[#40E0D0] uppercase italic">Sovereign Authority</div></div>
        </nav>

        <main className="max-w-[1900px] mx-auto px-6 py-40">
          <header className="text-center mb-64">
            <h1 className="responsive-title font-black tracking-tighter uppercase select-none italic">VISUAL <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] via-white to-[#40E0D0] bg-[length:200%_auto] animate-[shimmer_5s_linear_infinite]">SUPREMACY</span></h1>
          </header>

          <section className="mb-80 relative group">
            <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-10">
               <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic">Archives</h2>
               <p className="text-[#40E0D0] tracking-[0.4em] text-[10px] uppercase font-bold">Neural Cinematic Repository</p>
            </div>
            
            {/* Horizontal Nav Arrows - LUXURY DESIGN */}
            <div className="absolute top-1/2 -left-4 z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
              <button onClick={() => scroll('left')} className="p-6 glass-luxury rounded-full text-[#40E0D0] hover:bg-[#40E0D0] hover:text-black transition-all shadow-2xl shadow-cyan-500/20"><ChevronLeft size={32}/></button>
            </div>
            <div className="absolute top-1/2 -right-4 z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
              <button onClick={() => scroll('right')} className="p-6 glass-luxury rounded-full text-[#40E0D0] hover:bg-[#40E0D0] hover:text-black transition-all shadow-2xl shadow-cyan-500/20"><ChevronRight size={32}/></button>
            </div>

            <div ref={scrollRef} className="flex gap-10 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10 px-4">
              {portfolio.map((item) => (
                <div key={item.id} className="min-w-[85vw] md:min-w-[450px] aspect-[9/16] md:aspect-[3/4] rounded-[4rem] overflow-hidden border border-white/5 glass-luxury snap-center transition-all duration-700 hover:scale-[1.02] hover:border-[#40E0D0]/30 relative group/card shadow-2xl">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => handleVideoOpen(item)}>
                    <img src={item.cover_url} className="w-full h-full object-cover opacity-50 group-hover/card:opacity-100 transition-all duration-1000 grayscale group-hover/card:grayscale-0" alt=""/>
                    <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black/90 via-transparent">
                      <div className="w-16 h-16 rounded-full border border-[#40E0D0]/40 flex items-center justify-center text-[#40E0D0] mb-6 backdrop-blur-xl group-hover/card:bg-[#40E0D0] group-hover/card:text-black transition-all"><Play size={24} fill="currentColor"/></div>
                      <h3 className="text-3xl font-black uppercase tracking-widest">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile Swipe Indicator */}
            <div className="md:hidden text-center mt-4 text-[#40E0D0]/40 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2 animate-pulse"><ChevronLeft size={12}/> Swipe to Explore <ChevronRight size={12}/></div>
          </section>

          <section className="mb-80">
             <div className="text-center mb-32"><h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">Proposals</h2><p className="text-zinc-500 tracking-[0.4em] uppercase text-[9px] font-bold italic">Strategic Alliance Packages</p></div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {PRESET_PACKAGES.map(pkg => (
                  <div key={pkg.id} onClick={() => setPreviewPackage(pkg)} className={`p-10 rounded-[3.5rem] min-h-[550px] flex flex-col justify-between cursor-pointer border border-white/5 glass-luxury hover:bg-white/5 transition-all duration-500 ${pkg.type === 'Fusion' ? 'border-[#40E0D0]/40 scale-105 z-10 bg-[#40E0D0]/5 shadow-2xl shadow-cyan-500/10' : ''}`}>
                      <div>
                        <div className={`mb-8 p-5 rounded-3xl inline-block ${pkg.type === 'Fusion' ? 'bg-[#40E0D0]/10 text-[#40E0D0]' : 'bg-white/5 text-zinc-400'}`}>{pkg.type === 'Core' && <Cpu size={32}/>}{pkg.type === 'Fusion' && <Atom size={32}/>}{pkg.type === 'Quantum' && <Gem size={32} className="text-[#D4AF37]"/>}{pkg.type === 'Tactical' && <Briefcase size={32}/>}</div>
                        <h3 className="text-4xl font-black mb-3">{pkg.display_title}</h3>
                        <div className={`text-3xl font-black ${pkg.type === 'Quantum' ? 'text-[#D4AF37]' : 'text-[#40E0D0]'}`}>{pkg.price} <span className="text-[10px] text-white opacity-40 uppercase">M T</span></div>
                      </div>
                      <div className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">Protocol Specs <Plus size={14}/></div>
                  </div>
                ))}
             </div>
          </section>

          <section className="mb-64">
            <div className="text-center mb-24"><div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#40E0D0]/10 text-[#40E0D0] border border-[#40E0D0]/30 animate-pulse"><Bot size={16}/> <span>NEURAL CORE ACTIVE</span></div><h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic">Neural Grid</h2><p className="text-zinc-500 tracking-[0.3em] uppercase text-[9px] font-bold italic">Intelligence Modules</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {NEURAL_MODULES.map((module) => (
                <div key={module.id} className="p-8 rounded-[3.5rem] border border-white/5 glass-luxury hover:border-[#40E0D0]/50 transition-all flex flex-col h-[550px] relative overflow-hidden group shadow-xl hover:shadow-cyan-500/10">
                  <div className="mt-8 mb-6 text-[#40E0D0] bg-white/5 p-5 rounded-3xl w-fit group-hover:scale-110 transition-transform">{module.icon}</div>
                  <h3 className="text-2xl font-black text-white uppercase">{module.title}</h3>
                  <p className="text-sm text-[#40E0D0] mb-4 font-[Vazirmatn]">{module.fa_title}</p>
                  <p className="text-xs text-zinc-400 leading-loose mb-10 font-[Vazirmatn]">{module.desc}</p>
                  <div className="mt-auto flex flex-col gap-4">
                    <textarea className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-right text-xs text-white outline-none focus:border-[#40E0D0] h-24 resize-none" placeholder="متن خود را وارد کنید..."/>
                    <button className="w-full py-4 bg-white text-black font-black text-[10px] tracking-[0.3em] rounded-2xl hover:bg-[#40E0D0] transition-all uppercase">Execute Protocol</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-64 border-t border-white/5 bg-black py-32 text-center md:text-right relative overflow-hidden">
            <div className="max-w-[1900px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-20">
               <div className="p-8 rounded-[3.5rem] glass-luxury border border-[#40E0D0]/20 group transition-all duration-700 hover:border-[#40E0D0]"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}&color=40E0D0&bgcolor=000&margin=2`} className="w-24 h-24 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity" alt="Sovereign QR" /></div>
               <div><h2 className="text-8xl md:text-[12rem] font-black leading-none tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800 select-none">REZIBEL</h2><p className="text-[#40E0D0] text-xs font-black tracking-[0.5em] uppercase mt-10 italic">Core Architect & Sovereign Director</p><p className="text-[8px] text-zinc-800 tracking-[0.6em] uppercase mt-20 font-bold">© 2026 Sovereign Authority | Visual Hegemony Reserved</p></div>
            </div>
        </footer>
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-[5000] bg-black/98 flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl" onContextMenu={(e) => e.preventDefault()}>
          <button onClick={handleVideoClose} className="absolute top-8 left-8 p-5 glass-luxury rounded-full hover:bg-white hover:text-black z-50 transition-all duration-500 shadow-2xl"><X size={32}/></button>
          <div className="w-full max-w-lg aspect-[9/16] rounded-[4rem] overflow-hidden border border-[#40E0D0]/20 shadow-[0_0_150px_rgba(64,224,208,0.15)] relative">
            {videoLoading && <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10"><Loader2 className="animate-spin text-[#40E0D0]" size={48}/></div>}
            <video controls autoPlay className="w-full h-full object-cover" controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} poster={activeVideo.cover_url} onLoadedData={() => setVideoLoading(false)}><source src={activeVideo.video_url} type="video/mp4" /></video>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[6000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="w-full max-w-md p-14 rounded-[4rem] glass-luxury text-center shadow-2xl border-[#40E0D0]/10">
            <Crown className="mx-auto text-[#40E0D0] mb-10 animate-bounce" size={56}/>
            <form onSubmit={(e) => { e.preventDefault(); if(loginForm.user === ADMIN_CREDENTIALS.user && loginForm.pass === ADMIN_CREDENTIALS.pass) { setIsAdmin(true); setShowLoginModal(false); } else alert("DENIED"); }}>
              <input className="w-full bg-black/50 border border-white/10 p-5 rounded-3xl text-center mb-5 outline-none focus:border-[#40E0D0] transition-all" placeholder="ADMIN ID" value={loginForm.user} onChange={e=>setLoginForm({...loginForm, user:e.target.value})}/><input className="w-full bg-black/50 border border-white/10 p-5 rounded-3xl text-center mb-8 outline-none focus:border-[#40E0D0] transition-all" type="password" placeholder="KEY" value={loginForm.pass} onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/><button className="w-full py-5 bg-[#40E0D0] text-black font-black rounded-3xl uppercase tracking-widest text-xs hover:bg-white transition-all duration-500">Authorize Entry</button>
            </form>
          </div>
        </div>
      )}

      {previewPackage && (
        <div className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl" onClick={() => setPreviewPackage(null)}>
           <div className="max-w-4xl w-full p-14 glass-luxury rounded-[4rem] text-right border border-[#40E0D0]/20 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
             <h2 className="text-5xl md:text-7xl font-black mb-14 text-white tracking-tighter italic uppercase">{previewPackage.display_title}</h2>
             <div className="space-y-6" dir="rtl">{previewPackage.details.map((d,i) => (<div key={i} className="flex items-center gap-5 text-xl md:text-2xl text-zinc-300 border-b border-white/5 pb-6 hover:text-[#40E0D0] transition-colors"><CheckCircle2 className="text-[#40E0D0]" size={24}/> {formatPersianText(d)}</div>))}</div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
