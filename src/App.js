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

// --- OPTIMIZED PSYCHOLOGICAL PACKAGES ---
const PRESET_PACKAGES = [
  { id: 'pkg_core', name: 'CORE', display_title: 'CORE', price: '25', type: 'Core', details: [
    "خلق اثر شاخص سینمایی: تدوین یک خروجی بصری با استانداردهای نوری پیشرفته بین‌المللی؛ برای تثبیتِ پرستیژ برند در اولین نگاه مخاطب.",
    "۵ فریم عکاسی تراز اول 4K (همراه با تجهیزات تخصصی نورپردازی و لنز ماکرو!): ثبت جزئیات محصول با وضوحِ میکروسکوپی؛ تبدیل کالای شما به یک دارایی ارزشمند.",
    "۴ اپیزود سنتز هوشمند بصری: بهره‌گیری از هوش مصنوعی برای خلق ۱ قسمت انیمیشن مفهومی و ۳ محتوای استراتژیک.",
    "تلفیق ساختاری (AI Hybrid Integration): کیمیاگری در تدوین؛ ترکیب ریاضیاتیِ ویدیوهای رئال با لایه‌های بصری هوش مصنوعی.",
    "معماری سناریو (Narrative Engineering): تدوین استراتژیک سناریوهای روانشناختی که مستقیماً بخش تصمیم‌گیرنده‌ی ذهن مخاطب را هدف قرار می‌دهد.",
    "مدیریت تعامل و چرخه فروش: هدایت هوشمندانه مخاطب در مسیر خرید با رعایت اصول متقاعدسازی حرفه‌ای.",
    "هویت‌بخشی بصری: معماری ویترین پیج و طراحی تمپلیت‌های اختصاصی که اعتبار بیزنس شما را دیکته می‌کند."
  ]},
  { id: 'pkg_fusion', name: 'FUSION', display_title: 'FUSION', price: '45', type: 'Fusion', details: [
    "هم‌افزایی استراتژیک: نقطه تلاقی حاکمیتِ بصری و پردازش الگوریتمیک برای تسلطِ بی‌قید و شرط بر بازار.",
    "۴ خروجیِ ویدئوییِ شاخص: مهندسی ۴ ویدئوی حرفه‌ای که یکی از آن‌ها به صورت اختصاصی با عملیات پروازی FPV جهت نمایش ابهت مجموعه‌ی شما رکورد می‌شود.",
    "۱۰ فریم عکاسی صنعتی/تبلیغاتی: ایجاد یک آرشیو بصریِ غنی و خیره‌کننده برای تمام بخش‌های بیزنس.",
    "۸ محتوای سنتز شده (AI Fusion Content): ۳ اپیزود انیمیشن سریالی با سناریوی پیوسته + ۵ ویدئوی تبلیغاتی تراز اول.",
    "امضای بصری پویا (Dynamic Identity): طراحی لوگوموشنی که هویت برند را در ناخودآگاه مخاطب حک می‌کند.",
    "پروتکل سئو بصری: مهندسی کپشن و بهینه‌سازی تصاویر برای تضمینِ حضور در اکسپلور."
  ]},
  { id: 'pkg_quantum', name: 'QUANTUM', display_title: 'QUANTUM', price: '85', type: 'Quantum', details: [
    "حاکمیت ابدی در فضای دیجیتال: پکیجی برای رهبرانی که به چیزی جز «نفر اول بودن» قانع نیستند.",
    "۸ اپیزود تولید محتوای سینمایی: شامل ۲ محتوای ویژه با تصویربرداری هوایی FPV برای خلق ویدیوهایی در سطح فیلم‌های تراز اول جهانی.",
    "۲۰ فریم عکاسی اشرافی: نمایش شکوه بیزنس با دقتی که اعتمادِ سخت‌گیرترین مشتریان را جلب می‌کند.",
    "۱۲ شاهکار سنتز هوشمند (Total AI Domination): ۴ اپیزود انیمیشن سینمایی + ۸ ویدئوی هدفمند؛ پوشش کامل تمام نیازهای بصری سالانه در یک ماه.",
    "مهندسی بیزنس‌پلان اختصاصی: تدوین استراتژی‌های کلان برای تبدیلِ «بیننده» به «سرمایه».",
    "خلق سفیر مجازی برند (Virtual Influencer): طراحی یک شخصیت دیجیتال اختصاصی که به نمادِ فناناپذیر برند شما تبدیل می‌شود."
  ]},
  { id: 'pkg_tactical', name: 'TACTICAL', display_title: 'خدمات تکی', price: 'Variable', type: 'Tactical', details: [
    "واحد انیمیشن‌سازی اختصاصی: ساخت دنیایی بدون محدودیت‌های فیزیکی؛ از سناریو تا کارگردانی صوتی.",
    "اقتدار محلی (Google Map SEO): تثبیت جایگاه در ۳ لینک اول گوگل؛ جایی که مشتریانِ واقعی به دنبال شما می‌گردند.",
    "تک-اپیزود ریلز (Fast Strike): اعزام تیمِ ضربت بصری همراه با تجهیزات کامل برای خلق یک محتوای وایرال.",
    "فریم‌های 4K پرستیژ: ثبت تصاویرِ ایزوله و نوری که ارزشِ واقعی کالا را به رخ می‌کشد.",
    "تخت پادشاهی دیجیتال (Web Architecture): طراحی وب‌سایتی که فراتر از یک سایت، قلبِ تپنده‌ی امپراتوری شماست."
  ]}
];

