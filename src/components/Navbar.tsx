'use client';

import React from 'react';

export default function Navbar() {
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#1A0E0A] border-b-4 border-[#FF3D00] shadow-[0_4px_20px_rgba(255,61,0,0.4)]">
            <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo / Brand */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => scrollTo('hero')}
                >
                    <div className="w-10 h-10 bg-white rounded-md border-2 border-[#FF3D00] overflow-hidden flex items-center justify-center">
                        <video src="/media/asian food in box.webm" autoPlay loop muted playsInline className="w-full h-full object-cover scale-150 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-white font-black text-xl tracking-tighter uppercase group-hover:text-[#FF3D00] transition-colors">
                        RAMEN SENSEI 🔥
                    </span>
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => scrollTo('menu')} className="text-white font-bold text-sm tracking-widest uppercase hover:text-[#FF3D00] transition-colors">Weapon</button>
                    <button onClick={() => { scrollTo('chat'); window.dispatchEvent(new CustomEvent("openChatFull")); }} className="text-white font-bold text-sm tracking-widest uppercase hover:text-[#FF3D00] transition-colors">Sensei Chat</button>
                    <button onClick={() => scrollTo('kitchen')} className="bg-[#FF3D00] text-white px-6 py-2 font-black text-sm tracking-widest uppercase border-2 border-[#1A0E0A] shadow-[4px_4px_0_#FFF3E0] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0_0_0_#FFF3E0] transition-all">
                        The Kitchen
                    </button>
                </div>
            </div>
        </nav>
    );
}
