'use client';

import React from 'react';
import { playSound } from '@/lib/soundManager';

interface ToppingsStripProps {
    onSelect: (topping: string) => void;
    isTyping?: boolean;
    selectedIngredients?: string[];
}

export default function ToppingsStrip({ onSelect, isTyping = false, selectedIngredients = [] }: ToppingsStripProps) {
    const toppings = [
        { id: 'egg', label: 'EGG', icon: '🥚', sound: '/sounds/drop.mp3' },
        { id: 'corn', label: 'CORN', icon: '🌽', sound: '/sounds/drop.mp3' },
        { id: 'mushroom', label: 'MUSHROOM', icon: '🍄', sound: '/sounds/drop.mp3' },
        { id: 'paneer', label: 'PANEER', icon: '🧀', sound: '/sounds/drop.mp3' },
        { id: 'chili oil', label: 'CHILI OIL', icon: '🌶️', sound: '/sounds/boil.mp3' },
        { id: 'nori', label: 'NORI', icon: '🍃', sound: '/sounds/drop.mp3' },
    ];

    const handleToppingClick = (id: string, sound: string) => {
        if (isTyping) return;
        playSound(sound, 0.7);
        onSelect(id);
    };

    return (
        <div className={`w-full bg-[#FF3D00] p-6 border-4 border-[#1A0E0A] shadow-[8px_8px_0_#1A0E0A] texture rotate-1 transition-opacity duration-300 ${isTyping ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-[#1A0E0A] uppercase font-black text-2xl tracking-tighter mb-4 decoration-4">🔥 ADD TOPPINGS</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide px-2">
                {toppings.map((t) => {
                    const isSelected = selectedIngredients.includes(t.id);
                    return (
                        <button
                            key={t.id}
                            disabled={isTyping}
                            onClick={() => handleToppingClick(t.id, t.sound)}
                            className={`flex items-center gap-3 whitespace-nowrap font-black text-lg uppercase border-4 border-[#1A0E0A] px-6 py-3 rounded-full hover:rotate-6 hover:scale-110 transition-all shadow-[4px_4px_0_#1A0E0A] group shrink-0 ${
                                isSelected 
                                    ? "bg-yellow-300 scale-110 -rotate-3 border-dashed" 
                                    : "bg-white text-[#1A0E0A]"
                            }`}
                        >
                            <span className={`scale-125 text-2xl group-hover:scale-150 transition-transform ${isSelected ? 'animate-bounce' : ''}`}>{t.icon}</span>
                            <span>{t.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
