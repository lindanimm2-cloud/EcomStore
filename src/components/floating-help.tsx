"use client";

import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Sparkles, X, Send } from "lucide-react";

const WHATSAPP_NUMBER = "27665290079"; // Aheers mobile · demo
const WHATSAPP_TEXT = encodeURIComponent("Hi Aheers — I need help with an order / store enquiry.");

const AI_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /deliver|eta|track|fleet/i,
    reply: "You can track deliveries in My Account → Deliveries, or use Track Order with your order number (try ORD-1043).",
  },
  {
    match: /reward|cashback|points|infinity/i,
    reply: "Infinity Rewards gives ~1% cashback on qualifying buys. Open Rewards / Portal to see your digital card and balances.",
  },
  {
    match: /special|deal|promo/i,
    reply: "Weekly specials are on the Specials page — member prices show when you’re signed in.",
  },
  {
    match: /trade|wholesale|powertrade|credit/i,
    reply: "PowerTrade has its own business login for RFQ, credit and bulk pricing. Use footer Team access or /login/trade.",
  },
  {
    match: /store|open|hour|address/i,
    reply: "We’re at 93 Voortrekker St, Greytown · 033 413 1156. Switch stores from the top “Store” menu — carts stay separate.",
  },
  {
    match: /hello|hi|hey|help/i,
    reply: "Hi! I’m the Aheers demo assistant. Ask about delivery, rewards, specials, stores, or trade accounts.",
  },
];

type ChatMsg = { role: "user" | "assistant"; text: string };

function aiReply(input: string): string {
  for (const row of AI_REPLIES) {
    if (row.match.test(input)) return row.reply;
  }
  return "Thanks — for live help tap WhatsApp. In this demo I can cover delivery tracking, rewards, specials, store hours, and PowerTrade.";
}

export function FloatingHelpButtons() {
  const pathname = usePathname();
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      text: "Hi — I’m the Aheers assistant. Ask about orders, rewards, specials, or stores.",
    },
  ]);
  const [draft, setDraft] = useState("");

  // Hide on immersive login portals and keep clear of admin wrench
  if (
    pathname.startsWith("/login/staff") ||
    pathname.startsWith("/login/driver") ||
    pathname.startsWith("/login/trade") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/driver") ||
    pathname.startsWith("/trade")
  ) {
    return null;
  }

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((prev) => [...prev, { role: "user", text }, { role: "assistant", text: aiReply(text) }]);
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => setAiOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-aheers-green text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-aheers-green-light"
          aria-label="AI assistant"
          title="AI assistant"
        >
          <Sparkles className="h-6 w-6" />
        </button>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:-translate-y-0.5 hover:brightness-110"
          aria-label="WhatsApp Aheers"
          title="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>

      {aiOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end bg-black/30 p-4 sm:items-end" onClick={() => setAiOpen(false)}>
          <div
            className="flex h-[min(32rem,80vh)] w-full max-w-md animate-fade-up flex-col overflow-hidden rounded-3xl bg-white shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-aheers-green-dark px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aheers-gold/20 text-aheers-gold">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Aheers assistant</p>
                  <p className="text-[10px] text-white/50">Demo AI · not live support</p>
                </div>
              </div>
              <button type="button" onClick={() => setAiOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-aheers-mist/40 px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-aheers-green text-white"
                      : "bg-white text-gray-800 shadow-soft ring-1 ring-black/5"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={send} className="flex gap-2 border-t border-gray-100 bg-white p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about delivery, rewards…"
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-aheers-green"
              />
              <button type="submit" className="flex h-11 w-11 items-center justify-center rounded-xl bg-aheers-green text-white" aria-label="Send">
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="bg-white px-4 pb-3 text-center text-[10px] text-gray-400">
              Prefer a human?{" "}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#25D366] hover:underline"
              >
                WhatsApp Aheers
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
