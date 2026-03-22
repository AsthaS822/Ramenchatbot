'use client';

import React from 'react';

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#FFF3E0] texture border-b-8 border-[#1A0E0A] pt-16 pb-12">

      {/* Background city style */}
      <video
        src="/media/0_Noodles_Take_out_Box_2160x2160.mp4"
        autoPlay loop muted playsInline
        className="absolute w-full h-full object-cover opacity-30 grayscale mix-blend-multiply"
      />

      {/* Flame block */}
      <div className="absolute bottom-0 w-full h-[45%] flame-bg border-t-[12px] border-[#1A0E0A]"></div>

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center mt-10">

        {/* Floating Ramen Bowl Product Shot */}
        <div className="relative mb-6 animate-float group">
          <video
            src="/media/Ramen.webm"
            autoPlay loop muted playsInline
            className="w-56 md:w-80 z-10 relative drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
          />
          {/* Flame glow */}
          <div className="absolute inset-0 bg-[#FF3D00] blur-[80px] opacity-60 mix-blend-screen -z-10 group-hover:opacity-80 transition-opacity"></div>
        </div>

        <h1 className="text-7xl md:text-9xl font-black text-[#1A0E0A] uppercase tracking-tighter leading-[0.8] mb-8 drop-shadow-[4px_4px_0_white]">
          WHERE FLAME<br />
          <span className="text-white drop-shadow-[4px_4px_0_#1A0E0A]">MEETS FLAVOR</span>
        </h1>

        <button
          onClick={() => scrollTo('menu')}
          className="mt-4 px-12 py-5 bg-[#1A0E0A] text-white font-black text-2xl uppercase tracking-widest rounded-full shadow-[8px_8px_0_#FF3D00] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0_#FF3D00] hover:bg-[#FF3D00] transition-all"
        >
          Start Cooking 🍜
        </button>
      </div>

    </section>
  );
}