const NEURAL_MODULES = [
  { id: 'visual_engine', title: 'Visual Engine', fa_title: 'موتور تصویرسازی هوشمند', limit: 5, icon: <ImageIcon size={24}/>, desc: 'توصیف صحنه را بنویسید تا هوش مصنوعی آن را به تصویر تبدیل کند.' },
  { id: 'quantum_script', title: 'Quantum Script', fa_title: 'مهندسی سناریوهای ویروسی', limit: 3, icon: <MessageSquare size={24}/>, desc: 'موضوع محصول را بنویسید تا سناریوی ویروسی دریافت کنید.' },
  { id: 'oracle', title: 'Oracle Strategy', fa_title: 'مشاور استراتژیک بازار', limit: 5, icon: <Target size={24}/>, desc: 'سوالات خود درباره رشد پیج را بپرسید.' },
  { id: 'nexus', title: 'Nexus Protocol', fa_title: 'پروتکل نگارش رسمی', limit: 10, icon: <Wand2 size={24}/>, desc: 'تبدیل متن ساده به اداری و با پرستیژ.' }
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
        
        /* Luxurious Liquid Silver Smoke Effect */
        .halo-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }
        .halo-1 { position: absolute; top: -15%; left: -10%; width: 70%; height: 70%; background: radial-gradient(circle, rgba(192,192,192,0.07) 0%, transparent 70%); animation: smoke 25s infinite alternate; }
        .halo-2 { position: absolute; bottom: -15%; right: -10%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(64,224,208,0.04) 0%, transparent 70%); animation: smoke 30s infinite alternate-reverse; }
        @keyframes smoke { from { transform: translate(0,0) rotate(0deg) scale(1); } to { transform: translate(15%, 15%) rotate(10deg) scale(1.2); } }
        
        .glass-luxury { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .responsive-title { font-size: clamp(2.8rem, 14vw, 11rem); line-height: 0.9; }
        
        /* Anti-Download Settings */
        video::-internal-media-controls-download-button { display:none; }
        video::-webkit-media-controls-enclosure { overflow:hidden; }
        video::-webkit-media-controls-panel { width: calc(100% + 30px); }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .pulse-neon { animation: pulse-n 2s infinite; }
        @keyframes pulse-n { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
        
        .gold-glow { box-shadow: 0 0 20px rgba(212, 175, 55, 0.15); border-color: rgba(212, 175, 55, 0.3); }
      `}} />

      <div className="halo-bg">
        <div className="halo-1" /><div className="halo-2" />
      </div>

      {!entered && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center cursor-pointer" onClick={initializeProtocol}>
          <h1 className="responsive-title font-black tracking-tighter text-white italic mb-12 animate-pulse uppercase">PROMPT</h1>
          <div className="flex items-center gap-4 text-zinc-500 text-[11px] tracking-[0.6em] uppercase">
            <MousePointer2 size={18}/> <span>Initialize Sovereign Protocol</span>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        
        <nav className="p-6 md:p-10 flex justify-between items-center fixed top-0 w-full z-[100] backdrop-blur-3xl bg-black/30 border-b border-white/5">
           <div className="flex gap-4">
             <button onClick={() => setIsMuted(!isMuted)} className="p-3 glass-luxury rounded-full shadow-xl">
               {isMuted ? <VolumeX className="text-red-500" /> : <Volume2 className="text-[#40E0D0]" />}
             </button>
             <button onClick={() => setShowLoginModal(true)} className="p-3 glass-luxury rounded-full hover:text-[#40E0D0] transition-colors shadow-xl">
               <Lock size={20}/>
             </button>
           </div>
           <div className="text-right">
             <div className="text-xl md:text-2xl font-black tracking-tighter italic">PROMPT</div>
             <div className="text-[7px] tracking-[0.5em] text-[#40E0D0] uppercase italic font-bold">Sovereign Authority</div>
           </div>
        </nav>

        <main className="max-w-[1900px] mx-auto px-6 py-40">
          <header className="text-center mb-64">
            <h1 className="responsive-title font-black tracking-tighter uppercase select-none italic">
              VISUAL <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] via-white to-[#40E0D0] bg-[length:200%_auto] animate-[shimmer_5s_linear_infinite]">SUPREMACY</span>
            </h1>
          </header>

          {/* 1. ARCHIVES (HORIZONTAL + HALF-CARD PEEK) */}
          <section className="mb-80 relative group">
            <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-10">
               <h2 className="text-4xl md:text-7xl font-black tracking-tight uppercase italic">Archives</h2>
               <p className="text-[#40E0D0] tracking-[0.5em] text-[10px] uppercase font-bold">Neural Cinematic Repository</p>
            </div>
            
            {/* Nav Arrows for Desktop */}
            <div className="absolute top-[60%] -left-6 z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
              <button onClick={() => scroll('left')} className="p-7 glass-luxury rounded-full text-[#40E0D0] hover:bg-[#40E0D0] hover:text-black shadow-2xl"><ChevronLeft size={36}/></button>
            </div>
            <div className="absolute top-[60%] -right-6 z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
              <button onClick={() => scroll('right')} className="p-7 glass-luxury rounded-full text-[#40E0D0] hover:bg-[#40E0D0] hover:text-black shadow-2xl"><ChevronRight size={36}/></button>
            </div>

            <div 
              ref={scrollRef} 
              className="flex gap-10 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10 px-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {portfolio.map((item) => (
                <div key={item.id} className="min-w-[82vw] md:min-w-[480px] aspect-[9/16] md:aspect-[3/4] rounded-[4.5rem] overflow-hidden border border-white/5 glass-luxury snap-center transition-all duration-700 hover:scale-[1.02] hover:border-[#40E0D0]/40 relative group/card shadow-3xl">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => handleVideoOpen(item)}>
                    <img src={item.cover_url} className="w-full h-full object-cover opacity-60 group-hover/card:opacity-100 transition-all duration-1000 grayscale group-hover/card:grayscale-0" alt=""/>
                    <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black/95 via-transparent">
                      <div className="w-16 h-16 rounded-full border border-[#40E0D0]/50 flex items-center justify-center text-[#40E0D0] mb-6 backdrop-blur-2xl group-hover/card:bg-[#40E0D0] group-hover/card:text-black transition-all">
                        <Play size={24} fill="currentColor"/>
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-widest italic">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile Nav Indicators */}
            <div className="md:hidden flex justify-center items-center gap-6 mt-6 opacity-40">
              <ChevronLeft size={16} className="text-[#40E0D0] pulse-neon" />
              <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-zinc-500">Swipe to Explore Archives</span>
              <ChevronRight size={16} className="text-[#40E0D0] pulse-neon" />
            </div>
          </section>

          {/* 2. PROPOSALS (PSYCHOLOGICALLY OPTIMIZED) */}
          <section className="mb-80 relative">
             <div className="text-center mb-32">
               <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">Proposals</h2>
               <p className="text-zinc-500 tracking-[0.5em] uppercase text-[9px] font-black italic">Elite Strategic Alliance Packages</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
                {PRESET_PACKAGES.map(pkg => (
                  <div key={pkg.id} onClick={() => setPreviewPackage(pkg)} className={`p-12 rounded-[4rem] min-h-[580px] flex flex-col justify-between cursor-pointer border border-white/5 glass-luxury hover:bg-white/5 transition-all duration-700 ${pkg.type === 'Fusion' ? 'border-[#40E0D0]/40 scale-105 z-10 bg-[#40E0D0]/5 shadow-[0_0_50px_rgba(64,224,208,0.05)]' : ''} ${pkg.type === 'Quantum' ? 'gold-glow' : ''}`}>
                      <div>
                        <div className={`mb-10 p-6 rounded-[2rem] inline-block ${pkg.type === 'Fusion' ? 'bg-[#40E0D0]/20 text-[#40E0D0]' : 'bg-white/5 text-zinc-400'} ${pkg.type === 'Quantum' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : ''}`}>
                          {pkg.type === 'Core' && <Cpu size={32}/>}{pkg.type === 'Fusion' && <Atom size={32}/>}{pkg.type === 'Quantum' && <Gem size={32} />}{pkg.type === 'Tactical' && <Briefcase size={32}/>}
                        </div>
                        <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">{pkg.display_title}</h3>
                        <div className={`text-4xl font-black ${pkg.type === 'Quantum' ? 'text-[#D4AF37]' : 'text-[#40E0D0]'}`}>
                          {pkg.price} <span className="text-[11px] text-white opacity-40 uppercase font-bold">M T</span>
                        </div>
                      </div>
                      <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-all">Protocol Specs <Plus size={16} className="text-[#40E0D0]"/></div>
                  </div>
                ))}
             </div>
          </section>

          {/* 3. NEURAL GRID (AI TOOLS WITH FREE TAG) */}
          <section className="mb-64 relative">
            <div className="text-center mb-32">
               <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-[#40E0D0]/10 text-[#40E0D0] border border-[#40E0D0]/30 animate-pulse">
                 <Bot size={20}/> <span className="text-xs font-black tracking-widest uppercase">Neural Core Active</span>
               </div>
               <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 italic">Neural Grid</h2>
               <p className="text-zinc-500 tracking-[0.4em] uppercase text-[10px] font-black italic">Intelligence Modules / ابزارهای هوشمند</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {NEURAL_MODULES.map((module) => (
                <div key={module.id} className="p-10 rounded-[4rem] border border-white/5 glass-luxury hover:border-[#40E0D0]/60 transition-all duration-500 flex flex-col h-[580px] relative overflow-hidden group shadow-2xl">
                  {/* Gold FREE Badge */}
                  <div className="absolute top-8 right-8 px-4 py-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-black tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.2)]">FREE ACCESS</div>
                  
                  <div className="mt-10 mb-8 text-[#40E0D0] bg-white/5 p-6 rounded-[2rem] w-fit group-hover:scale-110 transition-transform duration-500 shadow-lg">{module.icon}</div>
                  <h3 className="text-2xl font-black text-white uppercase italic">{module.title}</h3>
                  <p className="text-[13px] text-[#40E0D0] mb-5 font-[Vazirmatn] font-bold tracking-tight">{module.fa_title}</p>
                  <p className="text-xs text-zinc-400 leading-loose mb-12 font-[Vazirmatn]">{module.desc}</p>
                  
                  <div className="mt-auto flex flex-col gap-5">
                    <textarea className="w-full bg-black/40 border border-white/10 p-5 rounded-[1.5rem] text-right text-xs text-white outline-none focus:border-[#40E0D0] h-28 resize-none transition-all placeholder:opacity-30" placeholder="متن خود را وارد کنید..."/>
                    <button className="w-full py-5 bg-white text-black font-black text-[11px] tracking-[0.4em] rounded-[1.5rem] hover:bg-[#40E0D0] transition-all uppercase shadow-2xl">Execute Protocol</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-64 border-t border-white/5 bg-[#010101] py-40 text-center md:text-right relative">
            <div className="max-w-[1900px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-24">
               <div className="p-10 rounded-[4.5rem] glass-luxury border border-[#40E0D0]/20 group transition-all duration-1000 hover:border-[#40E0D0] shadow-3xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}&color=40E0D0&bgcolor=000&margin=2`} className="w-28 h-28 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity" alt="Sovereign QR" />
               </div>
               <div>
                  <h2 className="text-8xl md:text-[14rem] font-black leading-none tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-900 select-none">REZIBEL</h2>
                  <p className="text-[#40E0D0] text-[11px] font-black tracking-[0.6em] uppercase mt-12 italic">Core Architect & Sovereign Director</p>
                  <p className="text-[9px] text-zinc-800 tracking-[0.7em] uppercase mt-24 font-bold">© 2026 Sovereign Authority | Visual Hegemony Reserved</p>
               </div>
            </div>
        </footer>
      </div>

      {/* --- MODALS (ANTI-DOWNLOAD ENFORCED) --- */}
      {activeVideo && (
        <div className="fixed inset-0 z-[5000] bg-black/99 flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl" onContextMenu={(e) => e.preventDefault()}>
          <button onClick={handleVideoClose} className="absolute top-8 left-8 md:top-12 md:left-12 p-6 glass-luxury rounded-full hover:bg-white hover:text-black z-50 transition-all duration-500 shadow-3xl border-[#40E0D0]/20"><X size={36}/></button>
          <div className="w-full max-w-lg aspect-[9/16] rounded-[4.5rem] overflow-hidden border border-[#40E0D0]/30 shadow-[0_0_200px_rgba(64,224,208,0.2)] relative">
            {videoLoading && <div className="absolute inset-0 flex items-center justify-center bg-[#020202] z-10"><Loader2 className="animate-spin text-[#40E0D0]" size={56}/></div>}
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

      {showLoginModal && (
        <div className="fixed inset-0 z-[6000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="w-full max-w-md p-16 rounded-[4.5rem] glass-luxury text-center shadow-[0_0_100px_rgba(64,224,208,0.1)]">
            <Crown className="mx-auto text-[#40E0D0] mb-12 animate-pulse" size={64}/>
            <form onSubmit={(e) => { e.preventDefault(); if(loginForm.user === ADMIN_CREDENTIALS.user && loginForm.pass === ADMIN_CREDENTIALS.pass) { setIsAdmin(true); setShowLoginModal(false); } else alert("ACCESS DENIED BY SOVEREIGN SYSTEM"); }}>
              <input className="w-full bg-black/50 border border-white/10 p-6 rounded-[1.5rem] text-center mb-6 outline-none focus:border-[#40E0D0] transition-all font-mono tracking-widest" placeholder="ADMIN_ID" value={loginForm.user} onChange={e=>setLoginForm({...loginForm, user:e.target.value})}/>
              <input className="w-full bg-black/50 border border-white/10 p-6 rounded-[1.5rem] text-center mb-10 outline-none focus:border-[#40E0D0] transition-all font-mono" type="password" placeholder="VAULT_KEY" value={loginForm.pass} onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
              <button className="w-full py-6 bg-[#40E0D0] text-black font-black rounded-[1.5rem] uppercase tracking-[0.5em] text-[11px] hover:bg-white transition-all duration-700">Authorize Entry</button>
            </form>
          </div>
        </div>
      )}

      {previewPackage && (
        <div className="fixed inset-0 z-[5000] bg-black/96 flex items-center justify-center p-6 backdrop-blur-2xl" onClick={() => setPreviewPackage(null)}>
           <div className="max-w-5xl w-full p-16 glass-luxury rounded-[5rem] text-right border border-[#40E0D0]/20 max-h-[88vh] overflow-y-auto shadow-[0_0_100px_rgba(64,224,208,0.1)] relative" onClick={e=>e.stopPropagation()}>
             <h2 className="text-5xl md:text-8xl font-black mb-16 text-white tracking-tighter italic uppercase border-b border-white/5 pb-8">{previewPackage.display_title}</h2>
             <div className="space-y-8" dir="rtl">
               {previewPackage.details.map((d,i) => (
                 <div key={i} className="flex items-start gap-6 text-xl md:text-2xl text-zinc-300 border-b border-white/5 pb-8 hover:text-[#40E0D0] transition-colors duration-500">
                   <CheckCircle2 className="text-[#40E0D0] mt-1 shrink-0" size={28}/> 
                   <div className="leading-relaxed">{formatPersianText(d)}</div>
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
