'use client';

import React from 'react';
import { Flame, Droplet, Leaf, Info } from 'lucide-react';
import { RamenState } from '@/app/page';

interface FactPanelProps {
    state: RamenState;
    theme: any;
    facts?: string[];
}

export default function FactPanel({ state, theme, facts = [] }: FactPanelProps) {

    return (
        <div className="bg-white border-4 border-[#1A0E0A] rounded-2xl shadow-[12px_12px_0px_#1A0E0A] overflow-hidden -rotate-1 hover:rotate-0 transition-transform duration-300 texture">

            {/* Header Label */}
            <div
                className="text-white p-6 pb-8 font-black text-3xl md:text-4xl uppercase tracking-tighter text-center border-b-8 border-[#1A0E0A] transition-all duration-700"
                style={{ background: `linear-gradient(180deg, ${theme.primary} 0%, ${theme.glow} 100%)` }}
            >
                RAMEN STATS <span className="text-[#1A0E0A]">🔥</span>
            </div>

            {/* AI Dynamic Facts Insert */}
            {facts.length > 0 && (
                <div className="bg-[#FFF3E0] border-b-4 border-[#1A0E0A] p-5">
                    <p className="font-black text-lg text-[#1A0E0A] mb-2 tracking-tighter uppercase flex items-center gap-2">
                        <span>🔥</span> SENSEI SECRETS
                    </p>
                    <ul className="space-y-2 text-[#1A0E0A] font-bold text-sm tracking-tight leading-snug">
                        {facts.map((f, i) => (
                            <li key={i} className="flex gap-2"><span>•</span> <span>{f}</span></li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Stats Area */}
            <div className="p-6 space-y-4 font-black text-xl md:text-2xl text-[#1A0E0A] uppercase tracking-tight">

                <div className="flex justify-between items-center border-b-4 border-black/10 pb-4">
                    <span className="flex items-center gap-2"><Droplet className="text-[#FF3D00]" strokeWidth={3} /> BROTH</span>
                    <span className="text-right text-base leading-none max-w-[50%]">{state.broth || '???'}</span>
                </div>

                <div className="flex justify-between items-center border-b-4 border-black/10 pb-4">
                    <span className="flex items-center gap-2"><Flame className="text-[#B71C1C]" strokeWidth={3} /> SPICE</span>
                    <span className="transition-colors duration-700" style={{ color: theme.primary }}>{state.spice || 'LOW'}</span>
                </div>

                <div className="flex justify-between items-center border-b-4 border-black/10 pb-4">
                    <span className="flex items-center gap-2"><Leaf className="text-emerald-500" strokeWidth={3} /> TYPE</span>
                    <span>{state.type || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-center text-white bg-[#1A0E0A] -mx-2 px-4 py-3 rounded-lg shadow-[4px_4px_0_#1A0E0A]" style={{ boxShadow: `4px 4px 0 ${theme.primary}` }}>
                    <span className="flex items-center gap-2"><Info strokeWidth={3} /> STAGE</span>
                    <span className="animate-pulse transition-colors duration-700" style={{ color: theme.glow }}>{state.stage || 'IDLE'}</span>
                </div>

            </div>

            {/* Substitutes Notice */}
            <div className="m-4 text-white border-4 border-[#1A0E0A] p-4 font-bold text-sm uppercase transition-colors duration-700 shadow-[4px_4px_0_#1A0E0A]" style={{ backgroundColor: theme.primary }}>
                <div className="flex items-center gap-2 mb-2 font-black text-lg"><span>⚠️</span> INDIAN SUBSTITUTES</div>
                <ul className="space-y-2">
                    <li className="flex justify-between border-b-2 border-black/20 pb-1"><span>PORK</span> <span className="text-[#1A0E0A]">PANEER</span></li>
                    <li className="flex justify-between border-b-2 border-black/20 pb-1"><span>DASHI</span> <span className="text-[#1A0E0A]">KOMBU</span></li>
                    <li className="flex justify-between"><span>MIRIN</span> <span className="text-[#1A0E0A]">ACV + SUGAR</span></li>
                </ul>
            </div>

        </div>
    );
}
