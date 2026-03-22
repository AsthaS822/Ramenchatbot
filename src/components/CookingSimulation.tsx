'use client';

import React, { useEffect, useState } from 'react';
import { playSound, stopSound } from '@/lib/soundManager';

interface CookingSimulationProps {
    stage: 'idle' | 'boiling' | 'ingredients' | 'noodles' | 'plating';
    ingredients: string[];
    theme: any;
    spice: string;
}

export default function CookingSimulation({ stage, ingredients, theme, spice }: CookingSimulationProps) {
    const [activeTopping, setActiveTopping] = useState<string | null>(null);

    useEffect(() => {
        // Stop previous looping sounds
        stopSound("boil");
        stopSound("fire");
        stopSound("fry");

        let soundTimeout: NodeJS.Timeout;

        if (stage === 'boiling') {
            console.log("🔊 SYNC: Auto-Trigger Trial by Fire (Fire + Boil)");
            playSound('/sounds/boil.mp3', 0.3, true, "boil"); 
            playSound('/sounds/fire.mp3', 0.2, true, "fire"); 
            
            soundTimeout = setTimeout(() => {
                console.log("🔊 SYNC: Auto-Stop Fire Level");
                stopSound("fire");
                stopSound("boil");
            }, 12000);
        }

        if (stage === 'ingredients') {
            console.log("🔊 SYNC: Auto-Trigger Forging Flavors (Fry + Chop)");
            playSound('/sounds/fry.mp3', 0.4, true, "fry"); 
            playSound('/sounds/chop.mp3', 0.5);
            
            soundTimeout = setTimeout(() => {
                console.log("🔊 SYNC: Auto-Stop Fry Level");
                stopSound("fry");
            }, 12000);
        }

        if (stage === 'noodles') {
            playSound('/sounds/noodles-drop.mp3', 0.6);
        }

        if (stage === 'plating') {
            playSound('/sounds/serve.mp3', 0.7);
            stopSound("boil");
        }

        // Spice-based intensity
        if (spice === "MAXIMUM FIRE") {
            playSound('/sounds/fire-burst.mp3', 0.9);
        } else if (spice === "HIGH") {
            playSound('/sounds/sizzle.mp3', 0.5);
        }

        return () => {
            if (soundTimeout) clearTimeout(soundTimeout);
            // cleanup on stage change
            if (stage === 'plating') {
                stopSound("fire");
            }
        };
    }, [stage, spice]);

    useEffect(() => {
        if (ingredients.length > 0) {
            const latest = ingredients[ingredients.length - 1];
            setActiveTopping(latest);
            playSound('/sounds/drop.mp3', 0.4);
            setTimeout(() => setActiveTopping(null), 1000);
        }
    }, [ingredients.length]);

    const intensity = spice === "HIGH" || spice === "MAXIMUM FIRE"
        ? "scale-150 opacity-100"
        : spice === "MEDIUM"
            ? "scale-125 opacity-80"
            : "scale-100 opacity-50";

    return (
        <div className="relative w-full h-[400px] flex items-center justify-center bg-white border-4 border-[#1A0E0A] shadow-[16px_16px_0_#1A0E0A] texture overflow-hidden p-8 transition-colors duration-700 group hover:shadow-[16px_16px_0_var(--glow)]" style={{ '--glow': theme.glow } as React.CSSProperties}>

            {/* Bowl Glow reacts to Theme */}
            <div
                className="absolute inset-0 blur-[80px] opacity-60 transition-all duration-700 pointer-events-none"
                style={{ background: theme.glow }}
            />

            {/* Hero Bowl Object */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">

                {/* Steam overlay logic based on Theme Glow */}
                <div className={`absolute -top-16 inset-x-0 w-64 h-64 mx-auto transition-opacity duration-1000 mix-blend-screen opacity-50 z-20 ${stage === 'boiling' || stage === 'plating' ? 'opacity-80' : 'opacity-20'
                    }`}>
                    <div
                        className="absolute inset-0 mix-blend-screen pointer-events-none transition-all duration-700 z-30"
                        style={{ background: `radial-gradient(circle, ${theme.glow}88, transparent 70%)` }}
                    />
                    <video src="/media/steam.webm" autoPlay loop muted playsInline className="w-full h-full object-cover relative z-10" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>

                {/* Noodle Video Drop */}
                {(stage === 'noodles' || stage === 'plating') && (
                    <video src="/media/noodles.webm" autoPlay loop muted playsInline className="absolute top-0 w-48 h-48 object-contain animate-noodle-drop z-30 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                )}

                {/* Active Topping Drop */}
                {activeTopping && (
                    <div key={activeTopping} className="absolute top-10 text-6xl animate-noodle-drop z-30 inline-block font-sans drop-shadow-[4px_4px_0_#1A0E0A]" style={{ animationDuration: '0.8s' }}>
                        {activeTopping === 'egg' ? '🥚' :
                            activeTopping === 'corn' ? '🌽' :
                                activeTopping === 'mushroom' ? '🍄' :
                                    activeTopping === 'paneer' ? '🧀' :
                                        activeTopping === 'chili oil' ? '🌶️' : '✨'}
                    </div>
                )}

                {/* The Bowl Asset */}
                <div className={`transition-transform duration-1000 relative z-10 w-64 h-64 flex items-center justify-center ${stage === 'plating' ? 'scale-125' : 'scale-100'
                    }`}>
                    <video
                        src="/media/Ramen.webm"
                        autoPlay loop muted playsInline
                        className="w-full h-full object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.6)] mix-blend-normal"
                    />
                </div>

                {/* Fire Animation Under Bowl reacting to Theme & Spice */}
                <div className={`absolute bottom-0 w-full h-32 flex justify-center mix-blend-screen transition-all duration-700 ${intensity}`}>
                    <div
                        className="absolute inset-0 blur-[100px] transition-colors duration-700 -z-10"
                        style={{ background: theme.primary }}
                    />
                </div>

            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-40 w-[90%] md:w-auto">
                <div className="bg-[#1A0E0A] text-white px-8 py-3 border-4 shadow-[8px_8px_0_var(--glow)] text-xl font-black uppercase tracking-widest transform -rotate-1 transition-all duration-700" style={{ borderColor: theme.primary, '--glow': theme.glow } as React.CSSProperties}>
                    {stage === 'idle' ? 'AWAITING ORDER' :
                        stage === 'boiling' ? 'TRIAL BY FIRE' :
                            stage === 'ingredients' ? 'FORGING FLAVORS' :
                                stage === 'noodles' ? 'NOODLE STORM' : 'FLAME MASTERPIECE'}
                </div>
            </div>

        </div>
    );
}
