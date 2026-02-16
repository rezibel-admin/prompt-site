import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Trash2, X, Lock, LogOut, Crown, RefreshCw, Cpu, Atom, Gem, Briefcase, 
  Plus, CheckCircle2, ArrowUp, ArrowDown, Save, QrCode, Image as ImageIcon, 
  MessageSquare, Target, Wand2, Bot, Zap, Loader2, Volume2, VolumeX, ChevronRight, ChevronLeft, MousePointer2
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
  { id: 'pkg_core', name: 'CORE', slogan: 'مهندسی حضورِ استاندارد برای برندهایی که اشتباه در شروع را نمی‌پذیرند.', price: '25', type: 'Core', details: ["خلق اثر شاخص سینمایی: تدوین خروجی بصری با استانداردهای نوری پیشرفته بین‌المللی.","۵ فریم عکاسی تراز اول 4K (همراه با تجهیزات تخصصی نورپردازی و لنز ماکرو!)","۴ اپیزود سنتز هوشمند بصری: بهره‌گیری از AI برای خلق ۱ انیمیشن مفهومی و ۳ محتوای استراتژیک.","تلفیق ساختاری (AI Hybrid Integration): ترکیب ریاضیاتیِ ویدیوهای رئال با لایه‌های بصری هوش مصنوعی.","معماری سناریو (Narrative Engineering): تدوین استراتژیک سناریوهای روانشناختی.","مدیریت چرخه فروش: هدایت هوشمندانه مخاطب در مسیر خرید با اصول متقاعدسازی.","هویت‌بخشی بصری: معماری ویترین پیج و طراحی تمپلیت‌های اختصاصی."] },
  { id: 'pkg_fusion', name: 'FUSION', slogan: 'هم‌افزایی استراتژیک: نقطه تلاقی حاکمیتِ بصری و پردازش الگوریتمیک برای تسلطِ بی‌قید و شرط بر بازار.', price: '45', type: 'Fusion', details: ["۴ خروجیِ ویدئوییِ شاخص: مهندسی ۴ ویدئوی حرفه‌ای (شامل یک ویدئو اختصاصی FPV).","۱۰ فریم عکاسی صنعتی/تبلیغاتی: ایجاد یک آرشیو بصریِ غنی و خیره‌کننده.","۸ محتوای سنتز شده (AI Fusion Content): ۳ اپیزود انیمیشن سریالی + ۵ ویدئوی تبلیغاتی.","امضای بصری پویا (Dynamic Identity): طراحی لوگوموشنی که هویت برند را در ناخودآگاه مخاطب حک می‌کند.","پروتکل سئو بصری: مهندسی کپشن و بهینه‌سازی تصاویر برای اکسپلور.","مدیریت کامل ادمینی و فروش: واگذاری کامل چرخه جذب مشتری به تیم متخصص."] },
  { id: 'pkg_quantum', name: 'QUANTUM', slogan: 'حاکمیت ابدی در فضای دیجیتال؛ پکیجی برای رهبرانی که به چیزی جز «نفر اول بودن» قانع نیستند.', price: '85', type: 'Quantum', details: ["۸ اپیزود تولید محتوای سینمایی: شامل ۲ محتوای ویژه با تصویربرداری هوایی FPV.","۲۰ فریم عکاسی اشرافی: نمایش شکوه بیزنس با دقتی میکروسکوپی.","۱۲ شاهکار سنتز هوشمند (Total AI Domination): ۴ اپیزود انیمیشن سینمایی + ۸ ویدئوی هدفمند.","مهندسی بیزنس‌پلان اختصاصی: تدوین استراتژی‌های کلان برای تبدیلِ بیننده به سرمایه.","خلق سفیر مجازی برند (Virtual Influencer): طراحی شخصیت دیجیتال اختصاصی.","حاکمیت بر اکسپلور: مهندسی محتوا با هدف ورود حداکثری به ویترین جهانی."] },
  { id: 'pkg_tactical', name: 'TACTICAL', slogan: 'ابزارهای هدفمند برای تقویت جبهه‌های خاص کسب‌وکار.', price: 'Variable', type: 'Tactical', details: ["واحد انیمیشن‌سازی اختصاصی: ساخت دنیایی بدون محدودیت‌های فیزیکی.","اقتدار محلی (Google Map SEO): تثبیت جایگاه در ۳ لینک اول گوگل.","تک-اپیزود ریلز (Fast Strike): اعزام تیمِ ضربت بصری برای خلق محتوای وایرال.","فریم‌های 4K پرستیژ: ثبت تصاویرِ ایزوله و نوری که ارزشِ واقعی کالا را به رخ می‌کشد.","تخت پادشاهی دیجیتال (Web Architecture): طراحی وب‌سایتی که قلبِ تپنده‌ی امپراتوری شماست."] }
];

