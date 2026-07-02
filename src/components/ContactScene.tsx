import { useState, useCallback } from "react";
import { Mail, Globe, Send, Code2 } from "lucide-react";
import NatureBackground from "./NatureBackground";

interface ContactSceneProps { active: boolean; transitioning: boolean; }

export default function ContactScene({ active, transitioning }: ContactSceneProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    window.location.href = `mailto:songyu@example.com?subject=Portfolio Contact from ${encodeURIComponent(email)}&body=${encodeURIComponent(message)}`;
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  const socialLinks = [
    { icon: <Code2 size={18} />, label: "GitHub", href: "https://github.com/sy889c0der", desc: "Open source projects" },
    { icon: <Globe size={18} />, label: "Live Demo", href: "https://sy889c0der.github.io/wilderness", desc: "Interactive web experiments" },
    { icon: <Mail size={18} />, label: "Email", href: "mailto:songyu@example.com", desc: "songyu@example.com" },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-nature overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", visibility: active ? "visible" : "hidden" }}
      onMouseMove={onMouseMove}>
      <NatureBackground mouseX={mousePos.x} mouseY={mousePos.y} density="full" />

      <div className={`relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 py-12 ${active && !transitioning ? "scene-content-in" : ""}`}>
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#e8702a]/30 bg-gradient-to-br from-[#183610] to-[#0b1c06] flex items-center justify-center mb-5">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-30">
              <circle cx="24" cy="17" r="9" stroke="rgba(232,112,42,0.5)" strokeWidth="1.5" />
              <path d="M10 39c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="rgba(232,112,42,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-playfair italic text-3xl sm:text-4xl md:text-5xl text-white text-center leading-tight">
            Contact
          </h2>
        </div>

        <p className="text-[#e8702a]/80 text-xs sm:text-sm uppercase tracking-[0.25em] mb-3 text-center">Get in Touch</p>

        <p className="text-white/35 text-sm sm:text-base text-center max-w-lg mx-auto mb-10 leading-relaxed">
          Have a project in mind, a collaboration idea, or just want to say hello?
          Drop a message &mdash; I'd love to hear what's growing in your world.
        </p>

        {/* Social cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 max-w-xl mx-auto">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#e8702a]/25 transition-all group">
              <div className="w-9 h-9 rounded-full bg-[#e8702a]/10 flex items-center justify-center text-[#e8702a] group-hover:bg-[#e8702a]/22 transition-colors shrink-0">
                {link.icon}
              </div>
              <div className="min-w-0">
                <p className="text-white/80 text-xs font-medium">{link.label}</p>
                <p className="text-white/22 text-[10px] truncate">{link.desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Message form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-3">
          <input type="email" placeholder="Your email address"
            className={`contact-input ${focusedField === "email" ? "scale-[1.012]" : ""}`}
            value={email} onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} required />
          <textarea placeholder="Your message..." rows={3}
            className={`contact-input ${focusedField === "message" ? "scale-[1.012]" : ""}`}
            value={message} onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)} required
            style={{ resize: "none" }} />
          <button type="submit"
            className={`flex items-center justify-center gap-2 bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-6 py-3.5 rounded-full transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 ${!sent ? "btn-glow" : ""}`}
            disabled={sent}>
            {sent ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Message Sent!
              </span>
            ) : (
              <><Send size={14} /> Send Message</>
            )}
          </button>
        </form>

        {/* Bottom contact footer */}
        <div className="mt-14 text-center text-white/12 text-[10px] uppercase tracking-[0.25em] space-y-1.5">
          <p className="text-white/25 text-xs font-medium">Song Yu</p>
          <p>Designer &amp; Developer</p>
          <p>songyu@example.com &nbsp;&middot;&nbsp; github.com/sy889c0der</p>
        </div>
      </div>
    </div>
  );
}
