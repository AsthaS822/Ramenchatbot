import React, { useState } from 'react';
import { playSound } from '@/lib/soundManager';

// Hardcoded themes for the hover preview magic
const ramenThemes: Record<string, { primary: string }> = {
    tonkotsu: { primary: '#FFF3E0' },
    miso: { primary: '#FF3D00' },
    shoyu: { primary: '#FFFFFF' },
    veg: { primary: '#4CAF50' }
};

interface RamenCardsProps {
    onSelect: (type: string) => void;
    selectedType: string | null;
}

export default function RamenCards({ onSelect, selectedType }: RamenCardsProps) {
    const [hovered, setHovered] = useState<string | null>(null);

    const cards = [
        { id: 'tonkotsu', name: 'TONKOTSU', desc: 'RICH PORK', bg: 'bg-[#FFF3E0]', text: 'text-[#1A0E0A]' },
        { id: 'miso', name: 'MISO', desc: 'SALTY SAVORY', bg: 'bg-[#FF3D00]', text: 'text-white' },
        { id: 'shoyu', name: 'SHOYU', desc: 'DARK SOY', bg: 'bg-[#1A0E0A]', text: 'text-[#FFF3E0]' },
        { id: 'veg', name: 'VEG', desc: 'EARTHY UMAMI', bg: 'bg-emerald-500', text: 'text-[#1A0E0A]' },
    ];

    return (
        <div className="flex flex-col mb-8 relative">
            <h2 className="text-4xl md:text-6xl font-black text-[#1A0E0A] uppercase tracking-tighter mb-6 underline decoration-[#FF3D00] decoration-8 underline-offset-8">CHOOSE YOUR WEAPON</h2>
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-2 scrollbar-hide snap-x">
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onMouseEnter={() => setHovered(card.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => {
                            playSound('/sounds/select.mp3', 0.5);
                            onSelect(`${card.id} ramen`);
                        }}
                        className={`relative min-w-[220px] p-6 snap-center text-left ${card.bg} border-4 border-[#1A0E0A] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group overflow-hidden
              ${selectedType === card.id
                                ? 'scale-105 shadow-[16px_16px_0_#FF3D00] -translate-y-3 animate-pulse'
                                : 'shadow-[8px_8px_0_#1A0E0A] hover:scale-110 hover:-translate-y-3 hover:shadow-[20px_20px_0_#FF3D00]'}`}
                    >
                        {/* Background texture */}
                        <div className="absolute inset-0 texture opacity-30 pointer-events-none z-10" />

                        {/* Magic Preview Glow */}
                        <div
                            className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100 z-0 pointer-events-none"
                            style={{
                                background: hovered === card.id
                                    ? `radial-gradient(circle at center, ${ramenThemes[card.id]?.primary}55, transparent 70%)`
                                    : "transparent"
                            }}
                        />

                        <h4 className={`${card.text} font-black text-3xl tracking-tighter mb-2 relative z-20`}>{card.name}</h4>
                        <div className={`px-2 py-1 inline-block border-2 ${card.id === 'shoyu' ? 'border-[#FFF3E0]' : 'border-[#1A0E0A]'} font-bold text-sm tracking-widest relative z-20 ${card.text}`}>
                            {card.desc}
                        </div>

                        {/* Accent mark */}
                        <div className="absolute -bottom-10 -right-10 text-9xl font-black opacity-10 rotate-12 pointer-events-none select-none z-10">
                            🔥
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
