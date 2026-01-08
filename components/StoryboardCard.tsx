
import React from 'react';
import { AttackStep } from '../types';

interface StoryboardCardProps {
  step: AttackStep;
  index: number;
}

const StoryboardCard: React.FC<StoryboardCardProps> = ({ step, index }) => {
  return (
    <div className="glass rounded-xl overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        {step.isLoadingImage ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400 font-medium">Generating Scene {index + 1}...</p>
          </div>
        ) : step.imageUrl ? (
          <img 
            src={step.imageUrl} 
            alt={step.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
            <p className="text-slate-600 italic">Visual representation pending</p>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            STEP {index + 1}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <span className="bg-slate-900/90 backdrop-blur-md text-slate-300 text-[10px] font-mono px-2 py-1 rounded border border-slate-700">
            {step.mitreTechnique}
          </span>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">{step.phase}</h4>
          <h3 className="text-xl font-bold text-slate-100 leading-tight">{step.title}</h3>
        </div>
        
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
          {step.description}
        </p>
      </div>
    </div>
  );
};

export default StoryboardCard;
