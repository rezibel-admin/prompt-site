import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Trash2, X, Lock, LogOut, Crown, RefreshCw, Cpu, Atom, Gem, Briefcase, 
  Plus, CheckCircle2, ArrowUp, ArrowDown, Save, QrCode, Image as ImageIcon, 
  MessageSquare, Target, Wand2, Bot, Zap, Loader2, Volume2, VolumeX, ChevronRight, ChevronLeft, MousePointer2, Send, Download
} from 'lucide-react';

// --- CONFIG & CREDENTIALS ---
const supabaseUrl = 'https://bibgekufrjfokauiksca.supabase.co';
const supabaseKey = 'sb_publishable_7VSrrcDIUHhZaRgUPsEwkw_jfLxxVdc';
const ADMIN_CREDENTIALS = { user: "RezibelRr845", pass: "RezaRezibel13845" };

// ✅ کلید فعال‌سازی نهایی
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
  { id: 'quantum_script', title: 'Quantum Script', fa_title: 'مهندسی سناریوهای جریان‌ساز', limit: 3, icon: <MessageSquare size={28}/>, type: 'text', desc: 'موضوع محصول را بنویسید تا سناریوی سینمایی و اثرگذار دریافت کنید.' },
  { id: 'oracle', title: 'Oracle Strategy', fa_title: 'مشاور استراتژیک بازار', limit: 5, icon: <Target size={28}/>, type: 'text', desc: 'سوالات خود درباره رشد بیزنس را بپرسید.' },
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

  useEffect(() => {
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
      } catch (e) { console.log("Audio block"); }
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
          contents: [{ parts: [{ text: `Act as the Sovereign AI for REZIBEL. Tone: Professional, Luxury. User: ${chatInput}` }] }]
        })
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "خطا در پردازش.";
      setChatLog(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (e) {
      setChatLog(prev => [...prev, { role: 'bot', text: "ارتباط برقرار نشد. لطفا فیلترشکن خود را بررسی کنید." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAiExecute = async (module) => {
    const input = aiInputs[module.id];
    if (!input) return;
    const remaining = quotas[module.id] || 0;
    if (remaining <= 0 && !isAdmin) return alert("سهمیه روزانه تمام شده است.");

    setIsAiLoading(prev => ({ ...prev, [module.id]: true }));
    setAiResults(prev => ({ ...prev, [module.id]: null }));

    try {
      if (module.type === 'image') {
        const seed = Math.floor(Math.random() * 999999);
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(input)}?width=1024&height=1024&seed=${seed}&nologo=true`;
        // فچ کردن تصویر برای اطمینان از تولید
        const imgCheck = new Image();
        imgCheck.src = imageUrl;
        imgCheck.onload = () => {
           setAiResults(prev => ({ ...prev, [module.id]: imageUrl }));
           setIsAiLoading(prev => ({ ...prev, [module.id]: false }));
        };
      } else {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `Respond in Persian. Professional Creative Director tone. Prompt: ${input}` }] }] })
        });
        if (!response.ok) throw new Error();
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
      alert("خطا در برقراری ارتباط. فیلترشکن خود را چک کنید.");
      setIsAiLoading(prev => ({ ...prev, [module.id]: false }));
    }
  };

  const downloadImage = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "REZIBEL-Masterpiece.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white overflow-x-hidden font-sans selection:bg-[#40E0D0]/30 pb-20 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,700&family=JetBrains+Mono:wght@300;700&display=swap');
        @font-face { font-family: 'Vazirmatn'; src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2') format('woff2'); }
        body { font-family: 'Vazirmatn', sans-serif; background: #010101; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .glass-luxury { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .silver-shine { background: linear-gradient(90deg, #fff 0%, #a0a0a0 50%, #fff 100%); background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 3s infinite linear; }
        @keyframes shine { to { background-position: 200%; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #40E0D0; border-radius: 10px; }
      `}} />

      <img src={CHARACTER_IMG} alt="preload" className="hidden" fetchPriority="high" />

      {/* --- SPLASH SCREEN --- */}
      {!entered && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center cursor-pointer" onClick={initializeProtocol}>
          <div className="relative flex flex-col items-center justify-center mb-12 z-20 leading-none">
            <img src={CHARACTER_IMG} alt="Avatar" className="w-[45vw] md:w-[22vw] max-w-md animate-float mb-6 md:-mb-[2.5vw] relative z-10" />
            <h1 className="text-[18vw] md:text-[12rem] font-black tracking-tighter text-white italic z-10 drop-shadow-[0_0_30px_rgba(64,224,208,0.5)] leading-none">PROMPT</h1>
          </div>
          <div className="flex items-center gap-4 text-zinc-400 text-[10px] md:text-xs tracking-[0.5em] uppercase bg-white/5 px-6 py-3 rounded-full border border-white/10">
            <MousePointer2 size={16} className="text-[#40E0D0] animate-bounce"/> <span>Initialize Protocol</span>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        <nav className="p-6 md:p-10 flex justify-between items-center fixed top-0 w-full z-[100] backdrop-blur-xl bg-black/60 border-b border-white/5">
           <div className="flex gap-4">
             <button onClick={toggleMute} className="p-3 md:p-4 glass-luxury rounded-full">{isMuted ? <VolumeX className="text-red-500 w-5" /> : <Volume2 className="text-[#40E0D0] w-5" />}</button>
             <button onClick={() => setShowLoginModal(true)} className="p-3 md:p-4 glass-luxury rounded-full"><Lock className="w-5"/></button>
           </div>
           <div className="text-right">
             <div className="text-xl md:text-2xl font-black italic font-serif">PROMPT</div>
             <div className="text-[8px] md:text-[9px] tracking-[0.4em] text-[#40E0D0] font-bold">Sovereign Authority</div>
           </div>
        </nav>

        <main className="max-w-[1800px] mx-auto px-6 py-40">
          <header className="text-center">
            <h1 className="text-[12vw] md:text-[10rem] font-black tracking-tighter italic silver-shine leading-none uppercase">Visual<br />Supremacy</h1>
          </header>

          <div className="flex justify-center my-12 md:my-16 relative z-10 py-2">
             <img src={CHARACTER_IMG} alt="Avatar" className="w-[60vw] md:w-[35vw] max-w-[700px] opacity-90 animate-float drop-shadow-2xl" />
          </div>

          {/* NEURAL GRID */}
          <section className="mt-32">
            <div className="text-center mb-16">
               <h2 className="text-5xl md:text-8xl font-black uppercase italic font-serif mb-4">Neural Grid</h2>
               <p className="text-zinc-500 tracking-widest text-[10px]">INTELLIGENCE MODULES</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {NEURAL_MODULES.map((module) => (
                <div key={module.id} className="p-8 rounded-[3rem] glass-luxury flex flex-col h-[550px] relative overflow-hidden group">
                  <div className="absolute top-8 right-8 px-4 py-1 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black italic">FREE: {quotas[module.id] || 0}/{module.limit}</div>
                  <div className="mt-8 mb-6 text-[#40E0D0] bg-white/5 p-5 rounded-[2rem] w-fit">{module.icon}</div>
                  <h3 className="text-2xl font-black text-white uppercase italic mb-2">{module.title}</h3>
                  <p className="text-xs text-[#40E0D0] mb-4 font-bold italic">{module.fa_title}</p>
                  <p className="text-[11px] text-zinc-400 leading-loose mb-8 font-[Vazirmatn]">{module.desc}</p>
                  
                  <div className="mt-auto flex flex-col gap-4 relative z-20">
                    <textarea 
                      value={aiInputs[module.id] || ""}
                      onChange={(e) => setAiInputs({...aiInputs, [module.id]: e.target.value})} 
                      className="w-full bg-black/60 border border-white/10 p-4 rounded-[1.5rem] text-right text-xs text-white outline-none focus:border-[#40E0D0] h-24 resize-none transition-all" 
                      placeholder="درخواست خود را وارد کنید..."
                    />
                    <button onClick={() => handleAiExecute(module)} className="w-full py-4 bg-white text-black font-black text-[10px] tracking-[0.3em] rounded-[1.5rem] uppercase active:scale-95 transition-all">
                      {isAiLoading[module.id] ? <RefreshCw className="animate-spin mx-auto" size={16}/> : 'Execute'}
                    </button>
                  </div>

                  {aiResults[module.id] && (
                    <div className="absolute inset-0 z-30 bg-black/98 rounded-[3rem] p-8 flex flex-col animate-in fade-in zoom-in duration-300">
                      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <span className="text-[#40E0D0] text-[9px] font-black tracking-widest uppercase">Result Generated</span>
                        <button onClick={() => setAiResults({...aiResults, [module.id]: null})}><X size={20} className="text-zinc-500"/></button>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
                        {module.type === 'image' ? (
                          <>
                            <img src={aiResults[module.id]} className="w-full rounded-2xl border border-white/10 mb-6 shadow-2xl" alt="AI Masterpiece" />
                            <button onClick={() => downloadImage(aiResults[module.id])} className="w-full py-3 bg-[#40E0D0] text-black rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2">
                               <Download size={16}/> Download Masterpiece
                            </button>
                          </>
                        ) : (
                          <p className="text-sm text-zinc-200 font-[Vazirmatn] leading-relaxed text-right" dir="rtl">{aiResults[module.id]}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        <button onClick={() => setShowChat(true)} className="fixed bottom-8 left-8 p-5 bg-[#40E0D0] text-black rounded-full shadow-2xl z-[200] active:scale-90 transition-all">
          <MessageSquare size={24} />
        </button>

        {showChat && (
          <div className="fixed bottom-24 left-8 w-[85vw] md:w-[400px] h-[500px] glass-luxury rounded-[2.5rem] border border-[#40E0D0]/30 z-[300] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/80">
              <div className="flex items-center gap-3"><Bot size={18} className="text-[#40E0D0]"/><span className="text-[10px] font-black uppercase">Sovereign Support</span></div>
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
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleChat()} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-[Vazirmatn] outline-none text-white" placeholder="پیام شما..." />
              <button onClick={handleChat} className="p-3 bg-[#40E0D0] text-black rounded-xl"><Send size={16}/></button>
            </div>
          </div>
        )}

        <footer className="mt-48 border-t border-white/5 bg-black py-24 text-center">
            <div className="flex flex-col items-center">
               <div className="flex flex-col md:flex-row items-center gap-10">
                 <div className="order-1 md:order-3">
                    <h2 className="text-6xl md:text-9xl font-black italic silver-shine leading-none">REZIBEL</h2>
                    <p className="text-[#40E0D0] text-[10px] tracking-[0.5em] uppercase mt-4">Core Architect & Director</p>
                 </div>
                 <img src={CHARACTER_IMG} alt="Avatar" className="order-2 w-32 md:w-48 opacity-80 grayscale hover:grayscale-0 transition-all duration-700 animate-float" />
                 <div className="order-3 md:order-1 p-6 glass-luxury rounded-[2rem]">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}&color=40E0D0&bgcolor=000&margin=2`} className="w-24 h-24 rounded-xl" alt="QR" />
                 </div>
               </div>
            </div>
        </footer>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-[6000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-2xl">
          <div className="w-full max-w-sm p-10 rounded-[3rem] glass-luxury text-center border border-white/10">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-zinc-500"><X size={20}/></button>
            <Crown className="mx-auto text-[#40E0D0] mb-8" size={48}/>
            <form onSubmit={(e) => { e.preventDefault(); if(loginForm.user === ADMIN_CREDENTIALS.user && loginForm.pass === ADMIN_CREDENTIALS.pass) { setIsAdmin(true); setShowLoginModal(false); } else alert("ACCESS DENIED"); }}>
              <input className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-center mb-4 outline-none text-white" placeholder="ID" value={loginForm.user} onChange={e=>setLoginForm({...loginForm, user:e.target.value})}/>
              <input className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-center mb-8 outline-none text-white" type="password" placeholder="KEY" value={loginForm.pass} onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
              <button className="w-full py-5 bg-[#40E0D0] text-black font-black rounded-2xl uppercase tracking-widest text-xs">Authorize</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
