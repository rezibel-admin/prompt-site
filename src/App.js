import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Trash2, X, Lock, LogOut, Crown, RefreshCw, Cpu, Atom, Gem, Briefcase, 
  Plus, CheckCircle2, ArrowUp, ArrowDown, Save, QrCode, Image as ImageIcon, 
  MessageSquare, Target, Wand2, Bot, Zap, Loader2, Volume2, VolumeX, ChevronRight, ChevronLeft, MousePointer2, Send, Download, AlertTriangle
} from 'lucide-react';

// --- CONFIG & CREDENTIALS ---
const supabaseUrl = 'https://bibgekufrjfokauiksca.supabase.co';
const supabaseKey = 'sb_publishable_7VSrrcDIUHhZaRgUPsEwkw_jfLxxVdc';
const ADMIN_CREDENTIALS = { user: "RezibelRr845", pass: "RezaRezibel13845" };

// ✅ کلید فعال‌سازی:
const GEMINI_API_KEY = "AIzaSyCrFt7BZv4hlZROlo6gVYw61CytZTdYlF8"; 

// --- ASSETS ---
const CHARACTER_IMG = "https://bibgekufrjfokauiksca.supabase.co/storage/v1/object/public/audio/Gemini_Generated_Image_gvynjogvynjogvyn-removebg.png"; 
const GREETING_URL = "https://bibgekufrjfokauiksca.supabase.co/storage/v1/object/public/audio/ElevenLabs_2026-02-15T18_14_14_Donovan%20-%20Articulate,%20Strong%20and%20Deep_pvc_sp100_s50_sb75_v3.mp3"; 
const BG_MUSIC_URL = "https://bibgekufrjfokauiksca.supabase.co/storage/v1/object/public/audio/starostin-ambient-ambient-music-484374.mp3";

// --- HELPERS ---
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
  { id: 'pkg_core', name: 'CORE', slogan: 'مهندسی حضورِ استاندارد برای برندهایی که اشتباه در شروع را نمی‌پذیرند.', price: '25', type: 'Core', details: ["خلق اثر شاخص سینمایی: تدوین خروجی بصری با استانداردهای نوری پیشرفته.","۵ فریم عکاسی تراز اول 4K (همراه با تجهیزات تخصصی نورپردازی!)","۴ اپیزود سنتز هوشمند بصری: بهره‌گیری از AI برای خلق ۱ انیمیشن مفهومی.","تلفیق ساختاری: ترکیب ویدیوهای رئال با لایه‌های بصری هوش مصنوعی.","معماری سناریو: تدوین استراتژیک سناریوهای روانشناختی.","مدیریت چرخه فروش: هدایت هوشمندانه مخاطب در مسیر خرید.","هویت‌بخشی بصری: معماری ویترین پیج و طراحی تمپلیت‌های اختصاصی."] },
  { id: 'pkg_fusion', name: 'FUSION', slogan: 'هم‌افزایی استراتژیک: نقطه تلاقی حاکمیتِ بصری و پردازش الگوریتمیک.', price: '45', type: 'Fusion', details: ["۴ خروجیِ ویدئوییِ شاخص: مهندسی ۴ ویدئوی حرفه‌ای (شامل FPV).","۱۰ فریم عکاسی صنعتی/تبلیغاتی: ایجاد یک آرشیو بصریِ غنی.","۸ محتوای سنتز شده: ۳ اپیزود انیمیشن سریالی + ۵ ویدئوی تبلیغاتی.","امضای بصری پویا: طراحی لوگوموشنی که هویت برند را حک می‌کند.","پروتکل سئو بصری: مهندسی کپشن برای اکسپلور.","مدیریت کامل ادمینی و فروش: واگذاری چرخه جذب به تیم متخصص."] },
  { id: 'pkg_quantum', name: 'QUANTUM', slogan: 'حاکمیت ابدی در فضای دیجیتال؛ پکیجی برای رهبرانی که به چیزی جز «نفر اول بودن» قانع نیستند.', price: '85', type: 'Quantum', details: ["۸ اپیزود تولید محتوای سینمایی: شامل ۲ محتوای ویژه FPV.","۲۰ فریم عکاسی اشرافی: نمایش شکوه بیزنس با دقتی میکروسکوپی.","۱۲ شاهکار سنتز هوشمند: ۴ اپیزود انیمیشن سینمایی + ۸ ویدئوی هدفمند.","مهندسی بیزنس‌پلان اختصاصی: تدوین استراتژی‌های کلان تبدیل بیننده به سرمایه.","خلق سفیر مجازی برند: طراحی شخصیت دیجیتال اختصاصی (Virtual Influencer).","حاکمیت بر اکسپلور: مهندسی محتوا با هدف ورود حداکثری."] },
  { id: 'pkg_tactical', name: 'TACTICAL', slogan: 'ابزارهای هدفمند برای تقویت جبهه‌های خاص کسب‌وکار.', price: 'Variable', type: 'Tactical', details: ["واحد انیمیشن‌سازی اختصاصی: ساخت دنیایی بدون محدودیت‌های فیزیکی.","اقتدار محلی (Google Map SEO): تثبیت جایگاه در ۳ لینک اول گوگل.","تک-اپیزود ریلز: اعزام تیمِ ضربت بصری برای خلق محتوای وایرال.","فریم‌های 4K پرستیژ: ثبت تصاویری که ارزشِ کالا را به رخ می‌کشد.","تخت پادشاهی دیجیتال: طراحی وب‌سایتی که قلبِ تپنده‌ی امپراتوری شماست."] }
];

