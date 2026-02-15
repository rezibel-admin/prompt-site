import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Trash2, X, Lock, LogOut, Crown, Hexagon, Star, 
  RefreshCw, Cpu, Atom, Gem, Briefcase, Plus, CheckCircle2, ShieldCheck, 
  MousePointer2, ArrowUp, ArrowDown, Save, QrCode, Image as ImageIcon, 
  MessageSquare, Target, Wand2, Sparkles, Bot, Zap, Loader2
} from 'lucide-react';

// --- CONFIG ---
const supabaseUrl = 'https://bibgekufrjfokauiksca.supabase.co';
const supabaseKey = 'sb_publishable_7VSrrcDIUHhZaRgUPsEwkw_jfLxxVdc';
const ADMIN_CREDENTIALS = { user: "RezibelRr845", pass: "RezaRezibel13845" };

const apiKey = ""; // کلید جمینای (در صورت نیاز)

// --- HELPER: PERSIAN TEXT FORMATTER ---
const formatPersianText = (text) => {
  if (!text) return "";
  const parts = text.split(/(\d+(?:[\.\-\/]\d+)?(?:\s*[xX]|\s*K|\s*s|\s*m|\s*م)?|AI|FPV|T|M|4K|Sales|Admin|SEO)/g);
  return parts.map((part, i) => {
    if (/(\d+(?:[\.\-\/]\d+)?(?:\s*[xX]|\s*K|\s*s|\s*m|\s*م)?|AI|FPV|T|M|4K|Sales|Admin|SEO)/g.test(part)) {
      return <span key={i} dir="ltr" className="inline-block px-1 font-sans font-bold text-[#40E0D0]">{part}</span>;
    }
    return part;
  });
};

// --- DATA SOURCE (BACKUP) ---
const FIXED_SAMPLES = [
  {"id":1,"title":"project1","video_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/0108%281%29.mp4","cover_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/Screenshot%202026-02-14%20203434.png"},
  {"id":2,"title":"project2","video_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/0103%20%282%29.mp4","cover_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/Screenshot%202026-02-14%20204038.png"},
  {"id":3,"title":"project3","video_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/1230.mp4","cover_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/Screenshot%202026-02-14%20204419.png"},
  {"id":4,"title":"project4","video_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/video_2026-02-02_03-09-11.mp4","cover_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/Screenshot%202026-02-15%20012727.png"},
  {"id":5,"title":"project5","video_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/0206.mp4","cover_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/Screenshot%202026-02-15%20012919.png"},
  {"id":6,"title":"project6","video_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/0211.mp4","cover_url":"https://prompt-cinematic-vault.s3.ir-thr-at1.arvanstorage.ir/Screenshot%202026-02-15%20013056.png"}
];

// --- LUXURY PACKAGES DATA ---
const PRESET_PACKAGES = [
  { id: 'pkg_core', name: 'CORE', display_title: 'CORE', price: '25', type: 'Core', details: ["۱ عدد تصویربرداری حضوری (سینمایی)", "۵ شات عکاسی 4K صنعتی", "۴ عدد ویدئو با AI (۱ قسمت انیمیشن)", "ترکیب ویدیو با AI", "سناریونویسی خلاقانه", "آنالیز و گزارش رشد", "ادمینی و فروش", "ویترین‌سازی پیج"] },
  { id: 'pkg_fusion', name: 'FUSION', display_title: 'FUSION', price: '45', type: 'Fusion', details: ["۴ عدد تصویربرداری حضوری (شامل FPV)", "۱۰ شات عکاسی 4K صنعتی", "ترکیب حرفه‌ای ویدیو با AI", "۸ عدد ویدئو با AI (۳ قسمت انیمیشن سناریودار)", "سناریونویسی و تدوین استراتژیک", "لوگو و لوگوموشن (هویت بصری)", "سئو تصویری استراتژیک", "مدیریت کامل ادمینی و فروش"] },
  { id: 'pkg_quantum', name: 'QUANTUM', display_title: 'QUANTUM', price: '85', type: 'Quantum', details: ["۸ عدد تصویربرداری حضوری (شامل FPV)", "۲۰ شات عکاسی 4K سینمایی", "۱۲ عدد ویدئو با AI (۴ قسمت انیمیشن سناریودار)", "ترکیب فوق پیشرفته ویدیو با AI", "طراحی بیزنس‌پلن اختصاصی", "سفیر برند مجازی (Virtual Influencer)", "مدیریت استراتژیک فروش و سئو", "هویت بصری و ویترین‌سازی کامل"] },
  { id: 'pkg_tactical', name: 'TACTICAL', display_title: 'خدمات تکی', price: 'Variable', type: 'Tactical', details: ["تولید انیمیشن اختصاصی (۵ تا ۱۰ میلیون T)", "مدیریت تخصصی گوگل‌مپ (۸ میلیون T)", "پکیج فیلمبرداری تک جلسه (۴ میلیون T)", "هر شات عکس 4K (دویست هزار T)", "طراحی و پشتیبانی سایت (۸ تا ۲۰ میلیون T)"] }
];

