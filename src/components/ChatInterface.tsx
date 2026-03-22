'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX } from 'lucide-react';
import { playSound } from '@/lib/soundManager';

interface MessageType {
    id: string;
    role: 'user' | 'sensei';
    content: string;
    media?: string;
}

interface ChatInterfaceProps {
    onSendMessage: (msg: string) => void;
    messages: Array<MessageType>;
    isTyping: boolean;
    theme: any;
    voiceEnabled: boolean;
    setVoiceEnabled: (enabled: boolean) => void;
    expanded?: boolean;
    setExpanded?: (val: boolean) => void;
    fullScreen?: boolean;
}

export default function ChatInterface({ 
    onSendMessage, 
    messages, 
    isTyping, 
    theme, 
    voiceEnabled, 
    setVoiceEnabled,
    expanded,
    setExpanded,
    fullScreen
}: ChatInterfaceProps) {
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const suggestedPrompts = [
        "KOREAN RAMYEON",
        "CHINESE LAMIAN",
        "INDIAN FUSION"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            playSound('/sounds/send.mp3', 0.4);
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-4 border-[#1A0E0A] rounded-2xl shadow-[12px_12px_0px_#1A0E0A] overflow-hidden texture relative">

            {/* Step 1: Branding and Controls Header */}
            <div className="p-4 border-b-4 border-[#1A0E0A] flex items-center justify-between transition-colors duration-700" style={{ backgroundColor: theme.primary }}>
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full border-4 border-[#1A0E0A] overflow-hidden bg-white shadow-[4px_4px_0_#1A0E0A]">
                        <video src="/media/chef.webm" autoPlay loop muted playsInline className="w-full h-full object-cover scale-125" />
                    </div>
                    <div>
                        <h2 className="text-[#1A0E0A] font-black text-2xl uppercase tracking-tighter leading-none decoration-4">SENSEI</h2>
                        <p className="text-[#1A0E0A]/80 font-bold text-xs uppercase tracking-widest drop-shadow-sm">Master of Flame</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className="bg-white/90 p-2 rounded-full border-2 border-[#1A0E0A] shadow-[2px_2px_0_#1A0E0A] hover:scale-110 active:scale-95 transition-all text-[#1A0E0A]"
                        title={voiceEnabled ? "Mute Sensei" : "Unmute Sensei"}
                    >
                        {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("closeChatFull"))}
                        className="bg-[#1A0E0A] text-white px-4 py-2 font-black text-sm uppercase tracking-widest border-2 border-transparent shadow-[2px_2px_0_rgba(255,255,255,0.8)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[0_0_0_rgba(255,255,255,0.8)] transition-all"
                    >
                        CLOSE ✕
                    </button>
                </div>
            </div>

            {/* Step 2: Scrollable Conversation History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`px-6 py-4 rounded-2xl font-bold max-w-[85%] text-lg md:text-xl leading-relaxed tracking-normal whitespace-pre-line border-4 border-[#1A0E0A] transition-all duration-700 ${msg.role === 'user' ? 'rounded-br-sm uppercase' : 'rounded-bl-sm'
                                }`}
                            style={{
                                backgroundColor: msg.role === 'user' ? theme.primary : theme.glow,
                                color: theme.bg === '#1A0E0A' && msg.role !== 'user' ? '#1A0E0A' : theme.text,
                                boxShadow: msg.role === 'user' ? `4px 4px 0 #1A0E0A` : `0 0 20px ${theme.glow}`
                            }}
                        >
                            {msg.media && (
                                <div className="mb-4 rounded-xl border-4 border-[#1A0E0A] overflow-hidden shadow-[4px_4px_0_#1A0E0A]">
                                    {msg.media.match(/\.(webm|mp4|mov)$/i) ? (
                                        <video src={msg.media} autoPlay loop muted playsInline className="w-full h-auto max-h-[350px] object-cover" />
                                    ) : (
                                        <img src={msg.media} alt="Ramen Recipe" className="w-full h-auto max-h-[350px] object-cover hover:scale-105 transition-transform duration-700" />
                                    )}
                                </div>
                            )}
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="px-6 py-4 rounded-2xl bg-white border-4 border-[#1A0E0A] rounded-bl-sm shadow-[4px_4px_0px_#1A0E0A] flex gap-2">
                            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: '0ms' }} />
                            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: '150ms' }} />
                            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                
                <div ref={bottomRef} />
            </div>

            {/* Step 3: Fast-Action Recipe Shortcuts */}
            <div className="px-4 pb-4 flex gap-3 overflow-x-auto scrollbar-hide">
                {suggestedPrompts.map((prompt, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSendMessage(prompt)}
                        className="whitespace-nowrap px-4 py-2 rounded-full bg-white text-[#1A0E0A] font-black uppercase text-sm border-2 border-[#1A0E0A] transition-colors shadow-[2px_2px_0_#1A0E0A]"
                        style={{ hover: { backgroundColor: theme.primary, color: 'white' } } as any} // Native hover needs css or classes, but simplest is keeping standard black/primary hover for consistency
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.primary; e.currentTarget.style.color = '#FFF' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#1A0E0A' }}
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Step 4: AI Command Entry */}
            <div className="p-4 border-t-4 border-[#1A0E0A] bg-white">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="ASK SENSEI..."
                        className="w-full bg-[#FFF3E0] text-[#1A0E0A] font-black uppercase placeholder-[#1A0E0A]/30 border-4 border-[#1A0E0A] shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)] rounded-full px-6 py-4 outline-none focus:ring-4 transition-all text-lg"
                        style={{ '--tw-ring-color': theme.glow } as React.CSSProperties}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#1A0E0A] flex items-center justify-center text-white hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[2px_2px_0_#1A0E0A]"
                        style={{ backgroundColor: theme.primary }}
                    >
                        <Send size={24} className="translate-x-[-1px] translate-y-[1px]" color="#1A0E0A" strokeWidth={3} />
                    </button>
                </form>
            </div>

        </div>
    );
}