const NEURAL_MODULES = [
  { id: 'visual_engine', title: 'Visual Engine', fa_title: 'موتور تصویرسازی هوشمند', limit: 5, icon: <ImageIcon size={28}/>, type: 'image', desc: 'توصیف صحنه را بنویسید تا هوش مصنوعی آن را به تصویر تبدیل کند.' },
  { id: 'quantum_script', title: 'Quantum Script', fa_title: 'مهندسی سناریوهای جریان‌ساز', limit: 3, icon: <MessageSquare size={28}/>, type: 'text', desc: 'موضوع محصول را بنویسید تا سناریوی سینمایی و جریان‌ساز دریافت کنید.' },
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
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([{ role: 'bot', text: "درود بر شما. من هوش مصنوعی پروتکل Sovereign هستم. چطور می‌توانم در مسیر حاکمیت بصری به شما کمک کنم؟" }]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [aiInputs, setAiInputs] = useState({});
  const [aiResults, setAiResults] = useState({});
  const [isAiLoading, setIsAiLoading] = useState({});

  const bgMusic = useRef(new Audio(BG_MUSIC_URL));
  const greeting = useRef(new Audio(GREETING_URL));
  const scrollRef = useRef(null);
  const animScrollRef = useRef(null);

  useEffect(() => {
    // --- Performance: Preconnect to external domains ---
    const link1 = document.createElement('link'); link1.rel = 'preconnect'; link1.href = 'https://bibgekufrjfokauiksca.supabase.co'; document.head.appendChild(link1);
    const link2 = document.createElement('link'); link2.rel = 'preconnect'; link2.href = 'https://generativelanguage.googleapis.com'; document.head.appendChild(link2);
    const link3 = document.createElement('link'); link3.rel = 'preconnect'; link3.href = 'https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir'; document.head.appendChild(link3);

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
    bgMusic.current.volume = 0.4;
  }, [supabase]);

  const initializeProtocol = () => {
    setEntered(true);
    const playAudio = async () => {
      try {
        await greeting.current.play();
        await bgMusic.current.play();
      } catch (e) {
        console.log("Auto-play waiting for user interaction");
      }
    };
    playAudio();
  };

  const toggleMute = () => {
    if (isMuted) {
      bgMusic.current.play();
      setIsMuted(false);
    } else {
      bgMusic.current.pause();
      greeting.current.pause();
      setIsMuted(true);
    }
  };

  const scrollVault = (ref, direction) => {
    if (ref.current) {
        const { scrollLeft, clientWidth } = ref.current;
        const step = clientWidth * 0.7;
        ref.current.scrollTo({ left: direction === 'left' ? scrollLeft - step : scrollLeft + step, behavior: 'smooth' });
    }
  };

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
          contents: [{ parts: [{ text: `Act as the Sovereign AI Assistant for REZIBEL PROMPT. Respond in Persian. Tone: Professional, Cinematic, Luxury. Question: ${chatInput}` }] }]
        })
      });
      if (!response.ok) throw new Error("API_ERROR");
      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "خطا در دریافت پاسخ.";
      setChatLog(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (e) {
      setChatLog(prev => [...prev, { role: 'bot', text: "ارتباط با سرور هوش مصنوعی برقرار نشد. لطفاً اتصال اینترنت و VPN خود را بررسی کنید." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAiExecute = async (module) => {
    const input = aiInputs[module.id];
    if (!input) return;
    const remaining = quotas[module.id] || 0;
    if (remaining <= 0 && !isAdmin) return alert("سهمیه روزانه شما تمام شده است.");

    setIsAiLoading(prev => ({ ...prev, [module.id]: true }));
    setAiResults(prev => ({ ...prev, [module.id]: null }));

    try {
      if (module.type === 'image') {
        const seed = Math.floor(Math.random() * 99999);
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(input)}?width=1024&height=1024&seed=${seed}&nologo=true`;
        
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            setAiResults(prev => ({ ...prev, [module.id]: imageUrl }));
            setIsAiLoading(prev => ({ ...prev, [module.id]: false }));
        };
        img.onerror = () => { throw new Error("Image Load Failed"); };

      } else {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `Respond in Persian. Creative Director tone. Prompt: ${input}` }] }] })
        });
        if (!response.ok) throw new Error("API_ERROR");
        const data = await response.json();
        setAiResults(prev => ({ ...prev, [module.id]: data.candidates[0].content.parts[0].text }));
        setIsAiLoading(prev => ({ ...prev, [module.id]: false }));
      }

      if (!isAdmin) {
        const newQuotas = { ...quotas, [module.id]: remaining - 1 };
        setQuotas(newQuotas);
        localStorage.setItem('neural_quotas', JSON.stringify({ date: new Date().toDateString(), usage: newQuotas }));
      }
    } catch (e) {
      alert("خطا: ارتباط با سرور برقرار نشد. لطفاً VPN خود را روشن کنید.");
      setIsAiLoading(prev => ({ ...prev, [module.id]: false }));
    }
  };

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rezibel-Art-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white overflow-x-hidden font-sans selection:bg-[#40E0D0]/30 pb-20 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,700&family=JetBrains+Mono:wght@300;700&display=swap');
        @font-face { font-family: 'Vazirmatn'; src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2') format('woff2'); }
        body { font-family: 'Vazirmatn', sans-serif; background: #010101; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .noise { position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.04; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); }
        .liquid-bg { position: fixed; inset: 0; z-index: -1; pointer-events: none; }
        .halo { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; animation: move 20s infinite alternate; }
        .silver { background: radial-gradient(circle, #b0b0b0 0%, transparent 70%); width: 80vw; height: 80vw; top: -20%; left: -20%; }
        .cyan-h { background: radial-gradient(circle, #40E0D0 0%, transparent 70%); width: 60vw; height: 60vw; bottom: -10%; right: -10%; animation-delay: -5s; }
        @keyframes move { from { transform: translate(0,0) rotate(0deg); } to { transform: translate(10%, 10%) rotate(10deg); } }
        .glass-luxury { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .responsive-title { font-size: clamp(3rem, 15vw, 13rem); line-height: 0.9; }
        .snap-x { scroll-snap-type: x mandatory; }
        .snap-center { scroll-snap-align: center; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes bounce-right { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
        .animate-bounce-right { animation: bounce-right 1s infinite; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .silver-shine { background: linear-gradient(90deg, #fff 0%, #a0a0a0 50%, #fff 100%); background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 3s infinite linear; }
        @keyframes shine { to { background-position: 200%; } }
      `}} />

      <div className="noise" />
      <div className="liquid-bg"><div className="halo silver" /><div className="halo cyan-h" /></div>

      <img src={CHARACTER_IMG} alt="preload" className="hidden" fetchPriority="high" decoding="async" />

      {/* --- SPLASH SCREEN --- */}
      {!entered && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center cursor-pointer" onClick={initializeProtocol}>
          <div className="relative flex flex-col items-center justify-center mb-12 z-20 leading-none">
            <img src={CHARACTER_IMG} alt="Sovereign Avatar" className="w-[45vw] md:w-[22vw] max-w-md animate-float drop-shadow-[0_0_40px_rgba(64,224,208,0.4)] object-contain mb-6 md:-mb-[2.5vw] relative z-10" />
            <div className="relative">
               <div className="halo-breathing" />
               <h1 className="text-[18vw] md:text-[12rem] font-black tracking-tighter text-white italic z-10 drop-shadow-[0_0_30px_rgba(64,224,208,0.5)] leading-none">PROMPT</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 text-zinc-400 text-[10px] md:text-xs tracking-[0.5em] uppercase font-mono bg-white/5 px-6 py-3 rounded-full border border-white/10 z-20">
            <MousePointer2 size={16} className="text-[#40E0D0] animate-bounce-right"/> <span>Initialize Sovereign Protocol</span>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        <nav className="p-6 md:p-10 flex justify-between items-center fixed top-0 w-full z-[100] backdrop-blur-xl bg-black/60 border-b border-white/5">
           <div className="flex gap-3 md:gap-5">
             <button onClick={toggleMute} className="p-3 md:p-4 glass-luxury rounded-full shadow-2xl active:scale-95 transition-transform">{isMuted ? <VolumeX className="text-red-500 w-5 h-5" /> : <Volume2 className="text-[#40E0D0] w-5 h-5" />}</button>
             <button onClick={() => setShowLoginModal(true)} className="p-3 md:p-4 glass-luxury rounded-full shadow-2xl active:scale-95 transition-transform hover:text-[#40E0D0]"><Lock className="w-5 h-5"/></button>
           </div>
           <div className="text-right">
             <div className="text-xl md:text-2xl font-black tracking-tighter italic font-serif">PROMPT</div>
             <div className="text-[8px] md:text-[9px] tracking-[0.4em] text-[#40E0D0] uppercase font-mono font-bold">Sovereign Authority</div>
           </div>
        </nav>

        <main className="max-w-[2000px] mx-auto px-4 md:px-8 py-32 md:py-48">
          <header className="text-center relative">
            <h1 className="responsive-title font-black tracking-tighter uppercase select-none italic text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 leading-none">VISUAL <br /> <span className="text-[#40E0D0]">SUPREMACY</span></h1>
          </header>
          
          <div className="flex justify-center my-12 md:my-16 relative z-10 pointer-events-none py-2">
             <img src={CHARACTER_IMG} alt="Avatar" className="w-[60vw] md:w-[35vw] max-w-[700px] opacity-90 animate-float object-contain drop-shadow-2xl" />
          </div>

          {/* 1. ARCHIVES */}
          <section className="mb-64 md:mb-96 relative group pt-10 md:pt-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-8 px-2">
               <div>
                  <h2 className="text-5xl md:text-8xl font-black tracking-tight uppercase italic font-serif leading-none mb-2">Archives</h2>
                  <p className="text-[#40E0D0] text-xs md:text-base font-[Vazirmatn] font-bold opacity-80">آرشیو پروژه‌های شاخص و سینمایی</p>
               </div>
            </div>
            
            <div ref={scrollRef} className="flex gap-6 md:gap-12 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12 px-2 md:px-4 scroll-smooth">
              {portfolio.filter(p => p.type !== 'animation').map((item) => (
                <div key={item.id} className="min-w-[85vw] md:min-w-[500px] aspect-[9/16] rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10 glass-luxury snap-center relative shadow-2xl transition-transform active:scale-95 group">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => { setActiveVideo(item); bgMusic.current.pause(); }}>
                    {/* Lazy Loading & Async Decoding for speed */}
                    <img src={item.cover_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 transition-all duration-700 opacity-70" alt={item.title} loading="lazy" decoding="async" />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-black/90 via-transparent">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#40E0D0]/60 flex items-center justify-center text-[#40E0D0] mb-4 backdrop-blur-md bg-black/20"><Play size={24} fill="currentColor"/></div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest italic">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile Nav */}
            <div className="flex justify-between items-center px-4 mt-4 md:hidden opacity-60">
               <button onClick={() => scrollVault(scrollRef, 'left')} className="p-3 glass-luxury rounded-full text-[#40E0D0] active:scale-90 transition-transform"><ChevronLeft size={24}/></button>
               <span className="text-[9px] tracking-[0.3em] uppercase font-mono">Swipe or Tap to Explore</span>
               <button onClick={() => scrollVault(scrollRef, 'right')} className="p-3 glass-luxury rounded-full text-[#40E0D0] active:scale-90 transition-transform"><ChevronRight size={24}/></button>
            </div>
          </section>

          {/* NEURAL ANIMATIONS */}
          <section className="mb-64 md:mb-96 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-8 px-2">
               <div>
                  <h2 className="text-4xl md:text-8xl font-black tracking-tight uppercase italic font-serif leading-none mb-2">Neural Animations</h2>
                  <p className="text-[#40E0D0] text-xs md:text-base font-[Vazirmatn] font-bold opacity-80">آرشیو انیمیشن‌ها</p>
               </div>
            </div>
            <div ref={animScrollRef} className="flex gap-6 md:gap-12 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12 px-2 md:px-4 scroll-smooth">
               {portfolio.filter(p => p.type === 'animation').length > 0 ? (
                 portfolio.filter(p => p.type === 'animation').map((item) => (
                    <div key={item.id} className="min-w-[85vw] md:min-w-[500px] aspect-[9/16] rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10 glass-luxury snap-center relative shadow-2xl transition-transform active:scale-95 group">
                      <div className="absolute inset-0 cursor-pointer" onClick={() => { setActiveVideo(item); bgMusic.current.pause(); }}>
                        <img src={item.cover_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 transition-all duration-700 opacity-70" alt={item.title} loading="lazy" decoding="async" />
                        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-black/90 via-transparent">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#40E0D0]/60 flex items-center justify-center text-[#40E0D0] mb-4 backdrop-blur-md bg-black/20"><Play size={24} fill="currentColor"/></div>
                          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest italic">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                 ))
               ) : (
                 <div className="min-w-[85vw] md:min-w-[450px] aspect-square glass-luxury rounded-[3rem] flex flex-col items-center justify-center border-dashed border-white/20 snap-center">
                   <RefreshCw className="animate-spin text-[#40E0D0]/30 mb-4" size={48}/>
                   <span className="font-mono text-zinc-500 text-[10px] tracking-widest">ANIMATION VAULT LOADING...</span>
                 </div>
               )}
            </div>

            <div className="flex justify-between items-center px-4 mt-4 md:hidden opacity-60">
               <button onClick={() => scrollVault(animScrollRef, 'left')} className="p-3 glass-luxury rounded-full text-[#40E0D0] active:scale-90 transition-transform"><ChevronLeft size={24}/></button>
               <span className="text-[9px] tracking-[0.3em] uppercase font-mono">Swipe or Tap to Explore</span>
               <button onClick={() => scrollVault(animScrollRef, 'right')} className="p-3 glass-luxury rounded-full text-[#40E0D0] active:scale-90 transition-transform"><ChevronRight size={24}/></button>
            </div>
          </section>

          {/* 2. PROPOSALS */}
          <section className="mb-64 md:mb-96">
             <div className="text-center mb-24 md:mb-40 px-4">
               <h2 className="text-5xl md:text-9xl font-black uppercase tracking-tighter mb-4 italic font-serif">Proposals</h2>
               <p className="text-[#40E0D0] text-sm md:text-xl font-[Vazirmatn] font-bold">پروتکل‌های همکاری استراتژیک و تعرفه‌ها</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                {PRESET_PACKAGES.map(pkg => (
                  <div key={pkg.id} onClick={() => setPreviewPackage(pkg)} className={`p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] min-h-[500px] flex flex-col justify-between cursor-pointer border border-white/5 glass-luxury active:scale-95 transition-all ${pkg.type === 'Fusion' ? 'border-[#40E0D0]/30 shadow-[0_0_40px_rgba(64,224,208,0.05)]' : ''}`}>
                      <div>
                        <div className="mb-8 p-6 rounded-[2rem] inline-block bg-white/5 text-[#40E0D0]">{pkg.type === 'Quantum' ? <Gem size={32}/> : pkg.type === 'Fusion' ? <Atom size={32}/> : <Cpu size={32}/>}</div>
                        <h3 className="text-4xl md:text-5xl font-black mb-3 italic uppercase font-serif">{pkg.name}</h3>
                        <p className="text-[11px] text-[#40E0D0] mb-8 font-[Vazirmatn] leading-loose font-bold italic opacity-90">{pkg.slogan}</p>
                        <div className="text-3xl md:text-4xl font-black font-mono">{pkg.price} <span className="text-[10px] text-zinc-500">M T</span></div>
                      </div>
                      <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-50 font-mono">View Specs <Plus size={14}/></div>
                  </div>
                ))}
             </div>
          </section>

          {/* 3. NEURAL GRID */}
          <section className="mb-64">
            <div className="text-center mb-24 md:mb-32 px-4">
               <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-[#40E0D0]/10 text-[#40E0D0] border border-[#40E0D0]/30"><Bot size={18}/> <span className="text-[10px] font-black tracking-widest uppercase">Neural Core</span></div>
               <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 italic font-serif">Neural Grid</h2>
               <p className="text-zinc-500 tracking-[0.2em] uppercase text-[10px] font-black">ابزارهای هوشمند / Intelligence Modules</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {NEURAL_MODULES.map((module) => (
                <div key={module.id} className="p-8 md:p-10 rounded-[3rem] border border-white/5 glass-luxury flex flex-col h-[550px] relative overflow-hidden group shadow-2xl z-10">
                  <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black tracking-widest italic shadow-lg">FREE: {quotas[module.id] || 0}/{module.limit}</div>
                  <div className="mt-8 mb-6 text-[#40E0D0] bg-white/5 p-5 rounded-[2rem] w-fit shadow-lg">{module.icon}</div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">{module.title}</h3>
                  <p className="text-xs text-[#40E0D0] mb-4 font-[Vazirmatn] font-bold italic opacity-90">{module.fa_title}</p>
                  <p className="text-[11px] text-zinc-400 leading-loose mb-8 font-[Vazirmatn] opacity-70 line-clamp-3">{module.desc}</p>
                  <div className="mt-auto flex flex-col gap-4 relative z-20">
                    <textarea 
                      value={aiInputs[module.id] || ""}
                      onChange={(e) => setAiInputs({...aiInputs, [module.id]: e.target.value})} 
                      className="w-full bg-black/60 border border-white/10 p-4 rounded-[1.5rem] text-right text-xs text-white outline-none focus:border-[#40E0D0] h-24 resize-none transition-all placeholder:opacity-30" 
                      placeholder="درخواست خود را وارد کنید..."
                    />
                    <button onClick={() => handleAiExecute(module)} className="w-full py-4 bg-white text-black font-black text-[10px] tracking-[0.3em] rounded-[1.5rem] hover:bg-[#40E0D0] transition-all uppercase shadow-lg active:scale-95">
                      {isAiLoading[module.id] ? <RefreshCw className="animate-spin mx-auto" size={16}/> : 'Execute'}
                    </button>
                  </div>
                  {aiResults[module.id] && (
                    <div className="absolute inset-0 z-30 bg-black/98 rounded-[3rem] p-8 flex flex-col animate-in fade-in zoom-in duration-300">
                      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <span className="text-[#40E0D0] text-[9px] font-black font-mono tracking-widest">OUTPUT</span>
                        <button onClick={() => setAiResults({...aiResults, [module.id]: null})}><X size={20} className="text-zinc-500"/></button>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
                        {module.type === 'image' ? (
                          <>
                            <img src={aiResults[module.id]} className="w-full rounded-2xl border border-white/10 mb-6 shadow-2xl" alt="AI Generated" />
                            <button onClick={() => downloadImage(aiResults[module.id])} className="w-full py-3 bg-[#40E0D0] text-black rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 mt-4 hover:bg-white transition-colors">
                               <Download size={16}/> Download Masterpiece
                            </button>
                          </>
                        ) : (
                          <p className="text-sm text-zinc-200 font-[Vazirmatn] leading-relaxed text-right w-full" dir="rtl">{aiResults[module.id]}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        <button onClick={() => setShowChat(true)} className="fixed bottom-6 left-6 p-5 bg-[#40E0D0] text-black rounded-full shadow-[0_0_30px_rgba(64,224,208,0.4)] z-[200] active:scale-90 transition-all">
          <MessageSquare size={24} />
        </button>

        {showChat && (
          <div className="fixed bottom-24 left-6 w-[85vw] md:w-[380px] h-[500px] glass-luxury rounded-[2.5rem] border border-[#40E0D0]/30 z-[300] flex flex-col overflow-hidden shadow-3xl animate-in slide-in-from-bottom-10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/80">
              <div className="flex items-center gap-3"><Bot size={18} className="text-[#40E0D0]"/><span className="font-mono text-[10px] font-black uppercase tracking-widest">Sovereign Support</span></div>
              <button onClick={() => setShowChat(false)}><X size={18}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" dir="rtl">
              {chatLog.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-[Vazirmatn] leading-relaxed ${m.role === 'user' ? 'bg-white/10 text-white' : 'bg-[#40E0D0]/10 text-[#40E0D0]'}`}>{m.text}</div>
                </div>
              ))}
              {isChatLoading && <Loader2 className="animate-spin text-[#40E0D0] mx-auto" size={20}/>}
            </div>
            <div className="p-4 bg-black/60 border-t border-white/5 flex gap-2">
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-[Vazirmatn] outline-none text-white" placeholder="پیام..." />
              <button onClick={handleChat} className="p-3 bg-[#40E0D0] text-black rounded-xl"><Send size={16}/></button>
            </div>
          </div>
        )}

        {/* --- FOOTER (MOBILE FIXED) --- */}
        <footer className="mt-48 border-t border-white/5 bg-black py-24 text-center relative">
            <div className="flex flex-col items-center">
               <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                 <div className="order-1 md:order-3">
                    <h2 className="text-6xl md:text-9xl font-black leading-none tracking-tighter italic select-none silver-shine">REZIBEL</h2>
                    <p className="text-[#40E0D0] text-[10px] font-black tracking-[0.5em] uppercase mt-4 md:mt-6">Core Architect & Director</p>
                 </div>
                 <img src={CHARACTER_IMG} alt="Avatar" className="order-2 w-28 md:w-48 opacity-80 grayscale hover:grayscale-0 transition-all duration-700 animate-float drop-shadow-xl" />
                 <div className="order-3 md:order-1 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] glass-luxury border border-[#40E0D0]/20">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}&color=40E0D0&bgcolor=000&margin=2`} className="w-20 h-20 md:w-24 md:h-24 rounded-xl opacity-90" alt="QR" />
                 </div>
               </div>
            </div>
        </footer>
      </div>

      {/* --- MODALS --- */}
      {activeVideo && (
        <div className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl" onContextMenu={(e) => e.preventDefault()}>
          <button onClick={() => { setActiveVideo(null); bgMusic.current.play(); }} className="absolute top-6 left-6 p-4 glass-luxury rounded-full hover:bg-white hover:text-black z-50"><X size={24}/></button>
          <div className="w-full max-w-md aspect-[9/16] rounded-[3rem] overflow-hidden border border-[#40E0D0]/30 shadow-2xl relative bg-black">
            {videoLoading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-[#40E0D0]" size={40}/></div>}
            <video 
              controls 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover" 
              controlsList="nodownload" 
              poster={activeVideo.cover_url} 
              onLoadedData={() => setVideoLoading(false)}
            >
              <source src={activeVideo.video_url} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[6000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-2xl">
          <div className="w-full max-w-sm p-10 rounded-[3rem] glass-luxury text-center border border-white/10 relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X size={20}/></button>
            <Crown className="mx-auto text-[#40E0D0] mb-8" size={48}/>
            <form onSubmit={(e) => { e.preventDefault(); if(loginForm.user === ADMIN_CREDENTIALS.user && loginForm.pass === ADMIN_CREDENTIALS.pass) { setIsAdmin(true); setShowLoginModal(false); } else alert("ACCESS DENIED"); }}>
              <input className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-center mb-4 outline-none focus:border-[#40E0D0] text-white" placeholder="ID" value={loginForm.user} onChange={e=>setLoginForm({...loginForm, user:e.target.value})}/>
              <input className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-center mb-8 outline-none focus:border-[#40E0D0] text-white" type="password" placeholder="KEY" value={loginForm.pass} onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
              <button className="w-full py-5 bg-[#40E0D0] text-black font-black rounded-2xl uppercase tracking-widest text-xs mb-4">Authorize</button>
              <button type="button" onClick={() => setShowLoginModal(false)} className="text-zinc-500 text-[10px] tracking-widest uppercase">Abort Access</button>
            </form>
          </div>
        </div>
      )}

      {previewPackage && (
        <div className="fixed inset-0 z-[5000] bg-black/96 flex items-center justify-center p-6 backdrop-blur-3xl" onClick={() => setPreviewPackage(null)}>
           <div className="max-w-4xl w-full p-10 md:p-16 glass-luxury rounded-[4rem] text-right border border-[#40E0D0]/20 max-h-[85vh] overflow-y-auto shadow-2xl relative custom-scrollbar" onClick={e=>e.stopPropagation()}>
             <button onClick={() => setPreviewPackage(null)} className="absolute top-8 left-8 p-3 rounded-full hover:bg-white/10"><X size={24} className="text-zinc-400"/></button>
             <h2 className="text-4xl md:text-7xl font-black mb-4 text-white tracking-tighter italic uppercase">{previewPackage.name}</h2>
             <p className="text-lg text-[#40E0D0] mb-12 font-[Vazirmatn] border-b border-white/10 pb-8 font-bold">{previewPackage.slogan}</p>
             <div className="space-y-8" dir="rtl">{previewPackage.details.map((d,i) => (<div key={i} className="flex items-start gap-4 text-lg md:text-xl text-zinc-300 border-b border-white/5 pb-6"><CheckCircle2 className="text-[#40E0D0] mt-1 shrink-0" size={24}/> <div className="leading-relaxed">{formatPersianText(d)}</div></div>))}</div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