// --- NEURAL MODULES CONFIG ---
const NEURAL_MODULES = [
  { id: 'visual_engine', title: 'Visual Engine', fa_title: 'موتور تصویرسازی', limit: 5, icon: <ImageIcon size={24}/>, desc: 'توصیف صحنه را بنویسید تا هوش مصنوعی آن را به تصویر تبدیل کند.', type: 'image' },
  { id: 'quantum_script', title: 'Quantum Script', fa_title: 'سناریو نویس', limit: 3, icon: <MessageSquare size={24}/>, desc: 'موضوع محصول یا ریلز را بنویسید تا سناریوی ویروسی دریافت کنید.', type: 'text' },
  { id: 'oracle', title: 'Oracle Strategy', fa_title: 'مشاور استراتژیک', limit: 5, icon: <Target size={24}/>, desc: 'سوالات خود درباره رشد پیج و فروش را بپرسید.', type: 'text' },
  { id: 'nexus', title: 'Nexus Protocol', fa_title: 'نگارش رسمی', limit: 10, icon: <Wand2 size={24}/>, desc: 'متن ساده را به متن اداری و با پرستیژ تبدیل می‌کند.', type: 'text' }
];

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [entered, setEntered] = useState(false);
  const [portfolio, setPortfolio] = useState(FIXED_SAMPLES);
  const [activeVideo, setActiveVideo] = useState(null);
  const [previewPackage, setPreviewPackage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [supabase, setSupabase] = useState(null);

  // AI & Video States
  const [quotas, setQuotas] = useState({});
  const [aiInputs, setAiInputs] = useState({});
  const [aiResults, setAiResults] = useState({});
  const [isAiLoading, setIsAiLoading] = useState({});
  const [videoLoading, setVideoLoading] = useState(true); // New state for video buffering

  // Supabase Init
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

  // Fetch Data & Init Quotas
  useEffect(() => {
    if (supabase) {
      const fetchData = async () => {
        const { data: archives } = await supabase.from('archives').select('*').order('order_index', { ascending: true });
        if (archives && archives.length > 0) setPortfolio(archives);
      };
      fetchData();
    }
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('neural_quotas') || '{}');
    if (stored.date !== today) {
      const initialQuotas = {};
      NEURAL_MODULES.forEach(m => initialQuotas[m.id] = m.limit);
      setQuotas(initialQuotas);
      localStorage.setItem('neural_quotas', JSON.stringify({ date: today, usage: initialQuotas }));
    } else {
      setQuotas(stored.usage);
    }
  }, [supabase]);

  // --- ACTIONS ---
  const handleLogout = () => {
    setIsAdmin(false);
    alert("LOGGED OUT. Entering User Mode.");
  };

  const moveVideo = (index, direction) => {
    const newPortfolio = [...portfolio];
    if (direction === 'up' && index > 0) {
      [newPortfolio[index], newPortfolio[index - 1]] = [newPortfolio[index - 1], newPortfolio[index]];
    } else if (direction === 'down' && index < newPortfolio.length - 1) {
      [newPortfolio[index], newPortfolio[index + 1]] = [newPortfolio[index + 1], newPortfolio[index]];
    }
    setPortfolio(newPortfolio);
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("WARNING: Are you sure you want to PERMANENTLY remove this video?")) return;
    setPortfolio(prev => prev.filter(v => v.id !== id));
    if (supabase) {
      const { error } = await supabase.from('archives').delete().eq('id', id);
      if (error) alert("Error deleting from DB: " + error.message);
    }
  };

  const saveToDB = async () => {
    if (!supabase) return;
    const confirmSave = window.confirm("Save current video order to Database?");
    if (!confirmSave) return;
    const updates = portfolio.map((item, index) => ({ ...item, order_index: index }));
    const { error } = await supabase.from('archives').upsert(updates);
    if (error) alert("Save Failed: " + error.message);
    else alert("DATABASE SYNCED SUCCESSFULLY.");
  };

  // --- AI HANDLER ---
  const handleAiExecute = async (module) => {
    const input = aiInputs[module.id];
    if (!input) return;
    
    // Check Quota
    if (quotas[module.id] <= 0 && !isAdmin) {
      alert("DAILY LIMIT REACHED. Please wait for neural recharge.");
      return;
    }

    setIsAiLoading(prev => ({ ...prev, [module.id]: true }));
    setAiResults(prev => ({ ...prev, [module.id]: null }));

    try {
      if (module.type === 'image') {
        // Image Generation (Using Pollinations AI for frontend demo - No Key needed)
        const seed = Math.floor(Math.random() * 10000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(input)}?seed=${seed}&width=1024&height=1024&nologo=true`;
        // Simulate loading
        await new Promise(r => setTimeout(r, 1500)); 
        setAiResults(prev => ({ ...prev, [module.id]: imageUrl }));
      } else {
        // Text Generation (Gemini)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
            systemInstruction: { parts: [{ text: "You are the Sovereign AI of PROMPT Holding. Respond in Persian. Be concise, professional, and strategic." }] }
          })
        });
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "خطا در دریافت پاسخ.";
        setAiResults(prev => ({ ...prev, [module.id]: text }));
      }

      // Update Quota
      if (!isAdmin) {
        const newQuotas = { ...quotas, [module.id]: quotas[module.id] - 1 };
        setQuotas(newQuotas);
        localStorage.setItem('neural_quotas', JSON.stringify({ date: new Date().toDateString(), usage: newQuotas }));
      }

    } catch (e) {
      alert("AI Error: " + e.message);
    } finally {
      setIsAiLoading(prev => ({ ...prev, [module.id]: false }));
    }
  };

  // Reset video loading state when switching videos
  useEffect(() => {
    if (activeVideo) setVideoLoading(true);
  }, [activeVideo]);

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-x-hidden font-sans selection:bg-[#40E0D0]/30 pb-20">
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face { font-family: 'Vazirmatn'; src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2') format('woff2'); }
        body { font-family: 'Vazirmatn', sans-serif; }
        .breathing-core { animation: breathe 4s infinite ease-in-out; }
        @keyframes breathe { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px #40E0D044); } 50% { transform: scale(1.02); filter: drop-shadow(0 0 50px #40E0D088); } }
        .cyan-pulse { animation: cyan-pulse 3s infinite; }
        @keyframes cyan-pulse { 0%, 100% { box-shadow: 0 0 20px #40E0D033; border-color: #40E0D044; } 50% { box-shadow: 0 0 50px #40E0D066; border-color: #40E0D0; } }
        .gold-shimmer { animation: gold-shimmer 4s infinite; border-color: #D4AF37; }
        @keyframes gold-shimmer { 0%, 100% { box-shadow: 0 0 10px #D4AF3733; } 50% { box-shadow: 0 0 30px #D4AF3788; } }
        .shimmer-text { background: linear-gradient(90deg, #fff 0%, #40E0D0 50%, #fff 100%); background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s infinite linear; }
        @keyframes shimmer { to { background-position: 200%; } }
      `}} />

      {/* Landing */}
      {!entered && (
        <div className="fixed inset-0 z-[9000] bg-black flex flex-col items-center justify-center cursor-pointer" onClick={() => setEntered(true)}>
          <h1 className="text-9xl md:text-[15rem] font-black breathing-core tracking-tighter text-white">PROMPT</h1>
          <div className="mt-20 flex items-center gap-4 text-zinc-500 text-xs tracking-[0.5em] uppercase animate-pulse">
            <MousePointer2 size={16}/> <span>Initialize Protocol</span>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Navbar */}
        <nav className="p-8 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-40 bg-black/80">
           <div className="flex gap-4">
             {isAdmin ? (
               <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all">
                 <LogOut size={16}/> <span className="text-[10px] font-black tracking-widest uppercase">Logout</span>
               </button>
             ) : (
               <button onClick={() => setShowLoginModal(true)} className="p-3 border border-white/10 rounded-full hover:text-[#40E0D0] transition-all">
                 <Lock size={20}/>
               </button>
             )}
             
             {isAdmin && (
               <button onClick={saveToDB} className="flex items-center gap-2 px-6 py-3 bg-[#40E0D0]/10 border border-[#40E0D0]/30 rounded-full text-[#40E0D0] hover:bg-[#40E0D0] hover:text-black transition-all">
                 <Save size={16}/> <span className="text-[10px] font-black tracking-widest uppercase">Update DB</span>
               </button>
             )}
           </div>

           <div className="text-right">
             <div className="text-2xl font-black tracking-tighter">PROMPT</div>
             <div className="text-[8px] tracking-[0.4em] text-[#40E0D0] uppercase">Sovereign Authority</div>
           </div>
        </nav>

        <main className="max-w-[1800px] mx-auto px-6 py-24">
          
          {/* Hero */}
          <header className="text-center mb-40">
            <h1 className="text-8xl md:text-[12rem] font-black leading-none mb-8 text-white tracking-tighter uppercase">
              VISUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-white">SUPREMACY</span>
            </h1>
          </header>

          {/* 1. Archives (Videos) */}
          <section className="mb-64">
            <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-8">
               <h2 className="text-6xl font-black tracking-tight">ARCHIVES</h2>
               <p className="text-[#40E0D0] tracking-widest text-sm uppercase">Cinematic Vault</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {portfolio.map((item, index) => (
                <div key={item.id} className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveVideo(item)}>
                    <img src={item.cover_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" alt=""/>
                    <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black via-black/20 to-transparent">
                      <div className="w-16 h-16 rounded-full border border-[#40E0D0] flex items-center justify-center text-[#40E0D0] mb-6 backdrop-blur-md group-hover:bg-[#40E0D0] group-hover:text-black transition-all">
                        <Play size={24} fill="currentColor"/>
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-widest">{item.title}</h3>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-0 right-0 p-4 flex flex-col gap-2 z-20 bg-black/50 backdrop-blur-sm rounded-bl-3xl border-l border-b border-white/10">
                      <button onClick={(e) => { e.stopPropagation(); moveVideo(index, 'up'); }} className="p-2 bg-black hover:bg-[#40E0D0] hover:text-black rounded-lg border border-white/20 transition-all"><ArrowUp size={14}/></button>
                      <button onClick={(e) => { e.stopPropagation(); moveVideo(index, 'down'); }} className="p-2 bg-black hover:bg-[#40E0D0] hover:text-black rounded-lg border border-white/20 transition-all"><ArrowDown size={14}/></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteVideo(item.id); }} className="p-2 bg-red-900/50 hover:bg-red-600 hover:text-white rounded-lg border border-red-500/30 transition-all mt-2"><Trash2 size={14}/></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 2. Proposals (Packages) */}
          <section className="mb-64">
             <div className="text-center mb-24">
               <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">PROPOSAL / خدمات</h2>
               <p className="text-zinc-500 tracking-[0.3em] uppercase">لیست پکیج های همکاری</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {PRESET_PACKAGES.map(pkg => (
                  <div key={pkg.id} onClick={() => setPreviewPackage(pkg)} className={`p-10 rounded-[3rem] min-h-[500px] flex flex-col justify-between cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 transition-all 
                    ${pkg.type === 'Fusion' ? 'cyan-pulse border-[#40E0D0] bg-[#40E0D0]/5 scale-105 z-10' : ''}
                    ${pkg.type === 'Quantum' ? 'gold-shimmer border-[#D4AF37]/50' : ''}
                  `}>
                      <div>
                        <div className={`mb-6 p-4 rounded-2xl inline-block ${pkg.type === 'Fusion' ? 'bg-[#40E0D0]/10 text-[#40E0D0]' : 'bg-white/5 text-zinc-400'}`}>
                          {pkg.type === 'Core' && <Cpu size={32}/>}
                          {pkg.type === 'Fusion' && <Atom size={32}/>}
                          {pkg.type === 'Quantum' && <Gem size={32} className="text-[#D4AF37]"/>}
                          {pkg.type === 'Tactical' && <Briefcase size={32}/>}
                        </div>
                        <h3 className="text-4xl font-black mb-2">{pkg.display_title}</h3>
                        <div className={`text-3xl font-black ${pkg.type === 'Quantum' ? 'text-[#D4AF37]' : 'text-[#40E0D0]'}`}>
                          {pkg.price} <span className="text-xs text-white opacity-50">M T</span>
                        </div>
                        {pkg.type === 'Fusion' && <div className="mt-4 inline-block px-3 py-1 bg-[#D4AF37] text-black text-[9px] font-black tracking-widest rounded-full">RECOMMENDED</div>}
                      </div>
                      <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-50 group-hover:opacity-100">View Details <Plus size={14}/></div>
                  </div>
                ))}
             </div>
          </section>

          {/* 3. NEURAL GRID (AI Tools) - ADDED HERE */}
          <section className="mb-64">
            <div className="text-center mb-24">
               <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#40E0D0]/10 text-[#40E0D0] border border-[#40E0D0]/30 animate-pulse">
                 <Bot size={16} /> <span>POWERED BY GEMINI & NEURAL NETS</span>
               </div>
               <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#40E0D0] to-white">NEURAL GRID</h2>
               <p className="text-zinc-500 tracking-[0.3em] uppercase">ابزارهای هوشمند تولید محتوا</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {NEURAL_MODULES.map((module) => {
                const remaining = quotas[module.id] || 0;
                return (
                  <div key={module.id} className="group relative glass-panel p-8 rounded-[3rem] border border-white/10 hover:border-[#40E0D0]/50 transition-all flex flex-col h-[500px]">
                    <div className="absolute top-6 left-6 text-[10px] font-black text-zinc-500 border border-white/10 px-3 py-1 rounded-full">
                      LIMIT: {remaining}/{module.limit}
                    </div>
                    
                    <div className="mt-8 mb-4 text-[#40E0D0] bg-white/5 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                      {module.icon}
                    </div>
                    
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{module.title}</h3>
                    <p className="text-sm text-[#40E0D0] font-[Vazirmatn] mb-4">{module.fa_title}</p>
                    <p className="text-xs text-zinc-400 font-[Vazirmatn] leading-loose mb-6">{module.desc}</p>

                    <div className="mt-auto flex flex-col gap-4">
                      <textarea 
                        className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-right text-xs text-white outline-none focus:border-[#40E0D0] resize-none h-20"
                        placeholder="متن خود را وارد کنید..."
                        onChange={(e) => setAiInputs(prev => ({...prev, [module.id]: e.target.value}))}
                      />
                      <button 
                        onClick={() => handleAiExecute(module)}
                        disabled={isAiLoading[module.id] || (remaining <= 0 && !isAdmin)}
                        className={`w-full py-3 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2
                          ${remaining > 0 || isAdmin ? 'bg-white text-black hover:bg-[#40E0D0]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
                        `}
                      >
                        {isAiLoading[module.id] ? <RefreshCw className="animate-spin" size={14}/> : <><Zap size={14}/> EXECUTE</>}
                      </button>
                    </div>

                    {/* Result Overlay */}
                    {aiResults[module.id] && (
                      <div className="absolute inset-0 z-20 bg-black/95 rounded-[3rem] p-6 flex flex-col animate-in fade-in">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[#40E0D0] text-xs font-black">OUTPUT GENERATED</span>
                          <button onClick={() => setAiResults(prev => ({...prev, [module.id]: null}))} className="text-zinc-500 hover:text-white"><X size={16}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                          {module.type === 'image' ? (
                            <img src={aiResults[module.id]} className="w-full h-full object-cover rounded-2xl border border-white/20" alt="Generated" />
                          ) : (
                            <p className="text-xs text-zinc-300 font-[Vazirmatn] leading-loose whitespace-pre-wrap text-right">{aiResults[module.id]}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </main>

        {/* --- LUXURY FOOTER --- */}
        <footer className="mt-40 border-t border-white/5 bg-black py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(64,224,208,0.03),transparent_70%)] pointer-events-none"></div>
            <div className="max-w-[1800px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-12">
               
               <div className="flex flex-col items-center md:items-start gap-6 group">
                  <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 group-hover:border-[#40E0D0]/30 transition-all shadow-2xl backdrop-blur-xl">
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}&color=40E0D0&bgcolor=000&margin=2`} className="w-24 h-24 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity" alt="Site QR" />
                  </div>
                  <span className="text-[9px] tracking-[0.5em] text-zinc-600 uppercase font-black">Scan Protocol</span>
               </div>

               <div className="text-center md:text-right">
                  <div className="text-zinc-500 text-[10px] font-black tracking-[0.6em] uppercase mb-4 opacity-50">Architected By</div>
                  <h2 className="text-7xl md:text-9xl font-black shimmer-text leading-none tracking-tighter">REZIBEL</h2>
                  <div className="flex items-center justify-end gap-4 mt-6">
                     <div className="h-[1px] w-24 bg-gradient-to-l from-[#40E0D0] to-transparent"></div>
                     <span className="text-[#40E0D0] text-xs font-black tracking-[0.3em] uppercase">Core Architect & Director</span>
                  </div>
                  <p className="text-[9px] text-zinc-700 tracking-[0.4em] uppercase mt-12">© 2026 Sovereign Authority | All Rights Reserved</p>
               </div>

            </div>
        </footer>

      </div>

      {/* --- MODALS --- */}

      {/* Video Player Modal (Enhanced for Speed) */}
      {activeVideo && (
        <div className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-3xl animate-in fade-in duration-300">
          <button onClick={() => setActiveVideo(null)} className="absolute top-8 left-8 p-4 bg-white/10 rounded-full hover:bg-white hover:text-black transition-all z-50">
            <X size={32} />
          </button>
          
          <div className="w-full max-w-7xl aspect-video rounded-[3rem] overflow-hidden border border-[#40E0D0]/20 shadow-[0_0_100px_rgba(64,224,208,0.15)] bg-black relative flex items-center justify-center">
            
            {/* Loading Spinner */}
            {videoLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
                <Loader2 className="w-16 h-16 text-[#40E0D0] animate-spin mb-4" />
                <span className="text-[#40E0D0] text-xs tracking-[0.5em] uppercase animate-pulse">Establishing Link...</span>
              </div>
            )}

            <video 
              controls 
              autoPlay 
              playsInline
              preload="auto"
              className="w-full h-full object-contain z-20"
              controlsList="nodownload" 
              poster={activeVideo.cover_url}
              onLoadedData={() => setVideoLoading(false)}
              onWaiting={() => setVideoLoading(true)}
              onPlaying={() => setVideoLoading(false)}
            >
              <source src={activeVideo.video_url} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* Package Modal */}
      {previewPackage && (
        <div className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
           <button onClick={() => setPreviewPackage(null)} className="absolute top-8 left-8 p-4 bg-white/10 rounded-full text-white"><X/></button>
           <div className="max-w-4xl w-full p-12 glass-panel rounded-[3rem] text-right border border-[#40E0D0]/20 max-h-[90vh] overflow-y-auto">
             <h2 className="text-6xl font-black mb-12 text-white">{previewPackage.display_title}</h2>
             <div className="space-y-4" dir="rtl">
               {previewPackage.details.map((d,i) => (
                 <div key={i} className="flex items-center gap-4 text-xl text-zinc-300 border-b border-white/5 pb-4">
                   <CheckCircle2 className="text-[#40E0D0]" size={20}/> {formatPersianText(d)}
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[6000] bg-black/98 flex items-center justify-center p-6">
          <div className="w-full max-w-md p-12 rounded-[3rem] border border-white/10 bg-zinc-900 text-center">
            <Crown className="mx-auto text-[#40E0D0] mb-8" size={48}/>
            <h3 className="text-2xl font-black mb-8 tracking-widest uppercase">Identity Verification</h3>
            <form onSubmit={(e) => { e.preventDefault(); if(loginForm.user === ADMIN_CREDENTIALS.user && loginForm.pass === ADMIN_CREDENTIALS.pass) { setIsAdmin(true); setShowLoginModal(false); } else alert("ACCESS DENIED"); }}>
              <input className="w-full bg-black border border-white/10 p-4 rounded-2xl text-center outline-none focus:border-[#40E0D0] text-white mb-4" placeholder="ID" value={loginForm.user} onChange={e=>setLoginForm({...loginForm, user:e.target.value})}/>
              <input className="w-full bg-black border border-white/10 p-4 rounded-2xl text-center outline-none focus:border-[#40E0D0] text-white mb-6" type="password" placeholder="KEY" value={loginForm.pass} onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
              <button className="w-full py-4 bg-[#40E0D0] text-black font-black rounded-2xl tracking-widest uppercase text-xs">Authorize</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
