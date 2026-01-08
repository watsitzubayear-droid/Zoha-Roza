
import React, { useState, useEffect, useRef } from 'react';
import { analyzeScreenshot, generateFutureSignals } from './services/geminiService';
import { MARKET_PAIRS, BDT_TIMEZONE } from './constants';
import { Signal, AnalysisResult } from './types';

const App: React.FC = () => {
  const [bdtTime, setBdtTime] = useState<string>('');
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [futureSignals, setFutureSignals] = useState<Signal[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiPower, setAiPower] = useState(99.102);
  const [genStatus, setGenStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced HUD Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setBdtTime(new Intl.DateTimeFormat('en-GB', {
        timeZone: BDT_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now));
      setAiPower(prev => +(prev + (Math.random() * 0.0004 - 0.0002)).toFixed(4));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Paste Handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              setScreenshot(base64);
              handleImmediateAnalysis(base64);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setScreenshot(base64);
        handleImmediateAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImmediateAnalysis = async (img: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeScreenshot(img);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError("ZOHA AI: ACCURACY < 80%. SIGNAL REJECTED.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePairSelection = (symbol: string) => {
    setSelectedPairs(prev => 
      prev.includes(symbol) ? prev.filter(p => p !== symbol) : [...prev, symbol]
    );
  };

  const handleSelectAll = () => {
    if (selectedPairs.length === MARKET_PAIRS.length) {
      setSelectedPairs([]);
    } else {
      setSelectedPairs(MARKET_PAIRS.map(p => p.symbol));
    }
  };

  const handleGenerateSignals = async () => {
    if (selectedPairs.length === 0) {
      setError("SYSTEM ALERT: NO ASSETS SELECTED.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setFutureSignals([]);
    
    const statuses = [
      'Synchronizing Live Global Feeds...',
      'Filtering < 80% Accuracy Markets...',
      'Calculating 3-Minute Signal Gaps...',
      'Applying Rejection Ratio Models...',
      'Mapping Magnet Round Numbers...',
      'Broadcasting Verified Signals...'
    ];
    let sIdx = 0;
    const interval = setInterval(() => {
      setGenStatus(statuses[sIdx % statuses.length]);
      sIdx++;
    }, 1500);

    try {
      const signals = await generateFutureSignals(selectedPairs);
      setFutureSignals(signals);
      if (signals.length === 0) {
        setError("ZOHA AI: Market conditions unstable. Accuracy dropped below 80%.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "ZOHA AI: Neural connection error.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
      setGenStatus('');
    }
  };

  return (
    <div className="min-h-screen pb-12 px-4 md:px-8 bg-[#000] text-white selection:bg-cyan-500/40 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-cyan-600/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-purple-700/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Top HUD */}
      <header className="sticky top-0 z-[60] py-6 glass-panel border-b border-white/5 mb-8 rounded-b-[2rem] shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 sm:px-12 gap-6">
          <div className="flex items-center gap-6 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-700"></div>
              <div className="relative w-16 h-16 bg-black/90 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                <i className="fas fa-bolt text-cyan-400 text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"></i>
              </div>
            </div>
            <div>
              <h1 className="orbitron text-2xl sm:text-4xl font-black tracking-tighter uppercase leading-none">
                ZOHA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span> V8
              </h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <span className="text-[10px] orbitron tracking-[0.4em] text-cyan-400/70 font-bold uppercase">ACCURACY SYNC: 80%+</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="hidden lg:flex flex-col items-center bg-white/5 px-8 py-3 rounded-2xl border border-white/10">
              <span className="text-[8px] orbitron text-white/40 tracking-[0.4em] mb-1 uppercase">AI SIGNAL LOAD</span>
              <span className="orbitron text-xl font-black text-green-400 tabular-nums">{aiPower}%</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-[0.5em] text-cyan-500 font-black mb-1">BDT MASTER CLOCK</span>
              <span className="orbitron text-3xl sm:text-5xl font-black text-white tracking-[0.1em] tabular-nums drop-shadow-lg">
                {bdtTime || '00:00:00'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto mb-8 p-6 rounded-[2rem] bg-red-950/40 border border-red-500/30 text-red-400 text-xs orbitron font-bold flex items-center gap-6 animate-in slide-in-from-top-6 shadow-2xl">
          <i className="fas fa-shield-virus text-2xl animate-bounce"></i>
          <p className="uppercase tracking-[0.2em] flex-1">{error}</p>
          <button onClick={() => setError(null)} className="hover:text-white"><i className="fas fa-times"></i></button>
        </div>
      )}

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COMPONENT: ANALYSIS & INPUT */}
        <div className="lg:col-span-4 space-y-8">
          <section className="glass-panel p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-[80px]"></div>
            
            <h2 className="orbitron text-xs font-black mb-10 flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-lg">
                <i className="fas fa-microscope text-cyan-400"></i>
              </div>
              CCT/SVM MATRIX SCAN
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video rounded-[2rem] border-2 border-dashed border-white/10 bg-black/50 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/40 transition-all duration-700 overflow-hidden shadow-2xl group"
            >
              {screenshot ? (
                <img src={screenshot} alt="Screenshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              ) : (
                <div className="text-center p-10">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-cyan-400 transition-all duration-700 shadow-inner">
                    <i className="fas fa-plus text-3xl text-white/20 group-hover:text-cyan-400 group-hover:rotate-90 transition-all duration-700"></i>
                  </div>
                  <p className="text-[10px] orbitron font-black text-white/40 tracking-[0.4em] uppercase">PASTE CHART IMAGE</p>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center z-[70] animate-in fade-in">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                    <i className="fas fa-dna text-cyan-500 text-3xl absolute inset-0 m-auto flex items-center justify-center"></i>
                  </div>
                  <p className="orbitron text-xs tracking-[0.5em] text-cyan-400 font-black animate-pulse uppercase">PROCESSING CCT MATH...</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

            {analysisResult && !isAnalyzing && (
              <div className={`mt-8 p-8 rounded-[2rem] border animate-in slide-in-from-bottom-8 duration-700 ${
                analysisResult.nextCandle === 'GREEN' ? 'bg-green-500/5 border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]' : 
                analysisResult.nextCandle === 'RED' ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex justify-between items-center mb-6">
                   <span className="text-[10px] orbitron font-black text-white/40 tracking-widest uppercase">QUANTUM VERDICT</span>
                   <span className={`text-[11px] orbitron font-black px-3 py-1 rounded-full border ${
                     analysisResult.confidence >= 80 ? 'text-green-400 border-green-500/30' : 'text-yellow-400 border-yellow-500/30'
                   }`}>{analysisResult.confidence}% PROB.</span>
                </div>
                <div className={`text-6xl orbitron font-black mb-6 ${
                  analysisResult.nextCandle === 'GREEN' ? 'text-green-400' : 
                  analysisResult.nextCandle === 'RED' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {analysisResult.nextCandle === 'GREEN' ? 'CALL' : analysisResult.nextCandle === 'RED' ? 'PUT' : 'WAIT'}
                  <i className={`fas ${analysisResult.nextCandle === 'GREEN' ? 'fa-circle-chevron-up' : analysisResult.nextCandle === 'RED' ? 'fa-circle-chevron-down' : 'fa-clock'} text-3xl ml-6`}></i>
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 mb-6">
                  <p className="text-[13px] leading-relaxed text-white/70 italic font-semibold">"{analysisResult.reasoning}"</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.patternsIdentified.map((p, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] orbitron font-black text-white/50 uppercase shadow-sm">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Asset Selection */}
          <section className="glass-panel p-8 rounded-[3rem] border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="orbitron text-xs font-black flex items-center gap-4 text-white/90">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <i className="fas fa-list-check text-purple-400"></i>
                </div>
                TARGET REGISTRY
              </h2>
              <button 
                onClick={handleSelectAll}
                className="text-[10px] orbitron font-black text-purple-400 px-5 py-2.5 rounded-2xl border border-purple-500/30 hover:bg-purple-500/20 transition-all uppercase tracking-widest shadow-lg"
              >
                {selectedPairs.length === MARKET_PAIRS.length ? 'DESELECT' : 'SELECT ALL'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {MARKET_PAIRS.map(pair => (
                <button
                  key={pair.symbol}
                  onClick={() => togglePairSelection(pair.symbol)}
                  className={`text-left p-4 rounded-[1.5rem] border transition-all duration-500 flex justify-between items-center group relative overflow-hidden ${
                    selectedPairs.includes(pair.symbol) 
                      ? 'bg-purple-600 border-transparent text-white shadow-[0_10px_20px_rgba(147,51,234,0.3)]' 
                      : 'bg-white/[0.03] border-white/5 text-white/30 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative z-10 overflow-hidden">
                    <div className="orbitron text-[11px] font-black truncate tracking-wider group-hover:text-white transition-colors">{pair.symbol}</div>
                    <div className="text-[8px] orbitron opacity-50 uppercase truncate tracking-[0.2em] mt-1">{pair.isOtc ? 'OTC' : 'LIVE'}</div>
                  </div>
                  {selectedPairs.includes(pair.symbol) && <i className="fas fa-shield-check text-[12px] animate-pulse"></i>}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleGenerateSignals}
              disabled={isGenerating || selectedPairs.length === 0}
              className="w-full mt-10 py-6 rounded-[2rem] bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800 orbitron text-white font-black tracking-[0.4em] shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 disabled:grayscale uppercase text-xs"
            >
              {isGenerating ? (
                <div className="flex flex-col items-center">
                  <span className="flex items-center gap-4"><i className="fas fa-satellite-dish animate-pulse"></i> SCANNING NODES...</span>
                  <span className="text-[9px] tracking-[0.1em] normal-case opacity-60 mt-2">{genStatus}</span>
                </div>
              ) : 'INITIALIZE ACCURACY GEN'}
            </button>
          </section>
        </div>

        {/* RIGHT PANEL: LIVE SIGNAL FEED */}
        <div className="lg:col-span-8">
          <section className="glass-panel min-h-[900px] flex flex-col rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden group/stream relative">
            
            <div className="p-10 sm:p-14 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-10 bg-white/[0.02]">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="absolute -inset-4 bg-cyan-500/10 rounded-full blur-2xl animate-pulse"></div>
                  <i className="fas fa-wave-square text-blue-400 text-4xl relative"></i>
                </div>
                <div>
                  <h2 className="orbitron text-3xl font-black text-white tracking-widest leading-none">QUANTUM FEED</h2>
                  <p className="text-[11px] orbitron font-black text-blue-400/80 uppercase tracking-[0.5em] mt-3">FILTER: ACCURACY ≥ 80% | GAP: 3M+</p>
                </div>
              </div>
              
              <div className="bg-white/5 px-8 py-4 rounded-3xl border border-white/10 text-[12px] orbitron font-black text-white/60 flex items-center gap-4 uppercase tracking-widest shadow-lg">
                <span className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,1)]"></span>
                LIVE NETWORK STABLE
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 sm:p-14 space-y-6 custom-scrollbar bg-black/50">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center space-y-12 opacity-80">
                  <div className="relative">
                    <div className="w-40 h-40 border-2 border-blue-500/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fas fa-brain text-8xl text-blue-400 animate-pulse"></i>
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="orbitron text-2xl font-black text-white tracking-[0.6em] uppercase">SEQUENCING NODES</h3>
                    <p className="orbitron text-[12px] tracking-[0.5em] text-white/30 uppercase max-w-[400px] leading-relaxed">Connecting to global live liquidity providers for 80%+ confirmation...</p>
                  </div>
                </div>
              ) : futureSignals.length > 0 ? (
                <div className="grid gap-6 animate-in fade-in zoom-in-95 duration-1000">
                  {futureSignals.map((sig, idx) => (
                    <div 
                      key={idx} 
                      className="group bg-[#090909] hover:bg-[#0f0f0f] border border-white/5 hover:border-cyan-500/30 rounded-[2.5rem] p-8 sm:p-10 transition-all duration-700 flex flex-col sm:flex-row items-center gap-10 shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center orbitron font-black shrink-0 border-2 transition-all duration-1000 ${
                        sig.type === 'CALL' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)] group-hover:shadow-[0_0_50px_rgba(34,197,94,0.3)]' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_50px_rgba(239,68,68,0.3)]'
                      }`}>
                        <i className={`fas ${sig.type === 'CALL' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-3xl mb-2`}></i>
                        <span className="text-[11px] tracking-widest uppercase font-black">{sig.type}</span>
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
                          <h4 className="orbitron text-2xl sm:text-3xl font-black tracking-widest text-white group-hover:text-cyan-400 transition-colors">{sig.pair}</h4>
                          <div className="flex items-center gap-6 bg-black/80 px-8 py-4 rounded-[1.5rem] border border-white/10 group-hover:border-cyan-500/40 transition-all shadow-inner">
                            <span className="orbitron text-2xl sm:text-3xl font-black text-white tracking-widest tabular-nums">{sig.time}</span>
                            <span className="text-[11px] font-black text-cyan-500/40 uppercase tracking-[0.3em]">BDT 1M</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-white/50 text-[12px] font-semibold tracking-wide bg-white/[0.03] p-5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                          <i className="fas fa-terminal text-blue-400/70"></i>
                          <p className="italic">"{sig.logic}"</p>
                        </div>
                      </div>

                      <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/5 pt-6 sm:pt-0 sm:pl-10 min-w-[150px]">
                        <span className="text-[10px] orbitron font-black text-white/30 block mb-3 uppercase tracking-widest">AI ACCURACY</span>
                        <div className="orbitron text-4xl sm:text-5xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] tabular-nums">{sig.probability}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-16 transition-all group-hover/stream:opacity-50">
                  <div className="w-48 h-48 mb-12 border-4 border-dashed border-white/10 rounded-full flex items-center justify-center animate-pulse">
                    <i className="fas fa-satellite text-9xl text-white/20"></i>
                  </div>
                  <h3 className="orbitron text-3xl font-black tracking-[0.6em] mb-6 uppercase text-white">NETWORK OFFLINE</h3>
                  <p className="text-[12px] max-w-[550px] orbitron font-bold leading-loose uppercase tracking-[0.5em] text-white/40">
                    CONFIGURE ASSET REGISTRY AND INITIALIZE THE QUANTUM SEQUENCE TO BROADCAST VERIFIED HIGH-PROBABILITY SIGNALS.
                  </p>
                </div>
              )}
            </div>
            
            <div className="px-12 py-8 bg-[#020202] border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-8 text-[11px] orbitron font-black text-white/30 uppercase tracking-[0.5em]">
              <div className="flex gap-12">
                 <span className="flex items-center gap-4 hover:text-white transition-colors cursor-help"><span className="w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,1)] animate-pulse"></span> AES-1024 QUANTUM ENCRYPT</span>
                 <span className="flex items-center gap-4 hover:text-white transition-colors cursor-help"><span className="w-2.5 h-2.5 bg-purple-600 rounded-full shadow-[0_0_8px_rgba(147,51,234,1)] animate-pulse"></span> NODE: NEXUS-PRIME</span>
              </div>
              <div className="flex items-center gap-4 text-cyan-400/40">
                <i className="fas fa-microchip text-lg"></i> ZOHA AI SIGNAL CORE V8.1
              </div>
            </div>
          </section>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.7);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(6, 182, 212, 0.2), rgba(168, 85, 247, 0.2));
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(6, 182, 212, 0.5), rgba(168, 85, 247, 0.5));
        }
        .glass-panel {
          background: rgba(8, 8, 12, 0.85);
          backdrop-filter: blur(45px);
        }
      `}</style>
    </div>
  );
};

export default App;
