'use client';

import React, { useState, useEffect, useRef } from 'react';
import { playSound, stopSound, speakSensei, stopAllSounds } from '@/lib/soundManager';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ChatInterface from '@/components/ChatInterface';
import FactPanel from '@/components/FactPanel';
import CookingSimulation from '@/components/CookingSimulation';
import RamenCards from '@/components/RamenCards';
import ToppingsStrip from '@/components/ToppingsStrip';
import { defaultTheme, ramenThemes } from '@/lib/ramenThemes';

export type RamenState = {
  broth: string;
  spice: string;
  type: string;
  stage: string;
};

type Message = {
  id: string;
  role: 'user' | 'sensei';
  content: string;
  media?: string;
};

export default function Home() {
  const [theme, setTheme] = useState(defaultTheme);
  const [themeTimeout, setThemeTimeout] = useState<NodeJS.Timeout | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'sensei', content: "WELCOME TO THE FLAME KITCHEN. WHAT FUEL DO YOU DESIRE TODAY?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatFullScreen, setChatFullScreen] = useState(false);
  const [facts, setFacts] = useState<string[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Step 1: Handle immediate speech cancellation on mute toggle
  useEffect(() => {
    if (!voiceEnabled && typeof window !== 'undefined') {
      if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
      window.speechSynthesis.cancel();
    }
  }, [voiceEnabled]);

  const [ramenState, setRamenState] = useState<RamenState>({
    broth: 'UNKNOWN',
    spice: 'LOW',
    type: 'STANDARD',
    stage: 'IDLE'
  });

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [activeTopping, setActiveTopping] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const handleOpen = () => setChatFullScreen(true);
    const handleClose = () => {
      setChatFullScreen(false);
      if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
      window.speechSynthesis.cancel();
      stopAllSounds(); // Ensure all cooking audio stops on exit
    };
    window.addEventListener("openChatFull", handleOpen);
    window.addEventListener("closeChatFull", handleClose);
    return () => {
      window.removeEventListener("openChatFull", handleOpen);
      window.removeEventListener("closeChatFull", handleClose);
    };
  }, []);

  useEffect(() => {
    if (chatFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [chatFullScreen]);

  const sanitizeForSpeech = (text: string) => {
    return text
      .replace(/[#*_~`]/g, "") // Remove markdown
      .replace(/━━━━━/g, "")   // Remove dividers
      .replace(/\(([^)]+)\)/g, " or $1") // Convert (Substitute) to "or Substitute" for natural flow
      .split('\n')
      .map(line => line.replace(/^\s*\d+[\.\)]\s+/, "")) // Remove leading numbers
      .map(line => line.replace(/^\s*[\-\+\*]\s+/, ", ")) // Convert bullets to commas for pauses
      .join(' ')
      .replace(/\s+/g, ' ') // Cleanup whitespace
      .trim();
  };

  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addSenseiMessage = (text: string, media?: string) => {
    setMessages((prev: Message[]) => [...prev, { id: crypto.randomUUID(), role: 'sensei', content: text, media }]);
    
    // Step 2: Queue Sensei voice response with 10-second cinematic delay
    if (voiceEnabled) {
      if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
      
      const cleanText = sanitizeForSpeech(text);
      if (cleanText) {
        voiceTimeoutRef.current = setTimeout(() => {
          speakSensei(cleanText);
        }, 10000); // 10 seconds of pure fire/frying sounds first
      }
    }

    if (themeTimeout) clearTimeout(themeTimeout);
    const timeout = setTimeout(() => {
      setTheme(defaultTheme);
    }, 60000);
    setThemeTimeout(timeout);
  };

  const sendToAI = async (text: string) => {
    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setIsTyping(false);

      const parsed = data;

      let messageMedia: string = "/media/ramenoodles.mp4"; // Step 3: Default asset fallback
      const typeStr = (parsed.ramen && parsed.ramen.type) ? parsed.ramen.type.toLowerCase() : "";
      const userTextStr = text.toLowerCase();
      const stageStr = (parsed.ramen && parsed.ramen.stage) ? parsed.ramen.stage.toLowerCase() : "";

      // Step 4: Map specific ramen types to background media assets
      switch (typeStr) {
        case "veg":
          messageMedia = "/media/vegramenai.avif";
          break;
        case "miso":
          messageMedia = "/media/misoramen.png";
          break;
        case "shoyu":
          messageMedia = "/media/shoyuramenai.webp";
          break;
        case "tonkotsu":
          messageMedia = "/media/tonkotsu.avif";
          break;
        default:
          // Multicultural fallbacks
          if (typeStr.match(/(korean|chinese|indian|ramyeon|lamian|fusion)/)) {
            messageMedia = "/media/Ramen.webm";
          } 
          // Special staging for Plating
          else if (stageStr === 'plating') {
            messageMedia = "/media/noodles.webm";
          }
          // General recipe fallback
          else {
            messageMedia = "/media/ramenoodles.mp4";
          }
      }

      const fullMessage = `${parsed.answer || ""}
${parsed.message ? `
━━━━━━━━━━━━━━━
🔥 ${parsed.message}` : ""}`;

      addSenseiMessage(fullMessage || "SILENCE. WATCH THE BROTH.", messageMedia);
      setSelectedIngredients([]);

      if (parsed.facts && Array.isArray(parsed.facts)) {
        setFacts(parsed.facts.slice(0, 2));
      }

      if (parsed.ramen) {
        setRamenState((prev: RamenState) => ({
          ...prev,
          ...(parsed.ramen.type && { type: parsed.ramen.type.toUpperCase() }),
          ...(parsed.ramen.spice && { spice: parsed.ramen.spice.toUpperCase() }),
          ...(parsed.ramen.stage && { stage: parsed.ramen.stage.toLowerCase() }),
          broth: parsed.ramen.type ? `${parsed.ramen.type.toUpperCase()} BASE` : prev.broth
        }));

        const typeKey = parsed.ramen.type?.toLowerCase();
        if (typeKey && ramenThemes[typeKey as keyof typeof ramenThemes]) {
          setTheme(ramenThemes[typeKey as keyof typeof ramenThemes]);
          if (themeTimeout) clearTimeout(themeTimeout);
          const t = setTimeout(() => setTheme(defaultTheme), 60000);
          setThemeTimeout(t);
        }
      }
    } catch (err) {
      addSenseiMessage("THE FLAME IS TOO HOT. I CANNOT HEAR YOU (API ERROR).");
      setIsTyping(false);
    }
  };

  const handleSendMessage = (text: string) => {
    setChatExpanded(true);
    
    const isRecipe = text.toLowerCase().includes("how") || text.toLowerCase().includes("recipe");
    if (isRecipe) {
      setChatFullScreen(true);
    }

    setMessages((prev: Message[]) => [...prev, { id: crypto.randomUUID(), role: 'user', content: text }]);
    sendToAI(text);
  };

  const copyShareBowl = () => {
    const shareText = `🔥 My Custom Ramen:
${selectedIngredients.join(", ")}
Built with AI Sensei 🍜`;
    navigator.clipboard.writeText(shareText);
    addSenseiMessage("LINK COPIED! SHARE YOUR CREATION WITH THE WORLD!");
    playSound("/sounds/serve.mp3", 0.8);
  };

  // Auto shrink Chat
  useEffect(() => {
    if (!isTyping && !chatFullScreen) {
      const t = setTimeout(() => {
        setChatExpanded(false);
      }, 60000);
      return () => clearTimeout(t);
    }
  }, [isTyping, chatFullScreen]);

  const handleCardSelect = (text: string) => {
    playSound('/sounds/serve.mp3', 0.8);
    const ramenId = text.split(" ")[0].toLowerCase();

    const selectedTheme = ramenThemes[ramenId as keyof typeof ramenThemes];
    if (selectedTheme) {
      setTheme(selectedTheme);
      if (themeTimeout) clearTimeout(themeTimeout);
      const t = setTimeout(() => setTheme(defaultTheme), 60000);
      setThemeTimeout(t);
    }

    setSelectedCard(ramenId);

    setRamenState((prev: RamenState) => ({
      ...prev,
      type: ramenId.toUpperCase(),
      broth: `${ramenId.toUpperCase()} BASE`,
      stage: 'boiling'
    }));

    // Step 5: Transition to fullscreen immersion mode
    setChatFullScreen(true);

    // Step 6: Process user selection and initiate AI recipe sequence
    handleSendMessage(`I'LL TAKE THE ${ramenId.toUpperCase()} RAMEN, SENSEI!`);

    document.body.classList.add("flash");
    setTimeout(() => {
      document.body.classList.remove("flash");
    }, 300);
  };

  const handleToppingSelect = (id: string) => {
    setActiveTopping(id);
    playSound("/sounds/drop.mp3", 0.7);

    setTimeout(() => setActiveTopping(null), 1000);

    setSelectedIngredients((prev) => {
      if (prev.includes(id)) {
        addSenseiMessage(`YOU ALREADY ADDED ${id.toUpperCase()}! DO NOT WASTE THE HARVEST!`);
        return prev;
      }
      
      const updated = [...prev, id];

      const actions = ["BOILING", "SAUTÉING", "PAN-FRYING", "GENTLY PLACING", "STIRRING IN"];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];

      if (updated.length === 1) {
        addSenseiMessage(`${randomAction} THE ${id.toUpperCase()}... THE BASE AWAKENS.`);
      } else if (updated.length === 2) {
        addSenseiMessage(`${randomAction} THE ${id.toUpperCase()}... FLAVOR FORMING.`);
      }

      // Per-ingredient reaction
      sendToAI(JSON.stringify({
        type: "ingredient_reaction",
        ingredient: id,
        currentIngredients: updated,
        currentRamen: ramenState.type,
        action: randomAction
      }));

      if (updated.length >= 3) {
        // Full recipe trigger
        setTimeout(() => {
          sendToAI(JSON.stringify({
            type: "ingredient_mode",
            ingredients: updated,
            currentRamen: ramenState.type,
            request: "Generate best ramen recipe"
          }));
        }, 800);

        // Smooth Reset
        setTimeout(() => {
          setSelectedIngredients([]);
        }, 1200);
      }

      return updated;
    });
  };

  return (
    <main
      style={{
        backgroundColor: theme.bg,
        color: theme.text
      }}
      className="min-h-screen font-sans selection:bg-white/20 scroll-smooth texture relative transition-all duration-700 pb-24"
    >
      <Navbar />

      {/* Global Theme Glow Layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, ${theme.glow}44, transparent 70%)`
        }}
      />

      {/* Persistent Cinematic Motion Graphic Background */}
      <video
        src="/media/6914536_Motion_Graphics_Motion_Graphic_3840x2160.mov"
        autoPlay loop muted playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-5 pointer-events-none z-0 mix-blend-overlay"
      />

      <div className={`pt-16 relative z-10 ${chatFullScreen ? "hidden" : "block"}`}>
        <HeroSection />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col gap-12 relative z-10">

        <div className={`${chatFullScreen ? "hidden" : "block"}`}>
          <section id="menu" className="scroll-mt-24 bg-white border-4 border-[#1A0E0A] p-6 shadow-[16px_16px_0_#1A0E0A] texture group hover:shadow-[16px_16px_0_var(--glow)] transition-shadow" style={{ '--glow': theme.glow } as React.CSSProperties}>
            <RamenCards onSelect={handleCardSelect} selectedType={selectedCard} />
          </section>
        </div>

        <div className={`grid grid-cols-1 xl:grid-cols-12 gap-10 min-h-[700px] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]`}>

          <section id="chat" className={`scroll-mt-24 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            chatFullScreen 
              ? "fixed inset-0 z-[9999] w-full h-screen flex items-center justify-center bg-[#FFF3E0]/95 backdrop-blur-2xl p-4 md:p-8 lg:p-12" 
              : chatExpanded 
                ? "xl:col-span-6 h-[600px] xl:h-[750px]" 
                : "xl:col-span-4 h-[600px] xl:h-[750px]"
            }`}>
            <div className={chatFullScreen ? "w-full max-w-5xl h-[90vh] flex flex-col" : "w-full h-full"}>
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
                theme={theme}
                expanded={chatExpanded}
                setExpanded={setChatExpanded}
                fullScreen={chatFullScreen}
                voiceEnabled={voiceEnabled}
                setVoiceEnabled={setVoiceEnabled}
              />
            </div>
          </section>

          <div className={`${chatFullScreen ? "hidden" : "contents"}`}>
            <section id="kitchen" className={`scroll-mt-24 flex flex-col gap-10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${chatExpanded ? "xl:col-span-6" : "xl:col-span-8"
              }`}>
            <div className="w-full">
                <CookingSimulation
                  stage={ramenState.stage as any}
                  ingredients={selectedIngredients}
                  theme={theme}
                  spice={ramenState.spice}
                  type={ramenState.type}
                />
            </div>

            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full max-w-4xl flex flex-col gap-3">
                <div className="text-sm font-bold border-4 border-[#1A0E0A] bg-white p-3 uppercase tracking-wide shadow-[4px_4px_0_#1A0E0A] text-center flex flex-col items-center gap-2">
                  <div>Current Ingredients: {selectedIngredients.join(", ") || "None"}</div>
                  {selectedIngredients.length > 0 && (
                    <button 
                      onClick={copyShareBowl}
                      className="text-xs bg-[#1A0E0A] text-white px-3 py-1 rounded-full hover:bg-[#FF3D00] transition-colors"
                    >
                      SHARE BOWL 🔗
                    </button>
                  )}
                </div>
                <ToppingsStrip onSelect={handleToppingSelect} isTyping={isTyping} selectedIngredients={selectedIngredients} />
              </div>
            </div>

            <div className={`grid grid-cols-1 ${chatExpanded ? 'md:grid-cols-1' : 'md:grid-cols-1'} gap-10`}>
              <div className="w-full">
                <FactPanel state={ramenState} theme={theme} facts={facts} />
              </div>
            </div>
            </section>
          </div>

        </div>

      </div>
    </main>
  );
}
