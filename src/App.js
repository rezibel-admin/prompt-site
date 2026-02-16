import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Trash2, X, Lock, LogOut, Crown, RefreshCw, Cpu, Atom, Gem, Briefcase, 
  Plus, CheckCircle2, ArrowUp, ArrowDown, Save, QrCode, Image as ImageIcon, 
  MessageSquare, Target, Wand2, Bot, Zap, Loader2, Volume2, VolumeX, ChevronRight, ChevronLeft, MousePointer2, Send
} from 'lucide-react';

// --- CONFIG & CREDENTIALS ---
const supabaseUrl = 'https://bibgekufrjfokauiksca.supabase.co';
const supabaseKey = 'sb_publishable_7VSrrcDIUHhZaRgUPsEwkw_jfLxxVdc';
const ADMIN_CREDENTIALS = { user: "RezibelRr845", pass: "RezaRezibel13845" };
const GEMINI_API_KEY = ""; // کلید خود را اینجا قرار دهید

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
  { id: 'pkg_core', name: 'CORE', slogan: 'مهندسی حضورِ استاندارد برای برندهایی که اشتباه در شروع را نمی‌پذیرند.', price: '25', type: 'Core', details: ["خلق اثر شاخص سینمایی: تدوین خروجی بصری با استانداردهای نوری پیشرفته بین‌المللی.","۵ فریم عکاسی تراز اول 4K (همراه با تجهیزات تخصصی نورپردازی و لنز ماکرو!)","۴ اپیزود سنتز هوشمند بصری: بهره‌گیری از AI برای خلق ۱ انیمیشن مفهومی.","تلفیق ساختاری: ترکیب ویدیوهای رئال با لایه‌های بصری هوش مصنوعی.","معماری سناریو: تدوین استراتژیک سناریوهای روانشناختی.","مدیریت چرخه فروش: هدایت هوشمندانه مخاطب در مسیر خرید.","هویت‌بخشی بصری: معماری ویترین پیج و طراحی تمپلیت‌های اختصاصی."] },
  { id: 'pkg_fusion', name: 'FUSION', slogan: 'هم‌افزایی استراتژیک: نقطه تلاقی حاکمیتِ بصری و پردازش الگوریتمیک برای تسلطِ بی‌قید و شرط بر بازار.', price: '45', type: 'Fusion', details: ["۴ خروجیِ ویدئوییِ شاخص: مهندسی ۴ ویدئوی حرفه‌ای (شامل FPV).","۱۰ فریم عکاسی صنعتی/تبلیغاتی: ایجاد یک آرشیو بصریِ غنی و خیره‌کننده.","۸ محتوای سنتز شده: ۳ اپیزود انیمیشن سریالی + ۵ ویدئوی تبلیغاتی.","امضای بصوی پویا: طراحی لوگوموشنی که هویت برند را حک می‌کند.","پروتکل سئو بصری: مهندسی کپشن و بهینه‌سازی تصاویر برای اکسپلور.","مدیریت کامل ادمینی و فروش: واگذاری چرخه جذب به تیم متخصص."] },
  { id: 'pkg_quantum', name: 'QUANTUM', slogan: 'حاکمیت ابدی در فضای دیجیتال؛ پکیجی برای رهبرانی که به چیزی جز «نفر اول بودن» قانع نیستند.', price: '85', type: 'Quantum', details: ["۸ اپیزود تولید محتوای سینمایی: شامل ۲ محتوای ویژه FPV.","۲۰ فریم عکاسی اشرافی: نمایش شکوه بیزنس با دقتی میکروسکوپی.","۱۲ شاهکار سنتز هوشمند: ۴ اپیزود انیمیشن سینمایی + ۸ ویدئوی هدفمند.","مهندسی بیزنس‌پلان اختصاصی: تدوین استراتژی‌های کلان تبدیل بیننده به سرمایه.","خلق سفیر مجازی برند: طراحی شخصیت دیجیتال اختصاصی (Virtual Influencer).","حاکمیت بر اکسپلور: مهندسی محتوا با هدف ورود حداکثری."] },
  { id: 'pkg_tactical', name: 'TACTICAL', slogan: 'ابزارهای هدفمند برای تقویت جبهه‌های خاص کسب‌وکار.', price: 'Variable', type: 'Tactical', details: ["واحد انیمیشن‌سازی اختصاصی: ساخت دنیایی بدون محدودیت‌های فیزیکی.","اقتدار محلی (Google Map SEO): تثبیت جایگاه در ۳ لینک اول گوگل.","تک-اپیزود ریلز: اعزام تیمِ ضربت بصری برای خلق محتوای وایرال.","فریم‌های 4K پرستیژ: ثبت تصاویری که ارزشِ کالا را به رخ می‌کشد.","تخت پادشاهی دیجیتال: طراحی وب‌سایتی که قلبِ تپنده‌ی امپراتوری شماست."] }
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
  const [newProject, setNewProject] = useState({ title: '', video_url: '', cover_url: '', type: 'video' });
  const [quotas, setQuotas] = useState({});
  
  // AI Chat States
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([{ role: 'bot', text: "درود بر شما. من هوش مصنوعی پروتکل Sovereign هستم. چطور می‌توانم در مسیر حاکمیت بصری به شما کمک کنم؟" }]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const bgMusic = useRef(new Audio(BG_MUSIC_URL));
  const greeting = useRef(new Audio(GREETING_URL));
  const scrollRef = useRef(null);
  const animScrollRef = useRef(null);

  useEffect(() => {
    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = () => setSupabase(window.supabase.createClient(supabaseUrl, supabaseKey));
      document.head.appendChild(script);
    } else {
      setSupabase(window.supabase.createClient(supabaseUrl, supabaseKey));
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

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setChatLog(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are the Sovereign AI Assistant for REZIBEL's PROMPT Holding. Respond in Persian. Be extremely professional, cinematic, and helpful about visual production and AI services. Question: ${chatInput}` }] }]
        })
      });
      const data = await response.json();
      const botText = data.candidates[0].content.parts[0].text;
      setChatLog(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (e) {
      setChatLog(prev => [...prev, { role: 'bot', text: "ارتباط با هسته مرکزی برقرار نشد. لطفاً لحظاتی دیگر تلاش کنید." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white overflow-x-hidden font-sans selection:bg-[#40E0D0]/30 pb-20 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,700&family=JetBrains+Mono:wght@300;700&display=swap');
        @font-face { font-family: 'Vazirmatn'; src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2') format('woff2'); }
        
        body { font-family: 'Vazirmatn', sans-serif; background: #010101; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .noise { position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.03; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); }
        
        /* Liquid Silver Animation */
        .liquid-bg { position: fixed; inset: 0; z-index: -1; pointer-events: none; }
        .halo { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.08; animation: move 20s infinite alternate; }
        .silver { background: radial-gradient(circle, #c0c0c0 0%, transparent 70%); width: 60vw; height: 60vw; top: -10%; left: -10%; }
        .cyan-h { background: radial-gradient(circle, #40E0D0 0%, transparent 70%); width: 50vw; height: 50vw; bottom: -10%; right: -10%; animation-delay: -5s; }
        @keyframes move { from { transform: translate(0,0) rotate(0deg); } to { transform: translate(20%, 15%) rotate(30deg); } }

        .halo-breathing { position: absolute; width: 250%; height: 250%; background: radial-gradient(circle, rgba(64,224,208,0.18) 0%, transparent 60%); animation: breathe 4s infinite ease-in-out; }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.15); opacity: 0.7; } }
        
        .glass-luxury { background: rgba(255, 255, 255, 0.01); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .responsive-title { font-size: clamp(2.5rem, 12vw, 13rem); line-height: 0.9; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

      <div className="noise" />
      <div className="liquid-bg"><div className="halo silver" /><div className="halo cyan-h" /></div>

      {/* --- SPLASH SCREEN --- */}
      {!entered && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center cursor-pointer" onClick={() => { setEntered(true); greeting.current.play(); bgMusic.current.play(); }}>
          <div className="relative flex items-center justify-center">
            <div className="halo-breathing" />
            <h1 className="responsive-title font-black tracking-tighter text-white italic z-10 drop-shadow-[0_0_50px_rgba(64,224,208,0.3)]">PROMPT</h1>
          </div>
          <div className="mt-32 flex items-center gap-5 text-zinc-500 text-[10px] tracking-[0.7em] uppercase animate-pulse font-mono">
            <MousePointer2 size={18} className="text-[#40E0D0] animate-bounce"/> <span>Initialize Sovereign Protocol</span>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        <nav className="p-8 md:p-12 flex justify-between items-center fixed top-0 w-full z-[100] backdrop-blur-3xl bg-black/40 border-b border-white/5">
           <div className="flex gap-5">
             <button onClick={() => setIsMuted(!isMuted)} className="p-4 glass-luxury rounded-full shadow-2xl transition-all hover:scale-110">{isMuted ? <VolumeX className="text-red-500" /> : <Volume2 className="text-[#40E0D0]" />}</button>
             <button onClick={() => setShowLoginModal(true)} className="p-4 glass-luxury rounded-full shadow-2xl hover:text-[#40E0D0] transition-all hover:scale-110"><Lock size={20}/></button>
           </div>
           <div className="text-right"><div className="text-2xl font-black tracking-tighter italic font-serif">PROMPT</div><div className="text-[8px] tracking-[0.5em] text-[#40E0D0] uppercase font-mono font-bold">Sovereign Authority</div></div>
        </nav>

        <main className="max-w-[2200px] mx-auto px-8 py-48">
          <header className="text-center mb-96 relative"><h1 className="responsive-title font-black tracking-tighter uppercase select-none italic text-transparent bg-clip-text bg-gradient-to-r from-white via-[#40E0D0] to-white bg-[length:200%_auto] animate-[shimmer_5s_linear_infinite]">VISUAL <br /> SUPREMACY</h1></header>

          {/* 1. ARCHIVES: VIDEO & ANIMATION */}
          <section className="mb-96 relative group">
            <div className="flex justify-between items-end mb-20 border-b border-white/5 pb-12">
               <div className="text-left">
                  <h2 className="text-6xl md:text-9xl font-black tracking-tight uppercase italic font-serif leading-none">Archives</h2>
                  <p className="text-[#40E0D0] text-sm md:text-xl font-[Vazirmatn] mt-4 font-bold">آرشیو پروژه‌های شاخص و سینمایی</p>
               </div>
            </div>
            {/* Horizontal Slider Logic (Simplified for stability) */}
            <div ref={scrollRef} className="flex gap-12 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10 px-4">
              {portfolio.filter(p => p.type !== 'animation').map((item) => (
                <div key={item.id} className="min-w-[85vw] md:min-w-[550px] aspect-[9/16] md:aspect-[3/4] rounded-[5rem] overflow-hidden border border-white/5 glass-luxury snap-center relative group/card shadow-[0_0_100px_rgba(0,0,0,0.8)] transition-all duration-1000 hover:scale-[1.02]">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveVideo(item)}>
                    <img src={item.cover_url} className="w-full h-full object-cover opacity-60 group-hover/card:opacity-100 transition-all duration-1000 grayscale group-hover/card:grayscale-0" alt=""/>
                    <div className="absolute inset-0 flex flex-col justify-end p-14 bg-gradient-to-t from-black/95 via-transparent">
                      <div className="w-20 h-20 rounded-full border border-[#40E0D0]/40 flex items-center justify-center text-[#40E0D0] mb-8 backdrop-blur-3xl group-hover/card:bg-[#40E0D0] group-hover/card:text-black transition-all duration-500"><Play size={32} fill="currentColor"/></div>
                      <h3 className="text-4xl font-black uppercase tracking-widest italic">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NEURAL ANIMATIONS SECTION */}
          <section className="mb-96 relative group">
            <div className="flex justify-between items-end mb-20 border-b border-white/5 pb-12">
               <div className="text-left">
                  <h2 className="text-6xl md:text-9xl font-black tracking-tight uppercase italic font-serif leading-none">Neural Animations</h2>
                  <p className="text-[#40E0D0] text-sm md:text-xl font-[Vazirmatn] mt-4 font-bold">سنتز انیمیشن‌های مفهومی و عصبی</p>
               </div>
            </div>
            <div ref={animScrollRef} className="flex gap-12 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10 px-4 opacity-80 hover:opacity-100 transition-opacity">
              {/* Animation samples would be fetched here filtered by type: 'animation' */}
              <div className="min-w-[85vw] md:min-w-[450px] aspect-[1/1] glass-luxury rounded-[4rem] flex flex-col items-center justify-center border-dashed border-white/10">
                 <RefreshCw className="animate-spin text-[#40E0D0]/20 mb-6" size={64}/>
                 <span className="font-mono text-zinc-600 text-[10px] tracking-widest">LOADING ANIMATION ARCHIVES...</span>
              </div>
            </div>
          </section>

          {/* 2. PROPOSALS */}
          <section className="mb-96">
             <div className="flex flex-col items-center text-center mb-40">
               <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6 italic font-serif">Proposals</h2>
               <p className="text-[#40E0D0] text-lg md:text-2xl font-[Vazirmatn] font-bold">پروتکل‌های همکاری استراتژیک و تعرفه‌ها</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {PRESET_PACKAGES.map(pkg => (
                  <div key={pkg.id} onClick={() => setPreviewPackage(pkg)} className={`p-14 rounded-[5rem] min-h-[650px] flex flex-col justify-between cursor-pointer border border-white/5 glass-luxury transition-all duration-700 hover:scale-[1.02] ${pkg.type === 'Fusion' ? 'border-[#40E0D0]/30 shadow-[0_0_80px_rgba(64,224,208,0.06)]' : ''}`}>
                      <div>
                        <div className="mb-12 p-8 rounded-[2.5rem] inline-block bg-white/5 text-[#40E0D0]">{pkg.type === 'Quantum' ? <Gem size={36}/> : pkg.type === 'Fusion' ? <Atom size={36}/> : <Cpu size={36}/>}</div>
                        <h3 className="text-6xl font-black mb-4 italic uppercase">{pkg.name}</h3>
                        <p className="text-[12px] text-[#40E0D0] mb-10 font-[Vazirmatn] leading-loose font-bold italic">{pkg.slogan}</p>
                        <div className="text-4xl font-black font-mono">{pkg.price} <span className="text-[11px] text-zinc-500">M T</span></div>
                      </div>
                      <div className="mt-14 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-all font-mono">specs <Plus size={14}/></div>
                  </div>
                ))}
             </div>
          </section>
        </main>

        {/* --- AI CHATBOT SYSTEM --- */}
        <button onClick={() => setShowChat(true)} className="fixed bottom-10 left-10 p-6 bg-[#40E0D0] text-black rounded-full shadow-[0_0_50px_rgba(64,224,208,0.5)] z-[200] hover:scale-110 transition-all group">
          <MessageSquare size={32} className="group-hover:rotate-12 transition-transform" />
        </button>

        {showChat && (
          <div className="fixed bottom-28 left-10 w-[90vw] md:w-[400px] h-[600px] glass-luxury rounded-[3rem] border border-[#40E0D0]/30 z-[300] flex flex-col overflow-hidden shadow-3xl animate-in slide-in-from-bottom-10">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/60">
              <div className="flex items-center gap-3"><Bot size={20} className="text-[#40E0D0]"/><span className="font-mono text-xs font-black uppercase tracking-widest">Sovereign Support</span></div>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar" dir="rtl">
              {chatLog.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-[Vazirmatn] leading-relaxed ${m.role === 'user' ? 'bg-white/10 text-white border border-white/5' : 'bg-[#40E0D0]/10 text-[#40E0D0] border border-[#40E0D0]/20'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isChatLoading && <Loader2 className="animate-spin text-[#40E0D0] mx-auto" size={24}/>}
            </div>
            <div className="p-6 bg-black/40 border-t border-white/5 flex gap-3">
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleChat()} className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-[Vazirmatn] outline-none focus:border-[#40E0D0]" placeholder="سوال خود را اینجا بپرسید..." />
              <button onClick={handleChat} className="p-4 bg-[#40E0D0] text-black rounded-2xl"><Send size={18}/></button>
            </div>
          </div>
        )}

        <footer className="mt-64 border-t border-white/5 bg-black py-48 text-center md:text-right relative">
            <div className="max-w-[2000px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-24">
               <div className="p-12 rounded-[5rem] glass-luxury border border-[#40E0D0]/20 group hover:border-[#40E0D0] transition-all shadow-3xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}&color=40E0D0&bgcolor=000&margin=2`} className="w-32 h-32 rounded-3xl opacity-40 group-hover:opacity-100 transition-opacity" alt="Sovereign QR" /></div>
               <div><h2 className="text-9xl md:text-[15rem] font-black leading-none tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-900 select-none">REZIBEL</h2><p className="text-[#40E0D0] text-xs font-black tracking-[0.6em] uppercase mt-14 italic font-mono">Core Architect & Sovereign Director</p><p className="text-[9px] text-zinc-800 tracking-[0.8em] uppercase mt-28 font-bold font-mono">© 2026 Sovereign Authority | Visual Hegemony Reserved</p></div>
            </div>
        </footer>
      </div>

      {/* --- MODALS --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[6000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="w-full max-w-md p-16 rounded-[4.5rem] glass-luxury text-center shadow-3xl">
            <Crown className="mx-auto text-[#40E0D0] mb-12 animate-pulse" size={64}/>
            <form onSubmit={(e) => { e.preventDefault(); if(loginForm.user === ADMIN_CREDENTIALS.user && loginForm.pass === ADMIN_CREDENTIALS.pass) { setIsAdmin(true); setShowLoginModal(false); } else alert("ACCESS DENIED"); }}>
              <input className="w-full bg-black/50 border border-white/10 p-7 rounded-[2rem] text-center mb-6 outline-none focus:border-[#40E0D0] transition-all font-mono tracking-widest text-white" placeholder="ADMIN_ID" value={loginForm.user} onChange={e=>setLoginForm({...loginForm, user:e.target.value})}/>
              <input className="w-full bg-black/50 border border-white/10 p-7 rounded-[2rem] text-center mb-10 outline-none focus:border-[#40E0D0] transition-all font-mono text-white" type="password" placeholder="VAULT_KEY" value={loginForm.pass} onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
              <button className="w-full py-7 bg-[#40E0D0] text-black font-black rounded-[2rem] uppercase tracking-[0.5em] text-[11px] hover:bg-white transition-all duration-700 shadow-2xl mb-4">Authorize Entry</button>
              <button type="button" onClick={() => setShowLoginModal(false)} className="text-zinc-600 text-[10px] uppercase font-mono hover:text-white transition-all tracking-widest">Abort Access</button>
            </form>
          </div>
        </div>
      )}

      {/* Package Specs Modal (Universal Scroll Fix) */}
      {previewPackage && (
        <div className="fixed inset-0 z-[5000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl" onClick={() => setPreviewPackage(null)}>
           <div className="max-w-6xl w-full p-20 glass-luxury rounded-[6rem] text-right border border-[#40E0D0]/20 max-h-[90vh] overflow-y-auto shadow-3xl relative" onClick={e=>e.stopPropagation()}>
             <h2 className="text-6xl md:text-9xl font-black mb-6 italic uppercase font-serif text-white">{previewPackage.name}</h2>
             <p className="text-2xl text-[#40E0D0] mb-20 font-[Vazirmatn] border-b border-white/10 pb-10 italic font-bold leading-relaxed">{previewPackage.slogan}</p>
             <div className="space-y-12" dir="rtl">
               {previewPackage.details.map((d,i) => (<div key={i} className="flex items-start gap-10 text-2xl md:text-3xl text-zinc-300 border-b border-white/5 pb-12 hover:text-[#40E0D0] transition-all duration-500"><CheckCircle2 className="text-[#40E0D0] mt-2 shrink-0" size={36}/> <div className="leading-relaxed drop-shadow-md">{formatPersianText(d)}</div></div>))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
