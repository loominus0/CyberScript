
import React, { useState } from 'react';
import { Complexity, AttackScenario } from './types';
import { generateAttackScenario, generateStepImage } from './services/geminiService';
import Button from './components/Button';
import StoryboardCard from './components/StoryboardCard';

const App: React.FC = () => {
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState<Complexity>(Complexity.INTERMEDIATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<AttackScenario | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert("Please provide a description of the target organization.");
      return;
    }

    setIsGenerating(true);
    setCurrentScenario(null);

    try {
      const scenario = await generateAttackScenario(complexity, description);
      setCurrentScenario(scenario);
      
      for (let i = 0; i < scenario.steps.length; i++) {
        const step = scenario.steps[i];
        
        setCurrentScenario(prev => {
          if (!prev) return null;
          const newSteps = [...prev.steps];
          newSteps[i] = { ...newSteps[i], isLoadingImage: true };
          return { ...prev, steps: newSteps };
        });

        try {
          const imageUrl = await generateStepImage(step.visualPrompt);
          
          setCurrentScenario(prev => {
            if (!prev) return null;
            const newSteps = [...prev.steps];
            newSteps[i] = { ...newSteps[i], imageUrl, isLoadingImage: false };
            return { ...prev, steps: newSteps };
          });
        } catch (imgError) {
          console.error(`Failed to generate image for step ${i}`, imgError);
          setCurrentScenario(prev => {
            if (!prev) return null;
            const newSteps = [...prev.steps];
            newSteps[i] = { ...newSteps[i], isLoadingImage: false };
            return { ...prev, steps: newSteps };
          });
        }
      }
    } catch (error) {
      console.error("Failed to generate scenario", error);
      alert("Error generating scenario. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!currentScenario) return;
    const text = `
CYBERSCRIPT STORYBOARD: ${currentScenario.attackVector}
THREAT ACTOR: ${currentScenario.threatActor}

OVERVIEW:
${currentScenario.summary}

ATTACK STORYBOARD:
${currentScenario.steps.map((s, i) => `Step ${i+1}: ${s.title} (${s.phase}) - ${s.description}`).join('\n')}

SAMPLE LOGS:
${currentScenario.sampleLogs}

ATTACK FLOW DIAGRAM:
${currentScenario.attackFlowDiagram}

MITIGATION & LESSONS:
${currentScenario.mitigationLessons}
    `;
    navigator.clipboard.writeText(text);
    alert("Full report copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 overflow-hidden h-screen">
      {/* Header */}
      <header className="glass relative z-50 px-6 py-4 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m12.73 8.231a4.121 4.121 0 01-1.883 1.103M12 21a9.003 9.003 0 008.313-5.547M12 21a9.003 9.003 0 01-8.313-5.547M12 21V12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            CyberScript
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
            {isGenerating ? 'ANALYZING_THREATS...' : 'SYSTEM_STATUS: READY'}
          </span>
          <div className={`w-2 h-2 rounded-full animate-pulse ${isGenerating ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
        </div>
      </header>

      {/* Side-by-Side Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Input Controls */}
        <aside className="w-full lg:w-1/3 xl:w-1/4 p-6 border-r border-slate-800/50 overflow-y-auto bg-slate-950/20">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-2">
              <h2 className="text-sm font-mono text-blue-500 uppercase tracking-widest font-bold">Inquiry Terminal</h2>
              <p className="text-xs text-slate-500 italic">"Define the target environment to begin synthesis."</p>
            </div>

            <div className="space-y-5">
              {/* Organization Description */}
              <div className="space-y-2.5">
                <label htmlFor="org-description" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Target Description</label>
                <textarea
                  id="org-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the environment (e.g., A regional health clinic with legacy medical databases...)"
                  className="w-full bg-slate-900/30 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 min-h-[160px] resize-none leading-relaxed text-sm"
                />
              </div>

              {/* Difficulty Level Dropdown */}
              <div className="space-y-2.5">
                <label htmlFor="difficulty-level" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Difficulty Level</label>
                <div className="relative">
                  <select
                    id="difficulty-level"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value as Complexity)}
                    className="w-full bg-slate-900/30 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 appearance-none cursor-pointer text-sm"
                  >
                    {Object.values(Complexity).map((level) => (
                      <option key={level} value={level} className="bg-slate-900 text-slate-200">
                        {level}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <Button 
                  onClick={handleGenerate} 
                  isLoading={isGenerating}
                  className="w-full py-4 text-sm uppercase tracking-widest font-black"
                >
                  {isGenerating ? 'Synthesizing...' : 'Generate Storyboard'}
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: CyberScript Storyboard Output Panel */}
        <section className="flex-1 flex flex-col bg-[#01040f] overflow-hidden">
          {/* Panel Title Bar */}
          <div className="px-8 py-5 border-b border-slate-800/50 bg-slate-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-glow shadow-blue-500/50"></div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">CyberScript Storyboard</h2>
            </div>
            {currentScenario && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={copyToClipboard}
                  className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Report
                </button>
                <div className="w-px h-4 bg-slate-800"></div>
                <span className="text-[10px] font-mono text-slate-500">
                  REF_ID: {currentScenario.id.split('-')[0].toUpperCase()} // LVL_{currentScenario.steps.length}
                </span>
              </div>
            )}
          </div>

          {/* Large Scrollable Result Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {!currentScenario && !isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto p-12">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl border-2 border-slate-800/50 flex items-center justify-center animate-pulse">
                    <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">Target Data Required</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                    Input a target description to initiate the CyberScript threat synthesis engine.
                  </p>
                </div>
              </div>
            ) : isGenerating && !currentScenario ? (
              <div className="h-full flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
                <div className="relative h-48 w-48 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-blue-500/5 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-2 border-indigo-500/10 rounded-full"></div>
                  <div className="absolute inset-4 border-2 border-b-indigo-500 rounded-full animate-spin-slow"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-mono text-blue-400 font-black animate-pulse">SYNTHESIZING</p>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-blue-500 font-black text-xl uppercase tracking-tighter italic">Generating Attack Killchain</h3>
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Compiling Phase Details & Visual Prompts...</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: `${i*0.15}s`}}></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : currentScenario && (
              <div className="max-w-6xl mx-auto py-16 px-8 lg:px-12 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32">
                
                {/* I. OVERVIEW SECTION */}
                <div className="space-y-10">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] font-mono">01 // OVERVIEW</span>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                        {currentScenario.attackVector}
                      </h3>
                      <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500">
                        <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded">THREAT_ACTOR: {currentScenario.threatActor.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div className="relative space-y-6">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-l-2 border-blue-500 pl-4">Infiltration Summary</h4>
                      <p className="text-slate-300 text-xl leading-relaxed font-light">
                        {currentScenario.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* II. ATTACK STORYBOARD SECTION */}
                <div className="space-y-12">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                      <span className="text-blue-500 font-black text-lg">02</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">ATTACK STORYBOARD (PHASED)</h4>
                      <p className="text-xs text-slate-500 font-mono">STEP_SEQUENCE_MAPPING</p>
                    </div>
                    <div className="hidden md:block flex-1 h-px bg-slate-800/50"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {currentScenario.steps.map((step, idx) => (
                      <StoryboardCard key={step.id} step={step} index={idx} />
                    ))}
                  </div>
                </div>

                {/* III. SAMPLE LOGS SECTION */}
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                      <span className="text-emerald-500 font-black text-lg">03</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">SAMPLE LOGS</h4>
                      <p className="text-xs text-slate-500 font-mono">TECHNICAL_TELEMETRY</p>
                    </div>
                    <div className="hidden md:block flex-1 h-px bg-slate-800/50"></div>
                  </div>
                  
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-[#050810] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="bg-slate-900/50 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-rose-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">SIEM_RAW.LOG</span>
                      </div>
                      <div className="p-8 font-mono text-xs md:text-sm leading-relaxed text-emerald-500/80 overflow-x-auto whitespace-pre-wrap max-h-[400px] custom-scrollbar">
                        {currentScenario.sampleLogs}
                      </div>
                    </div>
                  </div>
                </div>

                {/* IV. ATTACK FLOW DIAGRAM SECTION */}
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-600/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
                      <span className="text-amber-500 font-black text-lg">04</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">ATTACK FLOW DIAGRAM (TEXT)</h4>
                      <p className="text-xs text-slate-500 font-mono">KILLCHAIN_VISUALIZATION</p>
                    </div>
                    <div className="hidden md:block flex-1 h-px bg-slate-800/50"></div>
                  </div>
                  
                  <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl p-12 flex items-center justify-center">
                    <div className="w-full max-w-2xl font-mono text-sm leading-relaxed text-blue-300/60 bg-slate-950/50 p-8 rounded-xl border border-slate-800/50 text-center shadow-inner">
                      <pre className="whitespace-pre-wrap inline-block text-left italic">
                        {currentScenario.attackFlowDiagram}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* V. MITIGATION & LESSONS SECTION */}
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-rose-600/10 border border-rose-500/20 rounded-2xl flex items-center justify-center">
                      <span className="text-rose-500 font-black text-lg">05</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">MITIGATION & LESSONS</h4>
                      <p className="text-xs text-slate-500 font-mono">REMEDIATION_STRATEGY</p>
                    </div>
                    <div className="hidden md:block flex-1 h-px bg-slate-800/50"></div>
                  </div>
                  
                  <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 md:p-12 space-y-6">
                    <div className="text-slate-300 text-sm md:text-base leading-relaxed prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap">
                        {currentScenario.mitigationLessons}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel Footer / Metrics */}
          <div className="bg-slate-900/80 px-8 py-3 border-t border-slate-800/50 flex justify-between items-center relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500/50"></span>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Telemetry_Secure</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Engine_V3_Native</p>
              </div>
            </div>
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
              STRICT_MAPPING // VERIFIED
            </p>
          </div>
        </section>
      </main>

      {/* Main Global Footer */}
      <footer className="px-6 py-2 border-t border-slate-800/50 bg-slate-950 flex justify-between items-center relative z-50">
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          Terminal Status: Online // Mode: Active Simulation // Session: {Date.now().toString(36).toUpperCase()}
        </p>
        <div className="flex gap-4">
           <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-glow shadow-blue-500/50"></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