const NEURAL_MODULES = [
  { id: 'visual_engine', title: 'Visual Engine', fa_title: 'موتور تصویرسازی هوشمند', limit: 5, icon: <ImageIcon size={28}/>, type: 'image', desc: 'توصیف صحنه را بنویسید تا هوش مصنوعی آن را به تصویر تبدیل کند.' },
  { id: 'quantum_script', title: 'Quantum Script', fa_title: 'مهندسی سناریوهای ویروسی', limit: 3, icon: <MessageSquare size={28}/>, type: 'text', desc: 'موضوع محصول را بنویسید تا سناریوی ویروسی دریافت کنید.' },
  { id: 'oracle', title: 'Oracle Strategy', fa_title: 'مشاور استراتژیک بازار', limit: 5, icon: <Target size={28}/>, type: 'text', desc: 'سوالات خود درباره رشد پیج را بپرسید.' },
  { id: 'nexus', title: 'Nexus Protocol', fa_title: 'پروتکل نگارش رسمی', limit: 10, icon: <Wand2 size={28}/>, type: 'text', desc: 'تبدیل متن ساده به اداری و با پرستیژ.' }
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
  const [quotas, setQuotas] = useState({});
  const [aiInputs, setAiInputs] = useState({});
  const [aiResults, setAiResults] = useState({});
  const [isAiLoading, setIsAiLoading] = useState({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const bgMusic = useRef(new Audio(BG_MUSIC_URL));
  const greeting = useRef(new Audio(GREETING_URL));
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    
    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = () => setSupabase(window.supabase.createClient(supabaseUrl, supabaseKey));
      document.head.appendChild(script);
    } else {
      setSupabase(window.supabase.createClient(supabaseUrl, supabaseKey));
    }

    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('neural_quotas') || '{}');
    if (stored.date !== today) {
      const initial = {};
      NEURAL_MODULES.forEach(m => initial[m.id] = m.limit);
      setQuotas(initial);
      localStorage.setItem('neural_quotas', JSON.stringify({ date: today, usage: initial }));
    } else {
      setQuotas(stored.usage);
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

  const handleAiExecute = async (module) => {
    const input = aiInputs[module.id];
    if (!input) return;
    const remaining = quotas[module.id] || 0;
    if (remaining <= 0 && !isAdmin) return alert("DAILY LIMIT REACHED");

    setIsAiLoading(prev => ({ ...prev, [module.id]: true }));
    setAiResults(prev => ({ ...prev, [module.id]: null }));

    try {
      if (module.type === 'image') {
        const seed = Math.floor(Math.random() * 99999);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(input)}?seed=${seed}&width=1024&height=1024&nologo=true`;
        setAiResults(prev => ({ ...prev, [module.id]: imageUrl }));
      } else {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `Act as a luxury marketing director. Context: ${module.fa_title}. Prompt: ${input}. Respond in Persian.` }] }] })
        });
        const data = await response.json();
        setAiResults(prev => ({ ...prev, [module.id]: data.candidates[0].content.parts[0].text }));
      }
      if (!isAdmin) {
        const newQuotas = { ...quotas, [module.id]: remaining - 1 };
        setQuotas(newQuotas);
        localStorage.setItem('neural_quotas', JSON.stringify({ date: new Date().toDateString(), usage: newQuotas }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(prev => ({ ...prev, [module.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white overflow-x-hidden font-sans cursor-none selection:bg-[#40E0D0]/30 pb-20 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,700&family=JetBrains+Mono:wght@300;700&display=swap');
        @font-face { font-family: 'Vazirmatn'; src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2') format('woff2'); }
        
        body { font-family: 'Vazirmatn', sans-serif; background: #010101; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .noise-overlay { position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.03; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); }
        .cursor-follower { position: fixed; width: 25px; height: 25px; border: 1.5px solid #40E0D0; border-radius: 50%; pointer-events: none; z-index: 10000; transition: transform 0.15s ease-out; transform: translate(-50%, -50%); }
        
        .halo-teal { position: absolute; width: 300%; height: 300%; background: radial-gradient(circle, rgba(64,224,208,0.12) 0%, transparent 50%); animation: breathe 6s infinite; }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } }
        
        .glass-luxury { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .quantum-gold { background: linear-gradient(135deg, #CFB53B 0%, #F5E1A4 50%, #CFB53B 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .shimmer-teal { background: linear-gradient(90deg, #fff 0%, #40E0D0 50%, #fff 100%); background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 4s infinite linear; }
        @keyframes shimmer { to { background-position: 200%; } }
      `}} />

      <div className="noise-overlay" />
      <div className="cursor-follower hidden md:block" style={{ left: mousePos.x, top: mousePos.y }} />

      {!entered && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center cursor-pointer" onClick={initializeProtocol}>
          <div className="relative flex items-center justify-center">
            <div className="halo-teal" />
            <h1 className="text-[18vw] md:text-[13rem] font-black tracking-tighter text-white italic z-10 drop-shadow-[0_0_40px_rgba(64,224,208,0.4)]">PROMPT</h1>
          </div>
          <div className="mt-20 flex items-center gap-4 text-zinc-500 text-[10px] tracking-[0.6em] uppercase animate-pulse font-mono"><MousePointer2 size={16}/> <span>Initialize Sovereign Protocol</span></div>
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        <nav className="p-8 md:p-12 flex justify-between items-center fixed top-0 w-full z-[100] backdrop-blur-3xl bg-black/40 border-b border-white/5">
           <div className="flex gap-5">
             <button onClick={() => setIsMuted(!isMuted)} className="p-4 glass-luxury rounded-full shadow-2xl transition-all hover:scale-110">{isMuted ? <VolumeX className="text-red-500" /> : <Volume2 className="text-[#40E0D0]" />}</button>
             <button onClick={() => setShowLoginModal(true)} className="p-4 glass-luxury rounded-full shadow-2xl transition-all hover:scale-110 hover:text-[#40E0D0]"><Lock size={20}/></button>
           </div>
           <div className="text-right"><div className="text-2xl font-black tracking-tighter italic font-serif">PROMPT</div><div className="text-[8px] tracking-[0.5em] text-[#40E0D0] uppercase font-mono">Sovereign Authority</div></div>
        </nav>

        <main className="max-w-[2000px] mx-auto px-8 py-48">
          <header className="text-center mb-96 relative">
            <h1 className="text-[15vw] md:text-[12rem] font-black tracking-tighter uppercase select-none italic shimmer-teal leading-[0.85]">VISUAL <br /> SUPREMACY</h1>
          </header>

          {/* 1. ARCHIVES (HORIZONTAL LUXE) */}
          <section className="mb-96 relative group">
            <div className="flex justify-between items-end mb-20 border-b border-white/5 pb-12">
               <h2 className="text-6xl md:text-8xl font-black tracking-tight uppercase italic font-serif">Archives</h2>
               <p className="text-[#40E0D0] tracking-[0.6em] text-[10px] uppercase font-mono">Neural Repository</p>
            </div>
            <div ref={scrollRef} className="flex gap-12 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10 px-4">
              {portfolio.map((item) => (
                <div key={item.id} className="min-w-[85vw] md:min-w-[550px] aspect-[9/16] md:aspect-[3/4] rounded-[5rem] overflow-hidden border border-white/5 glass-luxury snap-center transition-all duration-1000 hover:scale-[1.03] hover:border-[#40E0D0]/30 relative group/card shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveVideo(item)}>
                    <img src={item.cover_url} className="w-full h-full object-cover opacity-60 group-hover/card:opacity-100 transition-all duration-1000 grayscale group-hover/card:grayscale-0" alt=""/>
                    <div className="absolute inset-0 flex flex-col justify-end p-14 bg-gradient-to-t from-black/95 via-transparent">
                      <div className="w-20 h-20 rounded-full border border-[#40E0D0]/40 flex items-center justify-center text-[#40E0D0] mb-8 backdrop-blur-3xl group-hover/card:bg-[#40E0D0] group-hover/card:text-black transition-all duration-500 shadow-2xl"><Play size={32} fill="currentColor"/></div>
                      <h3 className="text-4xl font-black uppercase tracking-widest italic drop-shadow-2xl">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-12 mt-12">
              <button onClick={() => scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' })} className="p-5 glass-luxury rounded-full text-[#40E0D0] hover:bg-[#40E0D0] hover:text-black transition-all"><ChevronLeft size={28}/></button>
              <span className="text-[10px] tracking-[0.8em] uppercase font-mono text-zinc-600">Explore Vault</span>
              <button onClick={() => scrollRef.current.scrollBy({ left: 500, behavior: 'smooth' })} className="p-5 glass-luxury rounded-full text-[#40E0D0] hover:bg-[#40E0D0] hover:text-black transition-all"><ChevronRight size={28}/></button>
            </div>
          </section>

          {/* 2. PROPOSALS (BENTO STYLE LUXE) */}
          <section className="mb-96">
             <div className="text-center mb-40">
               <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 italic font-serif">Proposals</h2>
               <p className="text-zinc-600 tracking-[0.6em] uppercase text-[10px] font-mono">Elite Strategic Alliances</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {PRESET_PACKAGES.map(pkg => (
                  <div key={pkg.id} onClick={() => setPreviewPackage(pkg)} className={`p-14 rounded-[4rem] min-h-[650px] flex flex-col justify-between cursor-pointer border border-white/5 glass-luxury transition-all duration-700 hover:scale-[1.02] ${pkg.type === 'Fusion' ? 'border-[#40E0D0]/30 shadow-[0_0_60px_rgba(64,224,208,0.08)]' : ''}`}>
                      <div>
                        <div className={`mb-12 p-7 rounded-[2rem] inline-block ${pkg.type === 'Fusion' ? 'bg-[#40E0D0]/10 text-[#40E0D0]' : 'bg-white/5 text-zinc-500'} ${pkg.type === 'Quantum' ? 'text-[#CFB53B] bg-[#CFB53B]/10' : ''}`}>{pkg.type === 'Quantum' ? <Gem size={36}/> : pkg.type === 'Fusion' ? <Atom size={36}/> : <Cpu size={36}/>}</div>
                        <h3 className={`text-6xl font-black mb-4 italic ${pkg.type === 'Quantum' ? 'quantum-gold' : 'text-white'}`}>{pkg.name}</h3>
                        <p className="text-[12px] text-[#40E0D0] mb-10 font-[Vazirmatn] leading-loose font-bold italic opacity-80">{pkg.slogan}</p>
                        <div className="text-4xl font-black font-mono">{pkg.price} <span className="text-[11px] text-zinc-500 uppercase">M T</span></div>
                      </div>
                      <div className="mt-14 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-all font-mono">Specs <Plus size={16}/></div>
                  </div>
                ))}
             </div>
          </section>

          {/* 3. NEURAL GRID (BENTO GRID RE-ARCHITECTED) */}
          <section className="mb-96 relative">
            <div className="text-center mb-32">
               <div className="inline-flex items-center gap-4 mb-8 px-8 py-4 rounded-full bg-[#40E0D0]/10 text-[#40E0D0] border border-[#40E0D0]/30 animate-pulse"><Bot size={24}/> <span className="text-sm font-black tracking-widest font-mono uppercase">Neural Protocol Active</span></div>
               <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-4 italic font-serif">Neural Grid</h2>
               <p className="text-zinc-600 tracking-[0.6em] uppercase text-[10px] font-mono">Intelligence Modules / ابزارهای هوشمند</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
              {NEURAL_MODULES.map((module, idx) => (
                <div key={idx} className={`glass-luxury p-12 rounded-[5rem] flex flex-col h-[650px] relative overflow-hidden transition-all duration-700 hover:border-[#40E0D0]/50 shadow-3xl ${idx === 0 || idx === 3 ? 'md:col-span-3' : 'md:col-span-3'}`}>
                  <div className="absolute top-12 right-12 px-6 py-2 rounded-full border border-[#CFB53B]/50 bg-[#CFB53B]/10 text-[#CFB53B] text-[10px] font-black tracking-[0.3em] italic font-mono shadow-[0_0_20px_rgba(207,181,59,0.2)]">FREE: {quotas[module.id]}/5</div>
                  <div className="mt-10 mb-10 text-[#40E0D0] bg-white/5 p-7 rounded-[2.5rem] w-fit shadow-inner">{module.icon}</div>
                  <h3 className="text-3xl font-black uppercase italic font-serif mb-4">{module.title}</h3>
                  <p className="text-sm text-[#40E0D0] mb-6 font-[Vazirmatn] font-bold italic">{module.fa_title}</p>
                  <p className="text-xs text-zinc-500 leading-loose mb-12 font-[Vazirmatn]">{module.desc}</p>
                  <div className="mt-auto flex flex-col gap-6">
                    <textarea onChange={(e) => setAiInputs(prev => ({...prev, [module.id]: e.target.value}))} className="w-full bg-black/50 border border-white/10 p-6 rounded-[2rem] text-right text-sm text-white outline-none focus:border-[#40E0D0] h-32 resize-none transition-all placeholder:opacity-20 custom-scrollbar" placeholder="سیستم آماده دریافت درخواست شماست..."/>
                    <button onClick={() => handleAiExecute(module)} className="w-full py-6 bg-white text-black font-black text-xs tracking-[0.5em] rounded-[2rem] hover:bg-[#40E0D0] transition-all uppercase shadow-2xl font-mono">Execute Protocol</button>
                  </div>

                  {aiResults[module.id] && (
                    <div className="absolute inset-0 z-20 bg-black/98 rounded-[5rem] p-12 flex flex-col animate-in fade-in zoom-in duration-500">
                      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6"><span className="text-[#40E0D0] text-xs font-black font-mono">SYNTHESIS COMPLETE</span><button onClick={() => setAiResults(prev => ({...prev, [module.id]: null}))} className="p-3 bg-white/5 rounded-full hover:bg-red-500/20"><X size={24}/></button></div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {module.type === 'image' ? <img src={aiResults[module.id]} className="w-full h-full object-cover rounded-[3rem] border border-white/10 shadow-2xl" alt="Neural Output" /> : <p className="text-lg text-zinc-200 font-[Vazirmatn] leading-relaxed text-right" dir="rtl">{aiResults[module.id]}</p>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* --- MODALS & PLAYERS (LUXE REFINED) --- */}
      {activeVideo && (
        <div className="fixed inset-0 z-[5000] bg-black/99 flex items-center justify-center p-6 backdrop-blur-3xl">
          <button onClick={() => setActiveVideo(null)} className="absolute top-10 left-10 p-7 glass-luxury rounded-full hover:bg-white hover:text-black z-50 shadow-3xl"><X size={40}/></button>
          <div className="w-full max-w-lg aspect-[9/16] rounded-[5rem] overflow-hidden border border-[#40E0D0]/30 shadow-[0_0_200px_rgba(64,224,208,0.2)]">
            <video controls autoPlay className="w-full h-full object-cover" controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} poster={activeVideo.cover_url} onLoadedData={() => setVideoLoading(false)}><source src={activeVideo.video_url} type="video/mp4" /></video>
          </div>
        </div>
      )}

      {previewPackage && (
        <div className="fixed inset-0 z-[5000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl" onClick={() => setPreviewPackage(null)}>
           <div className="max-w-6xl w-full p-20 glass-luxury rounded-[6rem] text-right border border-[#40E0D0]/20 max-h-[90vh] overflow-y-auto relative" onClick={e=>e.stopPropagation()}>
             <h2 className={`text-6xl md:text-9xl font-black mb-4 italic uppercase font-serif ${previewPackage.type === 'Quantum' ? 'quantum-gold' : 'text-white'}`}>{previewPackage.name}</h2>
             <p className="text-xl text-[#40E0D0] mb-20 font-[Vazirmatn] border-b border-white/10 pb-10 italic font-bold leading-relaxed">{previewPackage.slogan}</p>
             <div className="space-y-12" dir="rtl">{previewPackage.details.map((d,i) => (<div key={i} className="flex items-start gap-8 text-2xl md:text-3xl text-zinc-300 border-b border-white/5 pb-12 hover:text-[#40E0D0] transition-all duration-500"><CheckCircle2 className="text-[#40E0D0] mt-2 shrink-0" size={36}/> <div className="leading-relaxed drop-shadow-md">{formatPersianText(d)}</div></div>))}</div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
